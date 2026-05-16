# Sermon Skills Dashboard — Design Specification

> **버전**: 1.0 (2026-05-14)
> **목적**: 이 문서만으로 동일한 대시보드를 구현할 수 있는 완전한 디자인 스펙
> **실제 목업**: `concept-FINAL.html` (같은 폴더)

---

## 1. 프로젝트 개요

**Sermon Skills**는 21가지 AI 설교 연구 스킬을 한 곳에서 탐색하고 실행하는 대시보드다.

- **대상 사용자**: 목회자, 신학생, 설교 연구자
- **배포**: Vercel (`sermon-skills.vercel.app`)
- **기술 스택 권장**: Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui + Framer Motion + Vercel AI SDK

---

## 2. 페이지 구조 (3페이지)

```
[PAGE 1] 메인 랜딩 (히어로)
    ↓ "시작하기" 클릭
[PAGE 2] 대시보드 (사이드바 + 메인 콘텐츠)
    ↓ 스킬 선택/실행 클릭
[PAGE 3] 스킬 실행 (입력 → AI 분석 결과)
    ↔ 뒤로/앞으로 네비게이션
```

### PAGE 1: 메인 랜딩
- **히어로만** 표시. 사이드바 없음, 다른 콘텐츠 없음
- 중앙 정렬, 수직 가운데 배치
- 구성 요소:
  - 십자가 심볼 (CSS로 구현, gold 그라디언트, 펄스 애니메이션)
  - 오버라인: `AI-Powered Sermon Research` (gold, 대문자, 12px)
  - 타이틀: `말씀의 깊이를 / 한 곳에서 발견하다` (54px, 첫줄 gold shimmer)
  - 서브타이틀: 설명 문구 (18px, secondary 색상)
  - CTA 버튼 2개: `시작하기 →` (gold primary), `◎ 샘플 미리보기` (glass secondary)
  - 통계 4개: `21 전문 스킬 / 6 카테고리 / 5 신학자 코칭 / 8 회중 페르소나`
- 배경 효과: ambient orbs (3개), particles (8개), radial gradient glow

### PAGE 2: 대시보드
- **왼쪽 사이드바** (310px 고정) + **메인 콘텐츠**
- 사이드바: 워크플로우 순서대로 6개 카테고리 아코디언 (접기/펼치기)
- 메인 콘텐츠:
  - 탑바: ← → 네비게이션 + breadcrumb
  - 퀵스타트 칩 (5개)
  - 설교 준비 여정 맵 (7노드 플로우)
  - **전체 스킬 그리드** (3열, 21개 카드, 클릭 가능)

### PAGE 3: 스킬 실행
- 헤더: 스킬명 + 설명
- 입력 폼: 성경 본문 (text), 추가 요청 (textarea)
- `분석 시작 →` 버튼 → Claude API 스트리밍 결과 표시
- `← 대시보드로` 버튼

---

## 3. 디자인 시스템

### 3.1 색상 (Color Palette)

#### 배경
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--bg-deepest` | `#06060F` | body 배경 |
| `--bg-base` | `#0E0E1A` | 결과/코드 영역 배경 |
| `--bg-elevated` | `#161628` | 모달, 카드 배경 |
| `--bg-surface` | `#1E1E36` | 스크롤바, 입력필드 |
| `--bg-glass` | `rgba(14,14,26,0.78)` | 사이드바, 탑바 (backdrop-filter 적용) |
| `--bg-glass-card` | `rgba(22,22,40,0.55)` | 카드, 칩 (backdrop-filter 적용) |

#### 골드 액센트
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--gold-300` | `#FFD866` | shimmer 밝은 부분 |
| `--gold-400` | `#F0C040` | 주요 accent (버튼, 하이라이트, 제목) |
| `--gold-500` | `#D4A520` | 버튼 그라디언트 시작, hover |
| `--gold-glow` | `rgba(240,192,64,0.18)` | box-shadow glow |

