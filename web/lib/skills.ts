export type CategoryId =
  | "planning"
  | "analysis"
  | "history"
  | "theology"
  | "writing"
  | "validation";

export interface Skill {
  id: string;
  folder: string;
  name: string;
  desc: string;
  category: CategoryId;
}

export interface Category {
  id: CategoryId;
  step: number;
  name: string;
  icon: string;
  colorVar: string;
}

export const CATEGORIES: Category[] = [
  { id: "planning",   step: 1, name: "설교 기획",     icon: "📋", colorVar: "var(--cat-planning)"   },
  { id: "analysis",   step: 2, name: "본문 분석",     icon: "📖", colorVar: "var(--cat-analysis)"   },
  { id: "history",    step: 3, name: "역사·배경",     icon: "🏛️", colorVar: "var(--cat-history)"    },
  { id: "theology",   step: 4, name: "신학자 코칭",   icon: "🎓", colorVar: "var(--cat-theology)"   },
  { id: "writing",    step: 5, name: "설교문 작성",   icon: "✍️", colorVar: "var(--cat-writing)"    },
  { id: "validation", step: 6, name: "검증",         icon: "👥", colorVar: "var(--cat-validation)" },
];

export const SKILLS: Skill[] = [
  // ① 설교 기획
  { id: "topic-coach",         folder: "sermon-topic-message-coach",            name: "주제·메시지 6단계 코치",     desc: "설교 주제와 메시지를 함께 정립합니다",     category: "planning" },
  { id: "planner-52",          folder: "sermon-planner-52week",                 name: "52주 연간 설교 계획",         desc: "연간 설교 시리즈를 기획합니다",            category: "planning" },
  { id: "doctrinal",           folder: "sermon-doctrinal-planner",              name: "교리설교 기획",               desc: "교리문답 기반 설교를 기획합니다",          category: "planning" },
  { id: "multidisciplinary",   folder: "sermon-topic-research-multidisciplinary", name: "다학제 주제 조사",            desc: "설교 주제를 다학제적으로 조사합니다",      category: "planning" },

  // ② 본문 분석
  { id: "text-analysis",       folder: "sermon-text-analysis-multimethod",      name: "본문 다각도 통합 분석",       desc: "원어·구조·신학·역사를 통합 분석합니다",    category: "analysis" },
  { id: "bible-dict",          folder: "sermon-bible-dictionary",               name: "성경사전",                    desc: "원어 뜻, 어원, 용례를 조회합니다",         category: "analysis" },
  { id: "textual-criticism",   folder: "sermon-textual-criticism",              name: "본문비평 (사본 비교)",        desc: "주요 사본 간 이독을 비교합니다",           category: "analysis" },
  { id: "multi-version",       folder: "sermon-multi-bible-version-compare",    name: "다중 번역 비교",              desc: "여러 번역본의 차이를 분석합니다",          category: "analysis" },
  { id: "greek-grammar",       folder: "sermon-greek-grammar-machen",           name: "메이첸 헬라어 문법",          desc: "헬라어 문법을 학습·분석합니다",            category: "analysis" },

  // ③ 역사·배경
  { id: "history-culture",     folder: "sermon-history-culture-geo-context",    name: "역사·문화·지리 배경",         desc: "본문의 시대적·문화적 맥락을 복원합니다",   category: "history" },
  { id: "bible-history",       folder: "sermon-bible-history-matcher",          name: "성경-세계사 매칭",            desc: "성경 인물·사건의 역사적 증거를 찾습니다",  category: "history" },
  { id: "christian-history",   folder: "sermon-christian-history-interpreter",  name: "기독교 관점 역사 해석",       desc: "기독교 관점에서 역사를 해석합니다",        category: "history" },

  // ④ 신학자 코칭
  { id: "augustine",           folder: "sermon-augustine-coaching",             name: "어거스틴 코칭 (354–430)",     desc: "교부 시대 어거스틴의 신학으로 코칭합니다", category: "theology" },
  { id: "luther",              folder: "sermon-luther-coaching",                name: "루터 코칭 (1483–1546)",       desc: "종교개혁 루터의 신학·설교론으로 코칭합니다", category: "theology" },
  { id: "calvin-inst",         folder: "sermon-calvin-institutes",              name: "칼빈 기독교 강요",            desc: "칼빈 조직신학의 관점에서 분석합니다",       category: "theology" },
  { id: "calvin-style",        folder: "sermon-calvin-style-insight",           name: "칼빈식 설교 스타일",          desc: "칼빈의 설교 방식으로 코칭합니다",           category: "theology" },
  { id: "bavinck",             folder: "sermon-bavinck-coaching",               name: "바빙크 코칭 (1854–1921)",     desc: "네덜란드 개혁신학으로 코칭합니다",          category: "theology" },
  { id: "lloyd-jones",         folder: "sermon-lloyd-jones-coaching",           name: "로이드 존스 코칭 (1899–1981)", desc: "영국 강해 설교 전통으로 코칭합니다",        category: "theology" },

  // ⑤ 설교문 작성
  { id: "qt",                  folder: "sermon-qt-original-text-based",         name: "원문 기반 큐티(QT) 작성",     desc: "원어 기반으로 큐티를 자동 생성합니다",      category: "writing" },
  { id: "emotive",             folder: "sermon-emotive-writing-coach",          name: "감동 글쓰기 코치",             desc: "설교문의 표현력을 강화합니다",              category: "writing" },

  // ⑥ 검증
  { id: "audience",            folder: "sermon-audience-feedback-persona",      name: "회중 페르소나 피드백 (8명)",  desc: "가상 회중 8명의 솔직한 반응을 시뮬레이션합니다", category: "validation" },
];

export function getSkill(id: string): Skill | undefined {
  return SKILLS.find((s) => s.id === id);
}

export function getCategory(id: CategoryId): Category {
  const c = CATEGORIES.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown category: ${id}`);
  return c;
}

export function skillsByCategory(id: CategoryId): Skill[] {
  return SKILLS.filter((s) => s.category === id);
}
