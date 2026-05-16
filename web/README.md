# Sermon Skills — Dashboard (web)

`Design/concept-FINAL.html` 디자인 스펙을 Next.js 15 풀스택 앱으로 옮겼다.
같은 레포 `skills/` 폴더의 SKILL.md 21개를 한 화면에서 탐색·실행한다.

기본 동작 모드는 **구독형(`RUNNER_MODE=cli`)** 이다. Claude Code CLI 가 설치되어 있고
Pro/Max 로 로그인된 머신이라면 별도 API 키 없이 바로 사용할 수 있다.

```
web/
├── app/
│   ├── layout.tsx · globals.css · page.tsx                    ← 랜딩
│   ├── dashboard/layout.tsx · page.tsx · [skillId]/page.tsx   ← 대시보드 + 스킬 실행
│   └── api/chat/route.ts                                       ← 스트리밍 엔드포인트
├── components/                                                 ← UI 컴포넌트 + RunnerBadge
├── lib/
│   ├── skills.ts                                               ← 21개 스킬 메타
│   ├── store.ts                                                ← Zustand UI 상태
│   ├── system-prompt.ts                                        ← SKILL.md → system prompt
│   └── runners/
│       ├── cli-runner.ts                                       ← `claude` CLI subprocess
│       ├── api-runner.ts                                       ← Anthropic Messages API
│       └── index.ts                                            ← RUNNER_MODE 스위치
└── package.json
```

---

## 1. 빠른 시작 (Pro/Max 구독자)

### 1-1. Claude Code CLI 설치 및 로그인 (최초 1회)

```bash
# 설치: https://docs.claude.com/en/docs/claude-code 참고
# 설치 후 로그인 (브라우저가 열리고 claude.ai 로 인증)
claude
# 정상 동작 확인
claude --version
```

### 1-2. 본 앱 실행

```bash
cd web
npm install
cp .env.example .env.local        # RUNNER_MODE=cli 가 기본값
npm run dev
# → http://localhost:3000
```

대시보드 상단 우측에 **`● CLI · Pro/Max`** 배지가 보이면 구독 모드로 잘 붙은 것이다.
스킬 카드를 클릭 → 본문 입력 → "분석 시작" 을 누르면 Pro 한도 내에서 Claude Sonnet 응답이
스트리밍된다. 토큰당 별도 청구는 없다.

> Vercel·다른 서버리스 환경에서는 CLI 인증 세션이 없어서 이 모드로는 못 돌린다.
> 그쪽에 배포하려면 아래 §3 의 API 모드로 전환할 것.

---

## 2. 스킬 ↔ 대시보드 연결 방식

1. 사용자가 카드·사이드바에서 스킬 클릭 → `/dashboard/[skillId]`
2. 입력 폼(성경 본문 + 추가 요청) 작성 → "분석 시작"
3. `/api/chat` 가
   - `lib/skills.ts` 에서 slug → 폴더 매핑 조회 (예: `text-analysis` → `sermon-text-analysis-multimethod`)
   - `skills/<folder>/SKILL.md` 를 읽어 system prompt 로 감쌈
   - `RUNNER_MODE` 에 따라 CLI 또는 API 호출
4. 응답이 텍스트로 스트리밍되어 결과 영역에 토큰 단위로 표시

CLI 모드에서는 `skills/` 폴더가 spawn cwd 안에 그대로 보이므로 references 자동
참조가 살아 있다. API 모드에서는 SKILL.md 본문만 system prompt 로 들어간다.

---

## 3. 대안 모드 — Anthropic API 직접 호출

Pro/Max 구독이 없거나 Vercel 배포가 필요한 경우.

```env
# web/.env.local
RUNNER_MODE=api
ANTHROPIC_API_KEY=sk-ant-...
# CLAUDE_MODEL=claude-sonnet-4-6   # 선택
```

- 사용량만큼 토큰 단가 청구됨
- 대시보드 상단 배지가 `● API · pay-per-token` 으로 표시됨
- Vercel·Netlify·자체 서버리스 어디든 그대로 배포 가능

---

## 4. CLI 모드 트러블슈팅

| 증상 | 원인 / 해결 |
|------|----|
| `claude 명령을 찾을 수 없습니다` | Claude Code 미설치 또는 PATH 누락. `claude --version` 으로 확인. 절대 경로면 `.env.local` 에 `CLAUDE_CLI=/path/to/claude` |
| 401 / 인증 오류 | 같은 머신에서 `claude` 한 번 실행해 Pro/Max 로그인 완료할 것 |
| `claude CLI 가 출력을 내지 않았습니다` | `--output-format stream-json` 미지원 옛 버전일 가능성. `claude --version` 으로 확인 후 업데이트 |
| references 가 안 잡힘 | `CLAUDE_CWD` 가 `skills/` 폴더의 부모를 가리키는지 확인 (기본: 레포 루트) |

---

## 5. 배포

### 5-1. 로컬 Pro/Max 머신에서 호스팅 (구독 모드 그대로)

```bash
cd web
npm run build && npm run start
# 같은 머신 다른 사용자에게 LAN 으로 공유 가능
# 단, claude 세션은 호스팅 계정 한 명의 것을 공유하게 됨에 유의
```

### 5-2. Vercel (API 모드 전용)

```bash
vercel --cwd web
# 환경변수: RUNNER_MODE=api, ANTHROPIC_API_KEY=...
```

`skills/` 폴더가 빌드 산출물에 포함되어야 SKILL.md 가 읽힌다 — Vercel 은 레포 전체를
업로드하므로 별다른 조작 없이 동작한다.

### 5-3. Electron / Tauri 데스크탑 패키징 (구독 모드 + 배포)

각 사용자 머신에서 본인의 `claude` 세션으로 동작하므로 가장 깔끔한 배포 모델.
Next.js 빌드를 정적으로 export 하고 Electron 메인 프로세스에서 `child_process.spawn` 으로
`claude` 를 호출하는 방식. 본 레포에는 포함하지 않았다.

---

## 6. 환경변수 요약

| 변수 | 기본값 | 설명 |
|------|--------|-----|
| `RUNNER_MODE` | `cli` | `cli` (Pro/Max 구독) / `api` (Anthropic API) |
| `CLAUDE_CLI` | `claude` | CLI 모드에서 호출할 바이너리 |
| `CLAUDE_CWD` | 레포 루트 | CLI subprocess 의 cwd |
| `ANTHROPIC_API_KEY` | — | API 모드에서 필수 |
| `CLAUDE_MODEL` | `claude-sonnet-4-6` | API 모드 모델 ID |
| `SKILLS_DIR` | `<repo>/skills` | SKILL.md 가 있는 폴더 |