#### 텍스트 (가독성 최적화)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--text-primary` | `#F2F2F6` | 제목, 본문 핵심 텍스트 |
| `--text-secondary` | `#B8B8D0` | 설명 텍스트, 서브타이틀 |
| `--text-tertiary` | `#8888A8` | 부가 정보, 카드 설명 |
| `--text-muted` | `#686888` | 비활성 텍스트, 카운트 |

#### 카테고리 색상
| 카테고리 | 색상 | 값 |
|----------|------|-----|
| 설교 기획 | 보라 | `#9B7AFF` |
| 본문 분석 | 파랑 | `#5B8DEF` |
| 역사·배경 | 골드 | `#F0C040` |
| 신학자 코칭 | 민트 | `#50D0A0` |
| 설교문 작성 | 핑크 | `#FF6B9D` |
| 검증 | 시안 | `#40D8E8` |

#### 보더
| 토큰 | 값 |
|------|-----|
| `--border-subtle` | `rgba(255,255,255,0.06)` |
| `--border-light` | `rgba(255,255,255,0.1)` |
| `--border-gold` | `rgba(240,192,64,0.18)` |

### 3.2 타이포그래피

#### 폰트 패밀리
| 용도 | 폰트 | 로딩 |
|------|-------|------|
| 제목 (한글) | `Noto Serif KR` | Google Fonts, wght 400/600/700/900 |
| 본문·UI | `Pretendard` | Google Fonts, wght 300-700 |
| 코드·원어 | `Noto Sans Mono` | Google Fonts, wght 400/500 |

#### 폰트 크기 가이드
| 요소 | 크기 | 굵기 | 비고 |
|------|------|------|------|
| 히어로 타이틀 | 54px | 900 | Noto Serif KR, gold shimmer |
| 히어로 서브 | 18px | 400 | Pretendard |
| 오버라인 | 12px | 600 | 대문자, letter-spacing 0.15-0.2em |
| 섹션 타이틀 | 28px | 700 | Noto Serif KR |
| 섹션 서브 | 15px | 400 | |
| 사이드바 카테고리명 | 15px | 600 | Pretendard |
| 사이드바 스킬명 | 14px | 500 | |
| 스킬 카드 이름 | 15px | 600 | |
| 스킬 카드 설명 | 12px | 400 | |
| 입력 필드 | 16px | 400 | |
| 버튼 (primary) | 17px | 700 | |
| 버튼 (exec) | 15px | 700 | |
| 결과 본문 | 15px | 400 | line-height 1.9 |
| 통계 숫자 | 34px | 900 | Noto Serif KR, gold |
| 빵크럼 | 14px | 400-600 | |
| 푸터 | 12px | 400 | |

**기본 line-height**: 1.75 (body), 결과 영역은 1.9

### 3.3 라운딩 (Border Radius)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-lg` | 14px | 버튼, 입력필드, 결과 영역 |
| `--radius-xl` | 20px | — |
| `--radius-2xl` | 28px | 모달, 웰컴패널 |
| 사이드바 로고 | 8px | |
| 칩 | 40px (pill) | |
| 네비게이션 버튼 | 8px | |

### 3.4 그림자 & 효과

#### Glass Morphism
```css
backdrop-filter: blur(24px) saturate(180%);
```
적용 대상: 사이드바, 탑바

#### Ambient Orbs (배경 장식)
3개의 원형 blur 요소, `position: fixed`, `filter: blur(100px)`, `pointer-events: none`
- 파랑 orb: `rgba(91,141,239,0.04)`, 500x500, 좌상단
- 골드 orb: `rgba(240,192,64,0.03)`, 600x600, 우중앙
- 보라 orb: `rgba(155,122,255,0.03)`, 400x400, 좌하단
- 공통: `animation: float 20s ease-in-out infinite` (30px 이동 + scale 0.95-1.05)

#### Particles (히어로 배경)
8개의 2px gold 점, `position: absolute`, 각각 다른 위치·딜레이
- `animation: pFloat 6-11s ease-in-out infinite`
- 효과: 위로 40px 이동 + scale 1→1.5 + opacity 0→0.6→0

#### Gold Shimmer (타이틀)
```css
background: linear-gradient(135deg, #FFD866 0%, #D4A520 40%, #FFD866 60%, #D4A520 100%);
background-size: 300% auto;
-webkit-background-clip: text;
animation: shimmer 4s linear infinite;
```

#### 십자가 심볼
CSS `::before` (세로 4x80px) + `::after` (가로 40x4px), gold gradient, pulse 애니메이션

---

## 4. 컴포넌트 상세

### 4.1 왼쪽 사이드바 (310px)

**위치**: 화면 왼쪽 고정 (`position: fixed; left: 0; top: 0; height: 100vh`)

**구조**:
```
┌─────────────────────┐
│ [S] Sermon Skills    │ ← 헤더 (로고 + 타이틀)
│     21개 AI 설교 스킬  │
├─────────────────────┤
│ ① 📋 설교 기획    4 ▼│ ← 아코디언 트리거
│   · 주제·메시지 코치   │ ← 스킬 아이템 (접힌 상태)
│   · 52주 연간 계획     │
│   · 교리설교 기획      │
│   · 다학제 주제 조사   │
├─────────────────────┤
│ ② 📖 본문 분석    5 ▼│
│ ③ 🏛️ 역사·배경   3 ▼│
│ ④ 🎓 신학자 코칭  6 ▼│
│ ⑤ ✍️ 설교문 작성  2 ▼│
│ ⑥ 👥 검증        1 ▼│
├─────────────────────┤
│ sermon-skills.vercel │ ← 푸터
└─────────────────────┘
```

**워크플로우 순서 (필수)**: ① 설교 기획 → ② 본문 분석 → ③ 역사·배경 → ④ 신학자 코칭 → ⑤ 설교문 작성 → ⑥ 검증

**아코디언 트리거 요소**:
- 번호 뱃지 (20px 원, 배경 `--text-muted`, 활성 시 `--gold-400`)
- 카테고리 아이콘 (16px)
- 카테고리명 (15px, 600 굵기)
- 스킬 수 카운트 (11px, 배경 pill)
- 화살표 `▼` (열면 180도 회전)

**스킬 아이템**:
- 좌측 패딩 52px (들여쓰기)
- 5px 원형 bullet (`::before` 가상요소)
- 스킬명 (14px)
- `실행` 버튼: 호버 시에만 나타남 (opacity 0→1), gold 스타일
- 클릭 시 → PAGE 3 스킬 실행으로 이동
- 활성 스킬: gold 하이라이트 배경 + gold 텍스트

**태블릿/폰 반응형**: 사이드바 숨김, 메인이 전체 너비 차지

### 4.2 탑바

**위치**: 메인 콘텐츠 상단 고정 (`position: sticky; top: 0`)

```
┌──────────────────────────────────────────────┐
│ [←][→]  대시보드 › 본문 다각도 통합 분석      │
└──────────────────────────────────────────────┘
```

- **← → 버튼**: 32x32px, 네비게이션 히스토리 기반, 비활성 시 opacity 0.3
- **빵크럼**: `대시보드` (클릭 가능 링크) `›` `현재 스킬명` (활성 bold)

### 4.3 퀵스타트 칩

```
[📋 주제 선정] [📖 본문 분석] [🎓 신학자 코칭] [✍️ 설교문 작성] [👥 회중 검증]
```

- pill 모양 (border-radius: 40px)
- glass 배경, hover 시 gold 테두리 + gold 텍스트 + -2px 상승
- 클릭 시 사이드바 해당 아코디언 열림 + 스크롤 + 하이라이트 플래시

### 4.4 설교 준비 여정 맵

```
[📋]──[📖]──[🏛️]──[🎓]──[✍️]──[👥]──[⛪]
 ①     ②     ③     ④     ⑤     ⑥   강단
```

- 원형 노드: 54x54px, glass 배경, 보더 2px
- 연결선: 44px, 2px 높이
- 첫 번째 노드+선: active 상태 (gold 보더 + glow)
- 각 노드 아래 라벨: `① 주제 기획`, `② 본문 분석` 등 (12px, 600 굵기)
- 클릭 시 사이드바 해당 아코디언 열림

### 4.5 전체 스킬 그리드

- **3열 그리드** (데스크탑), 2열(태블릿), 1열(폰)
- gap: 12px
- 21개 스킬 카드, 워크플로우 순서대로 (기획→분석→배경→신학→작성→검증)

**스킬 카드 구조**:
```
┌──────────────────────────┐
│ 📋 설교 기획     [실행 →]│ ← 카테고리 태그 (10px) + 실행 버튼 (호버시)
│ 주제·메시지 6단계 코치    │ ← 스킬명 (15px, bold)
│ 설교 주제와 메시지를...   │ ← 설명 (12px, tertiary)
└──────────────────────────┘
```

- 배경: glass-card, 보더: subtle
- hover: -3px 상승, gold 보더, 박스쉐도우
- 클릭 → PAGE 3 스킬 실행으로 이동

### 4.6 스킬 실행 페이지

```
┌──────────────────────────────────────┐
│ 본문 다각도 통합 분석                  │ ← 타이틀 (26px, Serif)
│ 원어·구조·신학·역사를 통합 분석합니다    │ ← 설명 (15px)
├──────────────────────────────────────┤
│ 성경 본문 입력                        │ ← 라벨 (14px)
│ ┌──────────────────────────────────┐ │
│ │ 예: 로마서 8:28                   │ │ ← input (16px)
│ └──────────────────────────────────┘ │
│ 추가 요청 (선택)                      │
│ ┌──────────────────────────────────┐ │
│ │ 특별히 분석하고 싶은...            │ │ ← textarea (16px)
│ └──────────────────────────────────┘ │
│ [분석 시작 →]  [← 대시보드로]         │
│                                      │
│ ┌─ 분석 결과 ──────────────────────┐ │
│ │ 스트리밍 AI 결과가 여기 표시       │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- 결과 영역: 분석 완료 후 `display:block` + fadeUp 애니메이션
- **실제 구현 시**: Vercel AI SDK `useChat` / `streamText`로 Claude API 스트리밍

### 4.7 샘플 미리보기 모달

- 랜딩 페이지 `◎ 샘플 미리보기` 클릭 시 표시
- 오버레이: `rgba(6,6,15,0.85)` + `backdrop-filter: blur(8px)`
- 모달: 820px max-width, 28px radius, fadeUp 애니메이션
- 콘텐츠: 빌립보서 4:4 분석 예시 (원문 분석 + 구조 분석 + 역사·문화 배경)
- 헬라어: `Noto Sans Mono`, 파랑 배경 강조

### 4.8 우상단 디바이스 토글

```
[🖥️][📱][📱]  ← 데스크탑 / 태블릿 / 핸드폰
```

- `position: fixed; top: 16px; right: 16px`
- glass 배경, 3개 아이콘 버튼 (34x34px)
- 클릭 시 페이지 전체를 해당 너비로 제한:
  - 데스크탑: 제한 없음
  - 태블릿: `max-width: 768px` (중앙 정렬, 양쪽 그림자)
  - 핸드폰: `max-width: 390px`
- 사이드바: 태블릿/폰에서 자동 숨김

---

## 5. 21개 스킬 목록 (워크플로우 순서)

### ① 설교 기획 (4개)
| ID | 이름 | 설명 |
|----|------|------|
| `topic-coach` | 주제·메시지 6단계 코치 | 설교 주제와 메시지를 함께 정립 |
| `planner-52` | 52주 연간 설교 계획 | 연간 설교 시리즈 기획 |
| `doctrinal` | 교리설교 기획 | 교리문답 기반 설교 기획 |
| `multidisciplinary` | 다학제 주제 조사 | 설교 주제를 다학제적으로 조사 |

### ② 본문 분석 (5개)
| ID | 이름 | 설명 |
|----|------|------|
| `text-analysis` | 본문 다각도 통합 분석 | 원어·구조·신학·역사를 통합 분석 |
| `bible-dict` | 성경사전 | 원어 뜻, 어원, 용례 조회 |
| `textual-criticism` | 본문비평 (사본 비교) | 주요 사본 간 이독 비교 |
| `multi-version` | 다중 번역 비교 | 여러 번역본의 차이 분석 |
| `greek-grammar` | 메이첸 헬라어 문법 | 헬라어 문법 학습·분석 |

### ③ 역사·배경 (3개)
| ID | 이름 | 설명 |
|----|------|------|
| `history-culture` | 역사·문화·지리 배경 | 본문의 시대적·문화적 맥락 복원 |
| `bible-history` | 성경-세계사 매칭 | 성경 인물·사건의 역사적 증거 |
| `christian-history` | 기독교 관점 역사 해석 | 기독교 관점에서 역사 해석 |

### ④ 신학자 코칭 (6개)
| ID | 이름 | 설명 |
|----|------|------|
| `augustine` | 어거스틴 코칭 (354–430) | 교부 시대 어거스틴의 신학 |
| `luther` | 루터 코칭 (1483–1546) | 종교개혁 루터의 신학·설교론 |
| `calvin-inst` | 칼빈 기독교 강요 | 칼빈 조직신학의 관점 |
| `calvin-style` | 칼빈식 설교 스타일 | 칼빈의 설교 방식 |
| `bavinck` | 바빙크 코칭 (1854–1921) | 네덜란드 개혁신학 |
| `lloyd-jones` | 로이드 존스 코칭 (1899–1981) | 영국 강해 설교 전통 |

### ⑤ 설교문 작성 (2개)
| ID | 이름 | 설명 |
|----|------|------|
| `qt` | 원문 기반 큐티(QT) 작성 | 원어 기반 큐티 자동 생성 |
| `emotive` | 감동 글쓰기 코치 | 설교문의 표현력 강화 |

### ⑥ 검증 (1개)
| ID | 이름 | 설명 |
|----|------|------|
| `audience` | 회중 페르소나 피드백 (8명) | 가상 회중 8명의 솔직한 반응 시뮬레이션 |

---

## 6. 네비게이션 & 인터랙션

### 6.1 페이지 전환
| 출발 | 도착 | 트리거 | 애니메이션 |
|------|------|--------|-----------|
| 랜딩 → 대시보드 | `시작하기` 클릭 | 랜딩 fade-out + scale 0.97, 대시보드 fade-in |
| 대시보드 → 스킬실행 | 스킬 클릭 / `실행` 클릭 | 뷰 전환 (fade) |
| 스킬실행 → 대시보드 | `← 대시보드로` 또는 ← 버튼 | 뷰 전환 |
| 어디서든 → 랜딩 | breadcrumb 또는 ← 반복 | 역순 전환 |

### 6.2 네비게이션 히스토리
- JavaScript 배열로 히스토리 관리: `['landing', 'dashboard', 'skill', ...]`
- ← 뒤로: index 감소, → 앞으로: index 증가
- 새 페이지 이동 시 앞으로 히스토리 제거

### 6.3 아코디언 동작
- 클릭: open/close 토글 (max-height 0 ↔ 600px, 0.35s transition)
- 퀵스타트/여정맵 클릭 시: 해당 아코디언 열기 + 스크롤 + 0.8초 gold 하이라이트 플래시

### 6.4 스킬 실행 흐름
1. 스킬 선택 (사이드바, 그리드, 퀵스타트 어디서든)
2. 스킬 실행 페이지 표시 (타이틀, 설명 자동 설정)
3. 사이드바에서 해당 스킬 gold 하이라이트
4. 성경 본문 입력 (필수)
5. `분석 시작` 클릭 → Claude API 호출 → 결과 스트리밍
6. 결과 영역 fadeUp 표시

---

## 7. 반응형 디자인

### 브레이크포인트
| 모드 | 너비 | 사이드바 | 스킬 그리드 | 여정맵 |
|------|------|---------|------------|--------|
| 데스크탑 | 900px+ | 표시 (310px) | 3열 | 가로 1줄 |
| 태블릿 | 640-900px | 숨김 | 2열 | 줄바꿈 허용 |
| 핸드폰 | ~640px | 숨김 | 1열 | 줄바꿈 + 축소 |

### 폰 모드 상세 조정
- 히어로 타이틀: 54px → 30px
- 히어로 서브: 18px → 15px
- 버튼: 가로 배치 → 세로 배치
- 통계 숫자: 34px → 24px
- 여정 노드: 54px → 42px
- 섹션 패딩: 48px → 28px

---

## 8. 애니메이션

| 이름 | 효과 | 지속시간 | 이징 |
|------|------|---------|------|
| `fadeUp` | opacity 0→1, translateY 28px→0 | 0.7s | cubic-bezier(0.25,0.46,0.45,0.94) |
| `shimmer` | background-position 0%→300% | 4s linear | infinite |
| `crossPulse` | opacity 0.15↔0.3, scale 1↔1.05 | 5s ease-in-out | infinite |
| `float` | translate ±30px, scale 0.95↔1.05 | 20s ease-in-out | infinite |
| `pFloat` | translateY -40px, scale→1.5, opacity 변화 | 6-11s | infinite |
| `modalIn` | opacity 0→1, translateY 20→0, scale 0.96→1 | 0.4s ease | once |
| `pageIn` | opacity 0→1, translateY 16→0 | 0.5s ease | once |
| accordion open | max-height 0→600px | 0.35s | cubic-bezier |
| scroll reveal | opacity 0→1, translateY 28→0 | 0.7s | IntersectionObserver 트리거 |

---

## 9. 실제 구현 시 참고

### AI 연동
- **Vercel AI SDK**: `ai` 패키지의 `streamText`, `useChat` 사용
- **모델**: Claude Sonnet 4.6 또는 Opus 4.6
- **스킬 프롬프트**: `skills/sermon-*/SKILL.md` 파일에서 시스템 프롬프트 로드
- **스트리밍**: 결과 영역에 토큰 단위로 실시간 표시

### 상태 관리
- **Zustand** 권장: 현재 선택 스킬, 분석 결과, 네비게이션 히스토리
- 스킬 메타데이터는 JSON 상수로 관리 (위 5번 표 참조)

### 폴더 구조 (Next.js 권장)
```
app/
  layout.tsx          ← 루트 레이아웃 (Ambient, FloatToggle)
  page.tsx            ← PAGE 1 랜딩
  dashboard/
    layout.tsx        ← 사이드바 + 탑바
    page.tsx          ← PAGE 2 대시보드 홈
    [skillId]/
      page.tsx        ← PAGE 3 스킬 실행
  api/
    chat/
      route.ts        ← Claude API 스트리밍 엔드포인트
components/
  Sidebar.tsx
  TopBar.tsx
  JourneyMap.tsx
  SkillGrid.tsx
  SkillExecForm.tsx
  SampleModal.tsx
  DeviceToggle.tsx
lib/
  skills.ts           ← 스킬 메타데이터
  store.ts            ← Zustand 스토어
```

### 배포
- GitHub → Vercel 자동 배포
- 도메인: `sermon-skills.vercel.app`

---

## 10. 디자인 파일 목록

| 파일 | 설명 |
|------|------|
| `concept-FINAL.html` | 최종 디자인 목업 (브라우저에서 열면 작동하는 프로토타입) |
| `dashboard-design-spec.md` | 본 문서 (디자인 스펙) |
| `concept-A-scriptorium.html` | 초기 컨셉 A (참고용) |
| `concept-B-modern-edge.html` | 초기 컨셉 B (참고용) |
| `concept-C-sacred-glass.html` | 초기 컨셉 C (참고용) |

---

> **이 문서와 `concept-FINAL.html`을 함께 전달하면, 어떤 개발자든 동일한 대시보드를 구현할 수 있습니다.**
