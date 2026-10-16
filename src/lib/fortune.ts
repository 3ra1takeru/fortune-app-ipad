// 四柱推命・九星気学・令翠学の詳細計算および総合鑑定ロジック

export interface Score {
  value: number; // 0-100
  detail: string;
  caution: string;
  recommendation: string;
}

export interface BiorhythmStage {
  name: string;
  score: number;
  description: string;
  isPeak?: boolean;
  isValley?: boolean;
  season?: string; // "冬", "春", "夏", "秋"
  seasonLabel?: string; // "冬（忍耐）", "春（努力）", "夏（願望）", "秋（結実）"
  seasonTheme?: string; // "忍耐", "努力", "願望", "結実"
  keywords?: string; // "新規スタート・種まき" 等
  fuyuShitaku?: boolean; // 冬支度
}

export interface PeriodData {
  period: string;
  periodValue: number;
  age: number;
  stage: BiorhythmStage; // 総合
  stageReisui: BiorhythmStage;
  stageFourPillars: BiorhythmStage;
  stageNineStar: BiorhythmStage;
  romance: Score;
  work: Score;
  family: Score;
  marriage: Score;
  health: Score;
  months?: PeriodData[];
}

export interface FortuneExplanationSet {
  thisMonth: { period: string; description: string; };
  nextMonth: { period: string; description: string; };
  thisYear: { period: string; description: string; };
  nextYear: { period: string; description: string; };
}

export interface TurningPointsSet {
  marriage: { year: string; description: string; };
  work: { year: string; description: string; };
}

// ----------------------------------------------------
// 年代別人生サイクル（〇才〜〇才の人生）
// ----------------------------------------------------
export interface AgePeriodLifeStage {
  ageRange: string;
  stageTitle: string;
  timingType: 'past' | 'current' | 'future';
  lifeTheme: string;
  description: string;
  checkPoint: string;
}

// ----------------------------------------------------
// 年盤・歳運の詳細（去年2025、今年2026、来年2027）
// ----------------------------------------------------
export interface YearFlowDetail {
  year: number;
  label: string; // "2025年(去年)", "2026年(今年)", "2027年(来年)"
  starOrStage: string; // 回座宮や干支・ステージ
  theme: string;
  score: number;
  work: string;
  romance: string;
  health: string;
  family: string;
  money: string;
  keyAdvice: string;
}

// ----------------------------------------------------
// 九星気学の詳細
// ----------------------------------------------------
export interface NineStarNatureDetail {
  star: string; // 後方互換用（本命星）
  honmeiStar: string; // 本命星
  getsumeiStar: string; // 月命星
  nichimeiStar: string; // 日命星
  keisha: string; // 傾斜宮
  keishaMeaning: string; // 傾斜宮の潜在能力・裏の才能
  personality: string;
  strengths: string[];
  weaknesses: string[];
  cautions: string;
  habits: string; // 癖
  suitableJobs: string[];
  suitableJobDetail: string;
  communication: string;
  goodAffinity: string[];
  affinityDetail: string;
  yearFlows: {
    lastYear: YearFlowDetail;
    thisYear: YearFlowDetail;
    nextYear: YearFlowDetail;
  };
  lifeStages: AgePeriodLifeStage[];
  explanation: string;
}

// ----------------------------------------------------
// 四柱推命の詳細
// ----------------------------------------------------
export interface FourPillarsNatureDetail {
  pillars: { year: string; month: string; day: string; };
  dayStem: string; // 日干（例: 甲）
  dayStemElement: string; // 木火土金水
  dayStemNature: string; // 象徴（大木、太陽、宝石など）
  centerStar: string; // 中心星（通変星）
  twelveFate: string; // 十二運星
  personality: string;
  strengths: string[];
  weaknesses: string[];
  cautions: string;
  habits: string;
  suitableJobs: string[];
  suitableJobDetail: string;
  communication: string;
  goodAffinity: string[];
  affinityDetail: string;
  yearFlows: {
    lastYear: YearFlowDetail;
    thisYear: YearFlowDetail;
    nextYear: YearFlowDetail;
  };
  lifeStages: AgePeriodLifeStage[];
  explanation: string;
}

// ----------------------------------------------------
// 令翠学の詳細
// ----------------------------------------------------
export interface ReisuiNatureDetail {
  star: string; // 十二宿星
  subStar: string; // 対を成す宿星
  reiStar: string; // 六令星（水令星、木令星、月令星、火令星、金令星、土令星）
  oppositeStar: string; // 対照星
  yinYang: string; // 陽の宿星 / 陰の宿星
  personality: string;
  strengths: string[];
  weaknesses: string[];
  cautions: string;
  habits: string;
  suitableJobs: string[];
  suitableJobDetail: string;
  communication: string;
  goodAffinity: string[];
  affinityDetail: string;
  yearFlows: {
    lastYear: YearFlowDetail;
    thisYear: YearFlowDetail;
    nextYear: YearFlowDetail;
  };
  lifeStages: AgePeriodLifeStage[];
  explanation: string;
}

// ----------------------------------------------------
// 総合（共通点を強調した統合鑑定）
// ----------------------------------------------------
export interface OverallNatureDetail {
  title: string;
  coreStrengths: string[]; // 3占術共通の真の強み
  commonPitfalls: string[]; // 3占術共通の落とし穴・癖
  lifeTheme: string;
  synthesisAdvice: string;
  yearFlows: {
    lastYear: YearFlowDetail;
    thisYear: YearFlowDetail;
    nextYear: YearFlowDetail;
  };
  lifeStages: AgePeriodLifeStage[];
}

export interface FortuneResult {
  nature: {
    overall: OverallNatureDetail;
    fourPillars: FourPillarsNatureDetail;
    nineStar: NineStarNatureDetail;
    reisui: ReisuiNatureDetail;
  };
  fortuneExplanations: {
    overall: FortuneExplanationSet;
    fourPillars: FortuneExplanationSet;
    nineStar: FortuneExplanationSet;
    reisui: FortuneExplanationSet;
  };
  flows: {
    hundredYears: PeriodData[];
  };
  turningPoints: {
    overall: TurningPointsSet;
    fourPillars: TurningPointsSet;
    nineStar: TurningPointsSet;
    reisui: TurningPointsSet;
  };
}

export interface CompatibilityMethodDetail {
  score: number;
  label: string;
  starPair: string;
  overall: string;
  romance: string;
  work: string;
  communication: string;
}

export interface CompatibilityResult {
  person1: { name: string; star: string; reisuiStar?: string; dayPillar?: string; };
  person2: { name: string; star: string; reisuiStar?: string; dayPillar?: string; };
  score: number;
  overall: string;
  romance: string;
  work: string;
  communication: string;
  methods: {
    overall: CompatibilityMethodDetail;
    reisui: CompatibilityMethodDetail;
    fourPillars: CompatibilityMethodDetail;
    nineStar: CompatibilityMethodDetail;
  };
}

// 定数定義
export const NINE_STARS = [
  "一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星",
  "六白金星", "七赤金星", "八白土星", "九紫火星"
];

export const TEN_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const TWELVE_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
export const REISUI_STARS = ["水星", "氷令星", "木星", "海令星", "月星", "魚令星", "火星", "冥令星", "金星", "小令星", "土星", "天令星"];

export const BIORHYTHM_CYCLE: BiorhythmStage[] = [
  { name: '種', score: 10, description: '目標を決める時期。新しいことを始めるのに適しています。' },
  { name: '成長', score: 30, description: '蒔いた種が育つ時期。試行錯誤しながら経験を積む時です。' },
  { name: '決定', score: 50, description: '方向性が定まる時期。計画を立てて突き進むと良いでしょう。' },
  { name: '健康', score: 30, isValley: true, description: '少し小休止の時期。無理をせず心身のバランスを整えましょう。' },
  { name: '人気', score: 70, isPeak: true, description: '社交運がアップする時期。人脈が広がり、注目を集めやすいです。' },
  { name: '精神', score: 20, isValley: true, description: '内面と向き合う時期。少し落ち込みやすいですが、自己理解が深まります。' },
  { name: '上昇', score: 60, description: '再び運気が上昇し始める時期。迷いが晴れ、行動力が戻ってきます。' },
  { name: '経済', score: 80, description: '金運・仕事運が好調な時期。努力が形になりやすい時です。' },
  { name: '充実', score: 100, isPeak: true, description: '12年で最高の運気。これまでの集大成として大きな成果を得られます！' },
  { name: '充電期(清算)', score: 0, isValley: true, description: '清算の時期。隠れていた問題が出やすく、無理は禁物です。' },
  { name: '充電期(内省)', score: 0, isValley: true, description: '内省の時期。パワーを充電するため、自己研鑽に励むと良いでしょう。' },
  { name: '充電期(自覚)', score: 0, isValley: true, description: '自覚の時期。次のサイクルに向けた準備期間。焦らずに過ごしましょう。' },
];

// 節入り日判定（立春・節月）
function getSolarDateInfo(year: number, month: number, day: number) {
  const cutoffDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7]; // 1月〜12月の概略節入り日
  const cutoff = cutoffDays[month - 1];
  
  // 立春前判定（年切り替え）
  let solarYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    solarYear = year - 1;
  }

  // 節月判定（月切り替え）
  let solarMonth = month;
  if (day < cutoff) {
    solarMonth = month === 1 ? 12 : month - 1;
  }

  return { solarYear, solarMonth };
}

// 四柱推命柱
function getPillar(year: number, month: number, day: number) {
  const { solarYear, solarMonth } = getSolarDateInfo(year, month, day);

  // 年柱
  const yIndex = ((solarYear - 4) % 10 + 10) % 10;
  const bIndex = ((solarYear - 4) % 12 + 12) % 12;
  const yearPillar = `${TEN_STEMS[yIndex]}${TWELVE_BRANCHES[bIndex]}`;
  
  // 月柱（五虎遁法）
  // 寅月(solarMonth=2)の干 = (年干 % 5) * 2 + 2
  const toraStem = ((yIndex % 5) * 2 + 2) % 10;
  // solarMonth: 1:丑月, 2:寅月, 3:卯月, 4:辰月...
  const monthOffset = (solarMonth - 2 + 12) % 12;
  const mStem = (toraStem + monthOffset) % 10;
  const mBranch = (solarMonth + 0) % 12; // 1:丑, 2:寅, 3:卯, 4:辰...
  const monthPillar = `${TEN_STEMS[mStem]}${TWELVE_BRANCHES[mBranch]}`;

  // 日柱（基準日 1900-01-01 は甲戌 = 干:0, 支:10）
  const baseUTC = Date.UTC(1900, 0, 1);
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
  const dStemIndex = ((diffDays % 10) + 10) % 10;
  const dBranchIndex = (((diffDays + 10) % 12) + 12) % 12;
  const dayPillar = `${TEN_STEMS[dStemIndex]}${TWELVE_BRANCHES[dBranchIndex]}`;

  return { year: yearPillar, month: monthPillar, day: dayPillar };
}

// 十二運星の正確な計算
function getTwelveFate(dayStem: string, dayBranch: string): string {
  const branchIdx = TWELVE_BRANCHES.indexOf(dayBranch);
  const FATE_MAP: Record<string, string[]> = {
    "甲": ["沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養", "長生"],
    "乙": ["病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎", "絶", "墓", "死"],
    "丙": ["胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶"],
    "丁": ["絶", "墓", "死", "病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎"],
    "戊": ["胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶"],
    "己": ["絶", "墓", "死", "病", "衰", "帝旺", "建禄", "冠帯", "沐浴", "長生", "養", "胎"],
    "庚": ["死", "墓", "絶", "胎", "養", "長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病"],
    "辛": ["長生", "養", "胎", "絶", "墓", "死", "病", "衰", "帝旺", "建禄", "冠帯", "沐浴"],
    "壬": ["帝旺", "衰", "病", "死", "墓", "絶", "胎", "養", "長生", "沐浴", "冠帯", "建禄"],
    "癸": ["建禄", "冠帯", "沐浴", "長生", "養", "胎", "絶", "墓", "死", "病", "衰", "帝旺"]
  };
  const list = FATE_MAP[dayStem] || FATE_MAP["甲"];
  return list[branchIdx >= 0 ? branchIdx : 0];
}

// 中心星（通変星）の正確な計算（月支元命・本気蔵干基準）
function getCenterStar(dayStem: string, monthBranch: string): string {
  const BRANCH_MAIN_STEM: Record<string, string> = {
    "子": "癸", "丑": "己", "寅": "甲", "卯": "乙",
    "辰": "戊", "巳": "丙", "午": "丁", "未": "己",
    "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬"
  };
  const targetStem = BRANCH_MAIN_STEM[monthBranch] || "戊";
  
  const STEM_RELATIONS: Record<string, Record<string, string>> = {
    "甲": { "甲":"比肩", "乙":"劫財", "丙":"食神", "丁":"傷官", "戊":"偏財", "己":"正財", "庚":"偏官", "辛":"正官", "壬":"偏印", "癸":"印綬" },
    "乙": { "乙":"比肩", "甲":"劫財", "丁":"食神", "丙":"傷官", "己":"偏財", "戊":"正財", "辛":"偏官", "庚":"正官", "癸":"偏印", "壬":"印綬" },
    "丙": { "丙":"比肩", "丁":"劫財", "戊":"食神", "己":"傷官", "庚":"偏財", "辛":"正財", "壬":"偏官", "癸":"正官", "甲":"偏印", "乙":"印綬" },
    "丁": { "丁":"比肩", "丙":"劫財", "己":"食神", "戊":"傷官", "辛":"偏財", "庚":"正官", "癸":"偏官", "壬":"正官", "乙":"偏印", "甲":"印綬" },
    "戊": { "戊":"比肩", "己":"劫財", "庚":"食神", "辛":"傷官", "壬":"偏財", "癸":"正財", "甲":"偏官", "乙":"正官", "丙":"偏印", "丁":"印綬" },
    "己": { "己":"比肩", "戊":"劫財", "辛":"食神", "庚":"傷官", "癸":"偏財", "壬":"正財", "乙":"偏官", "甲":"正官", "丁":"偏印", "丙":"印綬" },
    "庚": { "庚":"比肩", "辛":"劫財", "壬":"食神", "癸":"傷官", "甲":"偏財", "乙":"正財", "丙":"偏官", "丁":"正官", "戊":"偏印", "己":"印綬" },
    "辛": { "辛":"比肩", "庚":"劫財", "癸":"食神", "壬":"傷官", "乙":"偏財", "甲":"正財", "丁":"偏官", "丙":"正官", "己":"偏印", "戊":"印綬" },
    "壬": { "壬":"比肩", "癸":"劫財", "甲":"食神", "乙":"傷官", "丙":"偏財", "丁":"正財", "戊":"偏官", "己":"正官", "庚":"偏印", "辛":"印綬" },
    "癸": { "癸":"比肩", "壬":"劫財", "乙":"食神", "甲":"傷官", "丁":"偏財", "丙":"正財", "己":"偏官", "戊":"正官", "辛":"偏印", "庚":"印綬" }
  };
  return STEM_RELATIONS[dayStem]?.[targetStem] || "正財";
}

// 本命星計算
function getHonmeiStar(year: number, month: number, day: number): string {
  const { solarYear } = getSolarDateInfo(year, month, day);
  let sum = String(solarYear).split('').reduce((a, b) => a + parseInt(b), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  let index = (11 - sum) % 9;
  if (index === 0) index = 9;
  return NINE_STARS[index - 1];
}

// 月命星計算
function getGetsumeiStar(honmeiStar: string, month: number, day: number): string {
  const { solarMonth } = getSolarDateInfo(2000, month, day); // 節月のみ利用
  
  // 本命星のグループ
  // 第1グループ: 一白・四緑・七赤（寅月＝八白）
  // 第2グループ: 三碧・六白・九紫（寅月＝五黄）
  // 第3グループ: 二黒・五黄・八白（寅月＝二黒）
  const g1 = ["一白水星", "四緑木星", "七赤金星"];
  const g2 = ["三碧木星", "六白金星", "九紫火星"];
  const g3 = ["二黒土星", "五黄土星", "八白土星"];

  // 節月1(丑)〜12(子)の早見順
  // 節月2月(寅月)が年の最初: 寅(0), 卯(1), 辰(2), 巳(3), 午(4), 未(5), 申(6), 酉(7), 戌(8), 亥(9), 子(10), 丑(11)
  const monthOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 1月〜12月
  const mIdx = monthOrder[solarMonth - 1];

  let startStarNum = 8; // 第1グループの2月は八白(8)
  if (g2.includes(honmeiStar)) {
    startStarNum = 5; // 第2グループの2月は五黄(5)
  } else if (g3.includes(honmeiStar)) {
    startStarNum = 2; // 第3グループの2月は二黒(2)
  }

  // 月命星は逆行（毎月1つずつ減少）
  let starNum = (startStarNum - mIdx) % 9;
  if (starNum <= 0) starNum += 9;

  return NINE_STARS[starNum - 1];
}

// 日命星計算（日家九星：冬至近傍甲子=1からの陽遁順行・夏至近傍甲子=9からの陰遁逆行）
function getNichimeiStar(year: number, month: number, day: number): string {
  // 基準日: 1986-01-20 (甲子) は陽遁の起点（一白水星: 1）
  const BASE_KOSHI_UTC = Date.UTC(1986, 0, 20);
  const targetUTC = Date.UTC(year, month - 1, day);

  // 冬至・夏至の概略計算（夏至: およそ6月21日頃, 冬至: およそ12月22日頃）
  function getSolstice(y: number) {
    const sDay = Math.floor(22.2028 + 0.2427404 * (y - 1900) - Math.floor((y - 1900) / 4));
    const wDay = Math.floor(22.6587 + 0.2427404 * (y - 1900) - Math.floor((y - 1900) / 4));
    return {
      summer: Date.UTC(y, 5, sDay),
      winter: Date.UTC(y, 11, wDay)
    };
  }

  // 二至に最も近い甲子日を算出（甲子日は60日周期）
  function getNearestKoshiUTC(solsticeUTC: number) {
    const sDiff = Math.round((solsticeUTC - BASE_KOSHI_UTC) / 86400000);
    const sEto = ((0 + sDiff) % 60 + 60) % 60;
    const offset = sEto <= 30 ? -sEto : (60 - sEto);
    return solsticeUTC + offset * 86400000;
  }

  const prevWinter = getNearestKoshiUTC(getSolstice(year - 1).winter);
  const currSummer = getNearestKoshiUTC(getSolstice(year).summer);
  const currWinter = getNearestKoshiUTC(getSolstice(year).winter);

  let isYang = true;
  let startKoshi = prevWinter;
  if (targetUTC >= currSummer && targetUTC < currWinter) {
    isYang = false;
    startKoshi = currSummer;
  } else if (targetUTC >= currWinter) {
    isYang = true;
    startKoshi = currWinter;
  } else {
    isYang = true;
    startKoshi = prevWinter;
  }

  const diffDays = Math.round((targetUTC - startKoshi) / 86400000);

  if (isYang) {
    // 陽遁期間: 甲子日を一白(1)として1日1つ順行（+1）
    let star = ((1 - 1 + (diffDays % 9) + 900) % 9) + 1;
    return NINE_STARS[star - 1];
  } else {
    // 陰遁期間: 甲子日を九紫(9)として1日1つ逆行（-1）
    let star = ((9 - 1 - (diffDays % 9) + 900) % 9) + 1;
    return NINE_STARS[star - 1];
  }
}

// 傾斜宮計算（月命星中宮盤において本命星が位置する宮）
function getKeishaGyu(honmeiStar: string, getsumeiStar: string): { name: string; meaning: string } {
  const honmeiNum = NINE_STARS.indexOf(honmeiStar) + 1;
  const getsuNum = NINE_STARS.indexOf(getsumeiStar) + 1;

  // 月命星が中宮のとき、本命星が入るステップ
  const step = (honmeiNum - getsuNum + 9) % 9;

  // step と宮・定位星の対応:
  // 0: 中宮(五黄)
  // 1: 乾宮(六白・北西)
  // 2: 兌宮(七赤・西)
  // 3: 艮宮(八白・北東)
  // 4: 離宮(九紫・南)
  // 5: 坎宮(一白・北)
  // 6: 坤宮(二黒・南西)
  // 7: 震宮(三碧・東)
  // 8: 巽宮(四緑・南東)
  const gyuMap: Record<number, { name: string; meaning: string }> = {
    0: { name: "五黄土星（中宮傾斜・中央）", meaning: "生まれながらの支配力と求心力、いざという時に周囲を束ねる帝王の器" },
    1: { name: "六白金星（乾宮傾斜・北西）", meaning: "高潔なプライドと揺るぎないリーダーシップ、理想を形にする不屈の実行力" },
    2: { name: "七赤金星（兌宮傾斜・西）", meaning: "人を喜ばせる天性のユーモアと社交性、会話や表現を通じて人を惹きつける魅力" },
    3: { name: "八白土星（艮宮傾斜・北東）", meaning: "現状を大胆に刷新する改革精神と粘り強さ、逆境をバネに山を登りつめる底力" },
    4: { name: "九紫火星（離宮傾斜・南）", meaning: "鋭敏な美的センスと知性、物事の本質を瞬時に見抜く閃きと華やかな存在感" },
    5: { name: "一白水星（坎宮傾斜・北）", meaning: "深い洞察力と探求心、人知れず努力しピンチをチャンスに変える粘り強さ" },
    6: { name: "二黒土星（坤宮傾斜・南西）", meaning: "大地のような包容力と補佐役としての卓越した手腕、人や事業を育てる母性" },
    7: { name: "三碧木星（震宮傾斜・東）", meaning: "時代の先を読む直感力と先駆者精神、困難を打破するスピーディーな突破力" },
    8: { name: "四緑木星（巽宮傾斜・南東）", meaning: "卓越した交渉力と人たらしの魅力、誰とでも円満に信用を築き上げる調和力" },
  };

  return gyuMap[step] || gyuMap[5];
}

// ----------------------------------------------------
// 令翠学の宿星（十二宿星・六令星）および運命周期計算
// ----------------------------------------------------
// 令翠学の12運命周期（冬・春・夏・秋の四季各3年と十二の時期）
// 添付画像の「運命周期図」に完全準拠
export interface ReisuiCycleStage {
  name: string;
  season: '冬' | '春' | '夏' | '秋';
  seasonLabel: string;
  seasonTheme: string;
  keywords: string;
  score: number;
  title: string;
  theme: string;
  description: string;
  isPeak?: boolean;
  isValley?: boolean;
  fuyuShitaku?: boolean;
}

export const REISUI_12_CYCLES: ReisuiCycleStage[] = [
  {
    name: "令",
    season: "冬",
    seasonLabel: "冬（忍耐）",
    seasonTheme: "忍耐",
    keywords: "無・玄",
    score: 15,
    isValley: true,
    title: "【令期・冬の中心（無・玄）】",
    theme: "無・玄。運気の胎蔵期であり、精神的インスピレーションが高まる転換点。",
    description: "無・玄。最も静かな冬の中心。無理な動きは慎み、内面を深く研ぎ澄ませて春を待つ時。"
  },
  {
    name: "精算",
    season: "冬",
    seasonLabel: "冬（忍耐）",
    seasonTheme: "忍耐",
    keywords: "心の準備",
    score: 35,
    title: "【精算期・冬の総決算（心の準備）】",
    theme: "心の準備。過去の不要なものを手放し、次の春に向けて心身を整える時期。",
    description: "心の準備。過去の歩みを整理整頓し、身軽になって次の新しい春を迎える準備期間。"
  },
  {
    name: "開拓",
    season: "春",
    seasonLabel: "春（努力）",
    seasonTheme: "努力",
    keywords: "新規スタート・種まき",
    score: 55,
    title: "【開拓期・新しい春の始まり（新規スタート・種まき）】",
    theme: "新規スタート・種まき！新しい運気サイクルが力強く動き出す挑戦の時期。",
    description: "新規スタート・種まき。未知の世界へ一歩を踏み出し、未来への種を蒔く好機。"
  },
  {
    name: "生長",
    season: "春",
    seasonLabel: "春（努力）",
    seasonTheme: "努力",
    keywords: "行動・実行・水まき",
    score: 72,
    title: "【生長期・躍進の春（行動・実行・水まき）】",
    theme: "行動・実行・水まき。新芽が伸び、手間を惜しまず励むことで勢いが加速する時期。",
    description: "行動・実行・水まき。蒔いた種に水や栄養を与え、積極的に行動して枝葉を広げる時。"
  },
  {
    name: "決定",
    season: "春",
    seasonLabel: "春（努力）",
    seasonTheme: "努力",
    keywords: "見通し・方針・決断",
    score: 84,
    title: "【決定期・春の集大成（見通し・方針・決断）】",
    theme: "見通し・方針・決断。方向性を明確に定め、覚悟を持って大きな決断を下す時期。",
    description: "見通し・方針・決断。春の努力が確かな形を成し、進むべき進路を確定させる決定打の年。"
  },
  {
    name: "健康",
    season: "夏",
    seasonLabel: "夏（願望）",
    seasonTheme: "願望",
    keywords: "精神面・トラブル（要注意）",
    score: 70,
    isValley: true,
    title: "【健康期・夏の小休止（精神面・トラブル 要注意）】",
    theme: "精神面・トラブル（要注意）。活動の波に乗る中での小休止。心身のケアを最優先にする時期。",
    description: "精神面・トラブル（要注意）。忙しさの中で無理がたたらないよう、体調と心のバランスを最優先に。"
  },
  {
    name: "人気",
    season: "夏",
    seasonLabel: "夏（願望）",
    seasonTheme: "願望",
    keywords: "願望達成（努力ある者）",
    score: 92,
    isPeak: true,
    title: "【人気期・夏の絶頂（願望達成・努力ある者）】",
    theme: "願望達成（努力ある者）。努力してきた人に脚光が当たり、支持と称賛が集まる大吉期。",
    description: "願望達成（努力ある者）。努力が花開き、華やかな人気と周囲からの応援に包まれる絶頂期。"
  },
  {
    name: "油断",
    season: "夏",
    seasonLabel: "夏（願望）",
    seasonTheme: "願望",
    keywords: "浮足立つ・落花",
    score: 78,
    title: "【油断期・夏の警戒期（浮足立つ・落花）】",
    theme: "浮足立つ・落花。絶頂の後に生じやすい油断や慢心を戒め、冷静さを保つべき警戒期。",
    description: "浮足立つ・落花。好調さに甘んじず、足元をしっかり固めて落花を防ぐ用心期。"
  },
  {
    name: "再開",
    season: "秋",
    seasonLabel: "秋（結実）",
    seasonTheme: "結実",
    keywords: "再生・再会・再構築",
    score: 86,
    title: "【再開期・実りの秋の初め（再生・再会・再構築）】",
    theme: "再生・再会・再構築。過去の挫折や停滞を乗り越え、実りの秋へ向けて再始動する時期。",
    description: "再生・再会・再構築。一度途切れた縁や計画が復活し、確かな果実へと実を結び始める時。"
  },
  {
    name: "経済",
    season: "秋",
    seasonLabel: "秋（結実）",
    seasonTheme: "結実",
    keywords: "結果・収穫",
    score: 94,
    title: "【経済期・実利の収穫（結果・収穫）】",
    theme: "結果・収穫。長年の努力が具体的な金運や物質的豊かさとして実る豊かな収穫期。",
    description: "結果・収穫。経済的な潤いと確かな成果を手中に収める、手応え満点の時期。"
  },
  {
    name: "充実",
    season: "秋",
    seasonLabel: "秋（結実）",
    seasonTheme: "結実",
    keywords: "完成・成功",
    score: 100,
    isPeak: true,
    fuyuShitaku: true,
    title: "【充実期・秋の黄金収穫（完成・成功）】",
    theme: "完成・成功。12年サイクルの最高の集大成！運気が最高潮に達する大満足の時期。",
    description: "完成・成功。すべての努力が頂点に達し、人生の黄金期を謳歌する最高の達成年。冬支度へ。"
  },
  {
    name: "背信",
    season: "冬",
    seasonLabel: "冬（忍耐）",
    seasonTheme: "忍耐",
    keywords: "裏目・裏切り",
    score: 28,
    isValley: true,
    fuyuShitaku: true,
    title: "【背信期・冬の入り口（裏目・裏切り・冬支度）】",
    theme: "裏目・裏切り（冬支度）。充実期の後に訪れる冬の入口。新規展開は避け、冬支度に徹する時期。",
    description: "裏目・裏切り。冬支度の時期。予想外の裏目が出やすいため、過信を捨てて身を守る時。"
  }
];

function getReisuiStar(year: number, month: number, day: number): {
  star: string;
  subStar: string;
  oppositeStar: string;
  reiStar: string;
  yinYang: string;
  unmeiSu: number;
  reiBranch: number;
} {
  // 日干支番号（1〜60）の計算
  // 1986-04-25 は 己亥 = 36番
  const baseUTC = Date.UTC(1986, 3, 25);
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
  const unmeiSu = ((36 - 1 + diffDays) % 60 + 60) % 60 + 1;
  const isEvenYear = (year % 2 === 0);

  let star = "";
  let subStar = "";
  let oppositeStar = "";
  let reiStar = "";
  let reiBranch = 0; // 子=0, 丑=1, 寅=2, 卯=3, 辰=4, 巳=5, 午=6, 未=7, 申=8, 酉=9, 戌=10, 亥=11

  if (unmeiSu >= 1 && unmeiSu <= 10) {
    reiStar = "土令星";
    reiBranch = 10; // 戌
    star = isEvenYear ? "土星" : "天令星";
    subStar = isEvenYear ? "天令星" : "土星";
    oppositeStar = isEvenYear ? "月星" : "魚令星";
  } else if (unmeiSu >= 11 && unmeiSu <= 20) {
    reiStar = "金令星";
    reiBranch = 8; // 申
    star = isEvenYear ? "金星" : "小令星";
    subStar = isEvenYear ? "小令星" : "金星";
    oppositeStar = isEvenYear ? "木星" : "海令星";
  } else if (unmeiSu >= 21 && unmeiSu <= 30) {
    reiStar = "火令星";
    reiBranch = 6; // 午
    star = isEvenYear ? "火星" : "冥令星";
    subStar = isEvenYear ? "冥令星" : "火星";
    oppositeStar = isEvenYear ? "水星" : "氷令星";
  } else if (unmeiSu >= 31 && unmeiSu <= 40) {
    reiStar = "月令星";
    reiBranch = 4; // 辰
    star = isEvenYear ? "月星" : "魚令星";
    subStar = isEvenYear ? "魚令星" : "月星";
    oppositeStar = isEvenYear ? "土星" : "天令星";
  } else if (unmeiSu >= 41 && unmeiSu <= 50) {
    reiStar = "木令星";
    reiBranch = 2; // 寅
    star = isEvenYear ? "木星" : "海令星";
    subStar = isEvenYear ? "海令星" : "木星";
    oppositeStar = isEvenYear ? "金星" : "小令星";
  } else {
    reiStar = "水令星";
    reiBranch = 0; // 子
    star = isEvenYear ? "水星" : "氷令星";
    subStar = isEvenYear ? "氷令星" : "水星";
    oppositeStar = isEvenYear ? "火星" : "冥令星";
  }

  const yinYang = isEvenYear ? "陽の宿星" : "陰の宿星";

  return { star, subStar, oppositeStar, reiStar, yinYang, unmeiSu, reiBranch };
}

// 特定の年における令翠学運命周期の取得
export function getReisuiYearCycle(reiBranch: number, targetYear: number): ReisuiCycleStage {
  const yearBranch = ((targetYear - 4) % 12 + 12) % 12;
  const cycleIndex = (yearBranch - reiBranch + 12) % 12;
  return REISUI_12_CYCLES[cycleIndex] || REISUI_12_CYCLES[0];
}

// 特定の月における令翠学運命周期の取得（節月地支基準）
export function getReisuiMonthCycle(reiBranch: number, targetMonth: number): ReisuiCycleStage {
  // 節月地支：1月丑(1), 2月寅(2)... 11月亥(11), 12月子(0)
  const monthBranch = targetMonth === 12 ? 0 : targetMonth;
  const cycleIndex = (monthBranch - reiBranch + 12) % 12;
  return REISUI_12_CYCLES[cycleIndex] || REISUI_12_CYCLES[0];
}

// 年盤における本命星の回座宮計算
// 2025年：二黒土星中宮
// 2026年：一白水星中宮
// 2027年：九紫火星中宮
function getYearGyu(honmeiStar: string, centerStarNum: number): {
  gyuName: string;
  stageName: string;
  theme: string;
  score: number;
  work: string;
  romance: string;
  health: string;
  family: string;
  money: string;
  advice: string;
} {
  const honmeiNum = NINE_STARS.indexOf(honmeiStar) + 1;
  const step = (honmeiNum - centerStarNum + 9) % 9;
  const gyuNum = ((step + 4) % 9) + 1;

  const GYU_DATA: Record<number, any> = {
    1: { // 坎宮（北）: 厄年・冬
      gyuName: "坎宮（北）回座",
      stageName: "【真冬の充電期・種蒔き】",
      theme: "内面を磨き、次の飛躍へのエネルギーをじっくり蓄える年",
      score: 45,
      work: "表舞台で無理に勝負に出るよりも、資格取得・専門知識の習得・地道な根回しに徹すると大吉。水面下の準備が後の大成功の種になります。",
      romance: "派手な進展よりも、本音で語り合える深い信頼関係を育む時。秘密の恋や悩み相談から恋心が芽生えやすい傾向があります。",
      health: "冷え、腎臓・泌尿器系、過労によるメンタルの低下に注意。温かい食事と良質な睡眠で心身をいたわりましょう。",
      family: "家族との静かな団らんが心の特効薬になります。身内の悩みには親身に寄り添い、聞き役に回ると絆が深まります。",
      money: "大きな投資や無謀な出費は避け、貯蓄と資産の見直しに専念すべき時。知的な自己投資には惜しまず使いましょう。",
      advice: "冬がなければ春の芽吹きはありません。焦らず自分と向き合い、静かに実力を蓄えてください。"
    },
    2: { // 坤宮（南西）: 準備・大地
      gyuName: "坤宮（南西）回座",
      stageName: "【大地の準備期・基盤づくり】",
      theme: "土壌を耕し、蒔いた種を丁寧に育てる堅実な年",
      score: 65,
      work: "周囲のサポート役や地道なルーティンワークで信頼が急上昇。目立たぬ努力を誰かが必ず見て評価してくれます。",
      romance: "派手さはありませんが、家庭的で誠実なご縁に恵まれます。結婚を前提とした現実的なパートナーシップが進展します。",
      health: "胃腸の疲れや消化不良、運動不足に注意。規則正しい生活リズムと発酵食品の摂取が運気を底上げします。",
      family: "母親や年上の女性親族との関わりが吉。実家の片付けや家族の健康管理に気を配ると家庭運が安定します。",
      money: "コツコツ貯蓄するのに最適な年。衝動買いを控え、家計簿をつけるなど日々の収支を整えると金運の土台が固まります。",
      advice: "急がば回れ。人のために尽くす姿勢が、巡り巡ってあなたに最大の幸運となって返ってきます。"
    },
    3: { // 震宮（東）: 春・発展
      gyuName: "震宮（東）回座",
      stageName: "【春の芽吹き・積極挑戦期】",
      theme: "殻を破り、新しい挑戦へ力強く踏み出す飛躍の年",
      score: 80,
      work: "新規事業、新企画、未経験の分野への挑戦に最高の追い風。スピード感を持って行動することで先手必勝となります。",
      romance: "電撃的な出会いや、一目惚れの予感。自分から積極的にアプローチすることで恋の扉が勢いよく開きます。",
      health: "肝臓、目、神経系の過度の緊張に注意。朝の散歩やスポーツでエネルギーを発散させると好調を維持できます。",
      family: "明るい話題で家庭内が活気づきます。家族の新しいスタート（進学・就職・引越しなど）を力強く後押しして吉。",
      money: "新しい挑戦に伴う先行投資は吉。ただし、うまい話や投機的な誘惑には飛びつかず、自己の成長に使いましょう。",
      advice: "朝日が昇るような勢いがあります。迷っている時間はもったいないので、直感を信じて行動を起こしてください。"
    },
    4: { // 巽宮（南東）: 初夏・福徳
      gyuName: "巽宮（南東）回座",
      stageName: "【初夏の福徳期・ご縁と信頼の結実】",
      theme: "人脈と信用がどこまでも広がり、望みが叶いやすい大吉年",
      score: 95,
      work: "取引先や上司からの評価が最高潮に達し、大きな契約や抜擢のチャンスが舞い込みます。遠方との取引や出張も吉。",
      romance: "結婚・婚約に12年で最も適した絶好のタイミング！良縁が向こうから引き寄せられ、周囲からも祝福されます。",
      health: "呼吸器系やアレルギー、風邪に注意。アロマや心地よい風を取り入れたリフレッシュが開運に繋がります。",
      family: "親族間のお祝い事や結婚・出産など喜ばしい出来事が続き、家庭内が温かい幸福感に包まれます。",
      money: "人付き合いが増えて交際費はかさみますが、それ以上の豊かなご縁とビジネスチャンスが舞い込み循環します。",
      advice: "風のように軽やかに、誠意を持って人と接してください。あなたの優しさと信用が最高の財産になります。"
    },
    5: { // 中宮（中央）: 帝王・八方塞がり
      gyuName: "中宮（中央）回座",
      stageName: "【真夏の頂点・総決算と再点検】",
      theme: "中心的存在として注目を集める反面、八方塞がりの慎重さが求められる年",
      score: 60,
      work: "これまでの努力の成果がはっきりと形になります。リーダーシップを求められますが、独断専行は厳禁。周囲への配慮が不可欠です。",
      romance: "過去の恋愛の清算や、本物の絆かどうかの試練が訪れます。曖昧な関係には決着をつけ、誠実な愛を選び取りましょう。",
      health: "慢性疾患の再発や胃腸・消化器系の不調に警戒。無理なスケジュールを詰め込まず、定期検診を受けましょう。",
      family: "家の中心人物として責任が重くなります。家族の意見を公平に聞き、偏らない姿勢を保つことで家庭の柱となります。",
      money: "大金の出入りが激しくなりやすい時。高額な買い物や投機は慎重に。これまでの蓄えを守る守備の姿勢が吉。",
      advice: "周りから頼られますが、天狗にならず謙虚さを忘れないこと。足元を固めることが次の黄金期を呼び込みます。"
    },
    6: { // 乾宮（北西）: 秋・活動と実り
      gyuName: "乾宮（北西）回座",
      stageName: "【秋の収穫期・多忙と社会的成果】",
      theme: "高い目標を掲げ、強力なリーダーシップで大願成就を果たす年",
      score: 90,
      work: "社会的地位の向上や昇進、独立開業に抜群の時期。多忙を極めますが、責任を果たすことで大きな実りを得られます。",
      romance: "尊敬できる年上や実力者との出会い。互いを高め合える格調高いパートナーシップが育ちます。",
      health: "過労、頭痛、血圧の変動に注意。忙しさのあまり休養を削らないよう、オンとオフの切り替えを意識して。",
      family: "一家の大黒柱としての威厳と信頼が高まります。父親や目上の親族への孝行がさらなる家庭運アップの鍵。",
      money: "事業収入やボーナスなど、実力に応じた大きなリターンが期待できます。格式の高い品への投資も吉。",
      advice: "妥協せず、堂々と堂々たる態度で前進してください。あなたの信念が人々を動かし、大きな勝利を掴みます。"
    },
    7: { // 兌宮（西）: 収穫の宴・悦楽
      gyuName: "兌宮（西）回座",
      stageName: "【実りの祝宴期・金運と人生の歓び】",
      theme: "努力の実りを味わい、人との会食や語らいで喜びを分かち合う年",
      score: 85,
      work: "チームワークや接待、交渉事で本領発揮。ユーモアと気配りで職場の空気を明るくし、人気を集めます。",
      romance: "食事会や趣味の集まりから素敵な恋が生まれる恋愛満喫期。会話の楽しさがそのまま愛の深まりに直結します。",
      health: "暴飲暴食、口内炎、喉や肺の不調に注意。楽しい場でもお酒や甘いものは適量を心がけましょう。",
      family: "家族での外食や旅行が大吉。食卓を囲んで笑顔で話す時間を増やすことで、家族全体の運気が大きく底上げされます。",
      money: "金運は非常に好調で臨時収入の兆しあり。ただし交際費や飲食・レジャーでの散財も増えやすいため計画性を。",
      advice: "人生を楽しむ心のゆとりを持ってください。あなたの明るい笑顔が、周りの人々を照らす太陽になります。"
    },
    8: { // 艮宮（北東）: 季節の境目・山・変化
      gyuName: "艮宮（北東）回座",
      stageName: "【変化と改革期・人生の大きな転換点】",
      theme: "これまでの流れが一段落し、新しい方向へと舵を切る変革の年",
      score: 70,
      work: "転職、部署異動、独立など環境の大きな変化が起こりやすい時。現状維持に固執せず、時代の変化に柔軟に対応すると大吉。",
      romance: "友人から恋人へのステップアップや、関係性のリセット。古いしがらみを断ち切ることで、真のパートナーに出逢えます。",
      health: "関節、腰、背中、骨のトラブルに注意。無理な姿勢を避け、ストレッチや整体で柔軟性を保ちましょう。",
      family: "親族の相続問題や実家の改築、引越しなど家族に関わる大きなイベントが発生しやすい時。誠実な対話で解決を。",
      money: "不動産運や預貯金の見直し運が良好。長期的な資産形成のプランを練り直すのに最高のタイミングです。",
      advice: "変化を恐れないでください。山を登りきった先に、今まで見たこともない美しい絶景が広がっています。"
    },
    9: { // 離宮（南）: 真夏・太陽・名誉
      gyuName: "離宮（南）回座",
      stageName: "【真昼の太陽期・知性と名誉の頂点】",
      theme: "あなたの隠れた才能が白日の下に照らし出され、脚光を浴びる年",
      score: 75,
      work: "企画やアイデアが高く評価され、賞賛を浴びるチャンス。直感力と先見の明が冴え渡ります。公私のけじめを厳格に。",
      romance: "華やかで情熱的な恋愛が期待できる反面、感情の起伏が激しくなりやすい時。短気を起こさず冷静な対話を。",
      health: "目、心臓、頭部、精神的なストレスに注意。スマホの見過ぎや夜更かしを控え、目を休める工夫を。",
      family: "隠れていた問題が明るみに出やすい時期ですが、膿を出し切る好機。家族間での嘘や隠し事は禁物です。",
      money: "見栄やブランド品での出費が増えがち。自己顕示欲での無駄遣いを戒め、本物の知性や教養にお金を使いましょう。",
      advice: "直感を信じて情熱を燃やしてください。ただし熱くなりすぎず、知性で心をコントロールすることが開運の極意です。"
    }
  };

  return GYU_DATA[gyuNum] || GYU_DATA[1];
}

// ----------------------------------------------------
// 占術別・年代別人生サイクル（バイオリズム期間）生成
// ----------------------------------------------------
function formatLifeStage(
  s: { range: string; title: string; theme: string; pastDesc: string; checkPoint: string },
  currentAge: number
): AgePeriodLifeStage {
  const [minAgeStr, maxAgeStr] = s.range.replace(/才/g, '').replace('以降', '').split('〜');
  const minAge = parseInt(minAgeStr, 10);
  const maxAge = maxAgeStr ? parseInt(maxAgeStr, 10) : 120;
  
  let timingType: 'past' | 'current' | 'future' = 'past';
  if (currentAge >= minAge && currentAge <= maxAge) {
    timingType = 'current';
  } else if (currentAge < minAge) {
    timingType = 'future';
  }

  let dynamicDesc = s.pastDesc;
  if (timingType === 'current') {
    dynamicDesc = `【まさに今、あなたはこの人生の重要なステージ（${s.range}）の只中にいます】\n${s.pastDesc}\n現在、あなたは次のステージへ向かうための重要な転換期に立っており、日々の選択の一つひとつが今後の未来を大きく決定づける鍵となっています。`;
  } else if (timingType === 'future') {
    dynamicDesc = `【これから迎える未来のステージ（${s.range}）です】\n${s.pastDesc}\n現在の努力や経験がすべてこの時期の大きな収穫へと直結していきます。自信を持って準備を進めてください。`;
  }

  return {
    ageRange: s.range,
    stageTitle: s.title,
    timingType,
    lifeTheme: s.theme,
    description: dynamicDesc,
    checkPoint: s.checkPoint
  };
}

// 1. 四柱推命の大運（立運数に基づく10年周期）
function generateFourPillarsLifeStages(
  y: number,
  m: number,
  d: number,
  currentAge: number,
  gender: string = 'male'
): AgePeriodLifeStage[] {
  // 節入り日テーブル（各月節入りの概算日）
  const cutoffDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
  const currCutoff = cutoffDays[m - 1];
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? y + 1 : y;
  const nextCutoff = cutoffDays[nextMonth - 1];

  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const nextDate = new Date(Date.UTC(nextYear, nextMonth - 1, nextCutoff));
  const prevDate = new Date(Date.UTC(y, m - 1, currCutoff));

  // 年干の陰陽（1984=甲(0/陽), 1985=乙(1/陰), 1986=丙(2/陽)...）
  const yIndex = ((y - 4) % 10 + 10) % 10;
  const isYangYear = (yIndex % 2 === 0);
  const isMale = (gender === 'male' || gender === '男性' || gender === '');
  const isForward = (isMale && isYangYear) || (!isMale && !isYangYear);

  let diffDays = 0;
  if (isForward) {
    diffDays = Math.round((nextDate.getTime() - targetDate.getTime()) / 86400000);
  } else {
    diffDays = Math.round((targetDate.getTime() - prevDate.getTime()) / 86400000);
  }

  let startAge = Math.floor(Math.abs(diffDays) / 3);
  if (startAge < 1) startAge = 1;
  if (startAge > 10) startAge = 10;

  const stages: { range: string; title: string; theme: string; pastDesc: string; checkPoint: string }[] = [];

  // 立運前（0才〜startAge-1才）
  if (startAge > 0) {
    stages.push({
      range: `0才〜${startAge - 1}才`,
      title: `【幼少期・胎動の運気】大運に入る前の基礎形成期`,
      theme: `家族の守護と天賦の気質の目覚め`,
      pastDesc: `四柱推命における本格的な大運（10年ごとの大きな運命の波）に入る前の準備期間です。家庭環境や両親の運気に強く守られながら、あなた本来の生命力と豊かな感受性の種がじっくりと育まれた大切な時期です。`,
      checkPoint: `【過去の答え合わせ】幼い頃に培った安心感や家庭での原体験が、その後のあなたの粘り強さと人徳の原点になっています。`
    });
  }

  const daitunThemes = [
    { title: "自我の確立と学びの基礎固め", theme: "素直な吸収力と将来への好奇心", desc: "学問や習い事、友人関係を通じて自分の強みや個性を発見していく10年です。素直さと旺盛な好奇心が大きな成長をもたらします。" },
    { title: "青春の飛躍と自立への助走", theme: "情熱と挑戦、仲間との出会い", desc: "社会や将来に向けて視野が一気に広がり、時に葛藤しながらも自立心を鍛え上げる時代です。情熱を注げる目標に出会う好機です。" },
    { title: "社会への進出と試行錯誤の開拓期", theme: "独立独歩、実力で道を切り拓く時代", desc: "社会の荒波に揉まれながらも、自分の足で立ち、理想と現実のバランスを取りながら確かな実力を身につけていく修行の10年です。" },
    { title: "才能の開花とキャリアの黄金確立期", theme: "専門性の発揮、社会的責任と大きな成果", desc: "これまでの経験とスキルが一つに結実し、仕事でも人生でも主役として大きな成果を上げる黄金期です。周囲からの信頼も絶頂に達します。" },
    { title: "人生の集大成・統率力と大収穫期", theme: "確固たる地位、リーダーシップと大きな実り", desc: "社会的地位や経済基盤が不動のものとなり、組織や家族の中心人物として大きな影響力を発揮する円熟期です。大願成就の時です。" },
    { title: "円熟と継承・人徳による大発展期", theme: "後進の育成、豊かな影響力と安定した基盤", desc: "自らの成功を分かち合い、後進の育成や社会貢献に尽くすことで、深い人徳と尊敬を集める豊かな時代を過ごします。" },
    { title: "精神的自由と智慧の分かち合い期", theme: "名誉とゆとり、心穏やかな黄金時代", desc: "あらゆる責任を果たし終え、自分の純粋な喜びや趣味、智慧の探求に生きる最高の自由期です。心穏やかな幸福に包まれます。" }
  ];

  for (let i = 0; i < 7; i++) {
    const fromAge = startAge + i * 10;
    const toAge = fromAge + 9;
    const meta = daitunThemes[i] || daitunThemes[0];
    stages.push({
      range: `${fromAge}才〜${toAge}才`,
      title: `【第${i + 1}大運】${meta.title}`,
      theme: meta.theme,
      pastDesc: meta.desc,
      checkPoint: `【大運の節目】この年代の開始前後（${fromAge}才頃）に、人生の方向性を決定づける大きな環境の変化や重要な決断の機会が訪れます。`
    });
  }

  // 第8大運以降
  const finalStartAge = startAge + 70;
  stages.push({
    range: `${finalStartAge}才以降`,
    title: `【第8大運以降】人生の完成と徳の結実期`,
    theme: `心穏やかな自由、後世へ語り継ぐ人生の智慧`,
    pastDesc: `あらゆる人生経験が昇華され、心穏やかで豊かな実りに包まれる最高の黄金時代です。あなたの存在そのものが周囲の人々の希望と安心の灯火となります。`,
    checkPoint: `【大輪の花】生涯を通じて蒔いてきた愛と誠実さの種が、美しい果実となってあなたと家族を温かく満たし続けます。`
  });

  return stages.map(s => formatLifeStage(s, currentAge));
}

// 2. 九星気学（9年周期・中宮帰還サイクル）
function generateNineStarLifeStages(currentAge: number, honmeiStar: string): AgePeriodLifeStage[] {
  const themes = [
    {
      range: "0才〜8才",
      title: "【第1巡・命の根付き】自己の核と生命力の芽生え",
      theme: "純粋な感受性と家族との深い絆",
      pastDesc: "本命星が九宮（坎宮から離宮）を初めて一周する最初の9年間です。大自然の気の巡りを無意識のうちに体感し、あなた特有の気質と生命力の土台が温かい家庭の中でじっくりと育まれた時代です。",
      checkPoint: "【過去の答え合わせ】幼少期に感じた家族の温もりや原風景が、今のあなたの直感力と感性の根底に息づいています。"
    },
    {
      range: "9才〜17才",
      title: "【第2巡・躍動の9年】好奇心の爆発と自我の目覚め",
      theme: "自立心の芽生えと個性的な才能の開花",
      pastDesc: "学校生活や友人関係の中で、自分ならではの得意分野や価値観が形作られていく思春期の9年間です。外の世界からの刺激を貪欲に吸収し、精神的な自立への第一歩を踏み出しました。",
      checkPoint: "【過去の答え合わせ】10代半ば（13〜15才頃）に、その後の生き方に大きな影響を与える趣味・特技や親友との出会いがあったはずです。"
    },
    {
      range: "18才〜26才",
      title: "【第3巡・開拓の9年】社会への挑戦と試行錯誤の助走期",
      theme: "自立と挑戦、数々の試練を通じた自己発見",
      pastDesc: "社会へと飛び出し、理想と現実の狭間で葛藤しながらも自立した大人としての足場を固めた9年間です。挫折や方針転換を経験しながらも、自分だけの強みを研ぎ澄ましていきました。",
      checkPoint: "【過去の答え合わせ】20代前半（21〜23才頃）に、進路の決定や環境の急変など、自立心を試される大きな分岐点を乗り越えています。"
    },
    {
      range: "27才〜35才",
      title: "【第4巡・確立の9年】実力発揮と社会的信用の獲得",
      theme: "スキルの研ぎ澄ましと人生の基盤確立",
      pastDesc: "20代の試行錯誤が確かな成果として実を結び、周囲から一人前のプロフェッショナルとして厚い信頼を寄せられる充実期です。仕事もプライベートも大きく前進し、揺るぎない基盤を確立します。",
      checkPoint: "【過去・現在の照らし合わせ】30才前後に、任される責任が一段と大きくなり、自分の得意分野で確固たる手応えを掴んだはずです。"
    },
    {
      range: "36才〜44才",
      title: "【第5巡・転換の9年】中宮帰還と人生最大の大勝負",
      theme: "中心人物としての飛躍と人生の再定義",
      pastDesc: "本命星が再び生まれの座（中宮）へと回座し、人生の第二のスタートを切る最もダイナミックな9年間です。これまでの経験を総動員して自らの殻を破り、組織や社会の中心人物として大活躍します。",
      checkPoint: "【運命の転換点】36才〜40才にかけて、人生観を刷新するような大きな舞台への抜擢や、新たな挑戦の機会が訪れています。"
    },
    {
      range: "45才〜53才",
      title: "【第6巡・実力の9年】リーダーシップと大いなる実り",
      theme: "組織を導く指導力と社会的影響力の拡大",
      pastDesc: "確固たる地位を築き、多くの人々を牽引するリーダーとして真価を発揮する9年間です。自らの手腕で大きなプロジェクトを成功に導き、社会的・経済的な実りを存分に享受します。",
      checkPoint: "【人生の実り】周囲を育てる喜びを知り、あなたの判断や言葉が多くの人にとっての指針となります。"
    },
    {
      range: "54才〜62才",
      title: "【第7巡・集大成の9年】経験の結実と次世代への継承",
      theme: "人生の総決算と豊かな人徳の伝承",
      pastDesc: "これまでのキャリアと人生の集大成を迎え、培った智慧や人脈を後進に惜しみなく授ける豊かな円熟期です。安定した生活基盤のもと、心からの感謝と尊敬に包まれます。",
      checkPoint: "【円熟の証】肩の力を抜きながらも、要所を締める重鎮として周囲から絶大な信頼を寄せられます。"
    },
    {
      range: "63才以降",
      title: "【第8巡以降・黄金の9年】精神的自由と心穏やかな黄金時代",
      theme: "智慧の分かち合い、悠々自適の第二の人生",
      pastDesc: "世俗のしがらみや義務から完全に解放され、純粋な好奇心や趣味、精神的な探求に生きる最高の自由期です。蒔いてきた徳が光となり、生涯にわたり温かく守られます。",
      checkPoint: "【生涯の祝福】心穏やかな日々に感謝が溢れ、あなたの存在そのものが家族や仲間の大きな心の支えとなります。"
    }
  ];

  return themes.map(s => formatLifeStage(s, currentAge));
}

// 3. 令翠学（12年周期・バイオリズム大運サイクル）
function generateReisuiLifeStages(currentAge: number, reisuiStar: string): AgePeriodLifeStage[] {
  const themes = [
    {
      range: "0才〜11才",
      title: "【第1周期・12年の種蒔き】無垢な受容と生命力の涵養",
      theme: "素直な育ちと家族の温もり、豊かな感性の基礎",
      pastDesc: "令翠学の12運命周期（背信期・令期・精算期・開拓期・生長期・決定期・健康期・人気期・油断期・再開期・経済期・充実期）を人生で初めて一周する期間です。純粋無垢な心であらゆる経験を吸収し、一生の気質の根幹が育まれました。",
      checkPoint: "【幼少の原体験】この時期に親や周囲から注がれた愛情が、あなたの一生の自己肯定感の源泉となっています。"
    },
    {
      range: "12才〜23才",
      title: "【第2周期・12年の開拓】青春の自立と果敢な挑戦",
      theme: "試行錯誤を通じた自己発見と人生の進路決定",
      pastDesc: "自分の意志で進路を選択し、社会へ向けて飛び出す激動の12年間です。思春期の葛藤や挫折を乗り越えながら、自分の芯となる価値観と才能を確立していきました。",
      checkPoint: "【過去の答え合わせ】20才前後に、人生の大きな岐路（進学・就職・大きな出会い）を自らの決断で切り拓いた経験があります。"
    },
    {
      range: "24才〜35才",
      title: "【第3周期・12年の確立】キャリアの土台形成と飛躍",
      theme: "社会での独立独歩、実力と信頼の獲得期",
      pastDesc: "社会の第一線で実力を遺憾なく発揮し、自分ならではのポジションを確立する12年です。仕事での成功体験とともに、パートナーシップや家庭などの基盤が強固に築かれます。",
      checkPoint: "【過去・現在の照らし合わせ】20代後半から30代前半にかけて、キャリアや人生の方向性を決定づける重要な勝負所を経験しています。"
    },
    {
      range: "36才〜47才",
      title: "【第4周期・12年の充実】実力発揮と人生の黄金収穫期",
      theme: "大願成就、最高潮のバイオリズムと大成",
      pastDesc: "令翠学のバイオリズムが最高潮に達する、人生最大の収穫期です。これまでの努力が大きな果実となって実を結び、社会的地位も経済的豊かさもピークを迎えます。",
      checkPoint: "【人生の黄金期】自分の才能を信じて思い切った挑戦をすることで、想像を遥かに超える大成功を掴み取ることができます。"
    },
    {
      range: "48才〜59才",
      title: "【第5周期・12年の円熟】人徳と指導力による大成",
      theme: "後進への継承、安定した基盤と大いなる豊かさ",
      pastDesc: "自らの成功を周囲に分かち合い、組織や後進を育成することに喜びを見出す円熟の12年間です。確固たる信用と人徳に支えられ、心穏やかで豊かな生活基盤を享受します。",
      checkPoint: "【人徳の証】多くの人々から相談を受け、感謝される存在として社会的に重要な役割を果たし続けます。"
    },
    {
      range: "60才〜71才",
      title: "【第6周期・12年の再創造】還暦と新しい人生の謳歌",
      theme: "精神的自由、自由な情熱に生きる第二の青春",
      pastDesc: "還暦を迎え、バイオリズムが新たなスタートラインへと回帰する第二の青春時代です。培った智慧と経験を活かし、真に心惹かれる新しい趣味や活動に没頭することができます。",
      checkPoint: "【第二の人生】しがらみから解き放たれ、自分らしい生き方を謳歌する喜びに満ち溢れます。"
    },
    {
      range: "72才以降",
      title: "【第7周期以降・12年の安泰】生涯の徳の結実と穏やかな日々",
      theme: "心穏やかな安らぎ、感謝と愛に満ちた黄金時代",
      pastDesc: "生涯を通じて蒔いてきた徳の種が、美しい果実となってあなたを生涯温かく守り続けます。家族や仲間に囲まれ、愛と感謝に満ちた心穏やかな日々を過ごします。",
      checkPoint: "【生涯の安泰】あなたの歩んできた軌跡そのものが、次世代にとってのかけがえのない道標となります。"
    }
  ];

  return themes.map(s => formatLifeStage(s, currentAge));
}

// 4. 総合（全体統合ライフステージ）
function generateOverallLifeStages(currentAge: number): AgePeriodLifeStage[] {
  const stagesConfig = [
    {
      range: "0才〜18才",
      title: "【幼少・青年期】感性の芽生えと自己の基礎形成",
      theme: "模索と感受性の育み",
      pastDesc: "家族環境や学校生活の中で、人とは違う独自の感性や強い好奇心を育んだ時代です。繊細さゆえに周囲の顔色を伺ったり、内面で葛藤を抱えることもありましたが、この時期に培った集中力や忍耐力が現在のあなたの揺るぎない土台となっています。",
      checkPoint: "【過去の答え合わせ】10代半ば頃に、人生の価値観を大きく変えるような出会いや、夢中になった趣味・目標があったはずです。"
    },
    {
      range: "19才〜29才",
      title: "【青春・開拓期】社会への挑戦と試行錯誤の修行期",
      theme: "自立と挑戦、数々の試練を通じた自己発見",
      pastDesc: "社会へ出て自分の足で立ち、理想と現実のギャップに悩みながらもがむしゃらに前進した時代です。人間関係の広がりとともに挫折や方向転換も経験しましたが、すべては自分の真の適性と強みを知るための貴重な糧となりました。",
      checkPoint: "【過去の答え合わせ】20代半ば前後に、環境の急激な変化（就職・転職・引っ越し・大きな失恋など）を経験し、自立心が鍛えられました。"
    },
    {
      range: "30才〜44才",
      title: "【壮年・飛躍期】才能の開花と人生の基盤確立",
      theme: "実力の発揮、リーダーシップと社会的責任",
      pastDesc: "これまでの経験とスキルが一つに結びつき、あなたならではの個性と実力が社会で大きく評価される黄金期です。仕事でも家庭でも中心的な役割を担い、多忙を極めながらも確かな手応えと自信を掴み取っていきます。",
      checkPoint: "【過去・現在の照らし合わせ】30代に入ってから自分の役割や目標が明確になり、周囲から頼りにされる場面が一気に増えたはずです。"
    },
    {
      range: "45才〜59才",
      title: "【実年・充実期】経験の結実と次世代への継承",
      theme: "大いなる収穫、指導力と精神的豊かさの追求",
      pastDesc: "社会的地位や経済的な基盤が確固たるものとなり、人生の集大成を迎える時期です。自らの成功だけでなく、後進の育成や周囲への貢献に生きがいを見出し、人徳によって多くの人から慕われる豊かな円熟期を過ごします。",
      checkPoint: "【人生の道標】物事に動じない心の余裕が生まれ、本当に大切な人間関係や生き方が研ぎ澄まされていきます。"
    },
    {
      range: "60才以降",
      title: "【円熟・黄金期】自由と智慧、人生の自由な謳歌",
      theme: "精神的自由、智慧の分かち合いと心穏やかな黄金時代",
      pastDesc: "これまでの重責から解放され、自分自身の純粋な情熱や知的好奇心に生きる最高の自由期です。培った豊かな知恵を周囲に惜しみなく授け、心穏やかで愛に満ちた日々を謳歌することができます。",
      checkPoint: "【未来の希望】これまで蒔いてきた徳の種が、美しい花と実となってあなたを生涯にわたり温かく守り続けます。"
    }
  ];

  return stagesConfig.map(s => formatLifeStage(s, currentAge));
}

// ----------------------------------------------------
// メイン鑑定計算関数
// ----------------------------------------------------
export function calculateFortune(birthdate: string, name: string, gender: string = 'male'): FortuneResult {
  const [y, m, d] = birthdate.split('-').map(Number);
  const nameBase = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedBase = y + m + d + nameBase;
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentAge = currentYear - y;

  const pillars = getPillar(y, m, d);
  const honmeiStar = getHonmeiStar(y, m, d);
  const getsumeiStar = getGetsumeiStar(honmeiStar, m, d);
  const nichimeiStar = getNichimeiStar(y, m, d);
  const keishaInfo = getKeishaGyu(honmeiStar, getsumeiStar);

  // 1. 九星気学の年盤（2025:二黒中宮, 2026:一白中宮, 2027:九紫中宮）
  const nsLastYearData = getYearGyu(honmeiStar, 2); // 2025年
  const nsThisYearData = getYearGyu(honmeiStar, 1); // 2026年
  const nsNextYearData = getYearGyu(honmeiStar, 9); // 2027年

  const nineStarYearFlows = {
    lastYear: {
      year: 2025,
      label: "2025年(去年)",
      starOrStage: `二黒土星中宮盤：【${nsLastYearData.gyuName}】`,
      theme: nsLastYearData.theme,
      score: nsLastYearData.score,
      work: nsLastYearData.work,
      romance: nsLastYearData.romance,
      health: nsLastYearData.health,
      family: nsLastYearData.family,
      money: nsLastYearData.money,
      keyAdvice: nsLastYearData.advice
    },
    thisYear: {
      year: 2026,
      label: "2026年(今年)",
      starOrStage: `一白水星中宮盤：【${nsThisYearData.gyuName}】`,
      theme: nsThisYearData.theme,
      score: nsThisYearData.score,
      work: nsThisYearData.work,
      romance: nsThisYearData.romance,
      health: nsThisYearData.health,
      family: nsThisYearData.family,
      money: nsThisYearData.money,
      keyAdvice: nsThisYearData.advice
    },
    nextYear: {
      year: 2027,
      label: "2027年(来年)",
      starOrStage: `九紫火星中宮盤：【${nsNextYearData.gyuName}】`,
      theme: nsNextYearData.theme,
      score: nsNextYearData.score,
      work: nsNextYearData.work,
      romance: nsNextYearData.romance,
      health: nsNextYearData.health,
      family: nsNextYearData.family,
      money: nsNextYearData.money,
      keyAdvice: nsNextYearData.advice
    }
  };

  // 九星気学の性格・特性マスターデータ
  const NINE_STAR_PROFILES: Record<string, any> = {
    "一白水星": {
      personality: "水のようにどんな器にも形を変えて馴染む柔軟性と、深い思慮深さを持っています。表面上は穏やかで社交的ですが、内面には強い自立心と粘り強さを秘めた『外柔内剛』の人です。",
      strengths: ["卓越した適応能力と柔軟性", "人の痛みが分かる深い共感力", "困難を乗り越える驚異の忍耐強さ", "物事の本質を見抜く鋭い洞察力"],
      weaknesses: ["悩みを一人で抱え込みやすい", "警戒心が強く本音を見せるのに時間がかかる", "時に秘密主義になり孤独に陥りやすい"],
      cautions: "精神的なストレスを内に溜め込みすぎると、冷えや体調不良に直結します。信頼できる人に弱音を吐く勇気を持ちましょう。",
      habits: "問題が起きた時に『私が我慢すれば…』と自分を責めたり、一人で秘密裏に解決しようとする思考癖があります。",
      suitableJobs: ["カウンセラー・心理職", "研究開発・学者", "企画・マーケティング", "執筆・クリエイター", "水産・飲食・癒し産業"],
      suitableJobDetail: "深い専門知識や人の心に寄り添う仕事で類まれなる才能を発揮します。単調な作業よりも、試行錯誤して深掘りできる環境が向いています。",
      communication: "初対面では相手に合わせすぎて疲れやすいため、無理にテンションを上げず、聞き役に徹して誠実な相槌を打つと自然に好かれます。",
      goodAffinity: ["六白金星", "七赤金星", "三碧木星", "四緑木星"],
      affinityDetail: "金星（六白・七赤）はあなたに知恵とエネルギーを与えてくれる最高の支援星。木星（三碧・四緑）はあなたの愛情を受け取って伸ばしてくれる好相性です。"
    },
    "二黒土星": {
      personality: "万物を育てる母なる大地のように、温かく包容力に溢れた人です。派手な自己主張よりも、縁の下の力持ちとして周囲を支え、コツコツと実績を積み上げる誠実さの塊です。",
      strengths: ["誰からも信頼される抜群の堅実さ", "人の育成やサポートにおける天才的才能", "地道な作業をやり抜く粘り強さ", "温和で人を安心させる穏やかな人柄"],
      weaknesses: ["優柔不断で決断に時間がかかりすぎる", "変化を恐れて現状維持に固執しやすい", "不満を溜め込んで突然頑固になる"],
      cautions: "人の世話を焼きすぎて自分のことが後回しになりがちです。たまには自分を最優先に甘やかす時間を作りましょう。",
      habits: "新しい提案を受けた時に、まず『リスクや前例の無さ』から考えてしまい、チャンスを逃しやすい傾向があります。",
      suitableJobs: ["人事・総務・バックオフィス", "教育・保育・指導員", "不動産・農業・土木", "医療・福祉・介護", "伝統産業・職人"],
      suitableJobDetail: "人を育てたり、組織の土台を盤石にする役割で無類の強さを発揮します。急激な成果よりも、長期的に信頼を育てる仕事で大成します。",
      communication: "聞き上手で安心感を与えるため相談されやすい人です。自分の意見を求められた時は、控えめになりすぎず正直な想いを伝えて吉。",
      goodAffinity: ["九紫火星", "六白金星", "七赤金星", "八白土星"],
      affinityDetail: "火星（九紫）はあなたの情熱に火をつけて勇気を与えてくれます。金星（六白・七赤）はあなたの尽力に心から感謝し引き立ててくれます。"
    },
    "三碧木星": {
      personality: "春の雷のように、若々しいエネルギーとバイタリティに満ち溢れたパイオニアです。好奇心旺盛で行動力抜群、ひらめきを即座に行動に移すスピード感が最大の魅力です。",
      strengths: ["時代の先を読む鋭い直感と発想力", "何事にも恐れず飛び込む抜群の行動力", "明るく前向きで周囲を元気にするエネルギー", "素直で嘘がつけない裏表のなさ"],
      weaknesses: ["熱しやすく冷めやすい飽きっぽさ", "言葉がストレートすぎて悪気なく人を傷つける", "詰めが甘く後始末が苦手"],
      cautions: "思いついたら即行動する長所がある反面、早合点や失言に注意。発言する前に『3秒置く』習慣で人間関係のトラブルを未然に防げます。",
      habits: "計画を最後までやり切る前に、新しい面白そうなことに目移りしてしまう思考パターンがあります。",
      suitableJobs: ["マスコミ・アナウンサー・司会", "IT・WEB・最先端テクノロジー", "スタートアップ・起業家", "営業・イベントプロデュース", "音楽・音響・エンタメ"],
      suitableJobDetail: "スピード感があり、常に新しいトレンドを追いかける刺激的な環境で輝きます。古い慣習に縛られた職場では窒息してしまいます。",
      communication: "楽しい話題で場を盛り上げる天才です。ただし、人の話を最後まで遮らずに聞く意識を持つと、さらに信望を集めます。",
      goodAffinity: ["一白水星", "九紫火星", "四緑木星"],
      affinityDetail: "水星（一白）はあなたのアイデアに冷静な知恵と潤いを与えてくれます。火星（九紫）はあなたの情熱をさらに大きく燃え上がらせてくれます。"
    },
    "四緑木星": {
      personality: "初夏を渡る爽やかな風のように、人を惹きつける天性の社交性と調和力を持っています。人当たりが極めて良く、どこに行っても愛され、信用を自然と勝ち取れる徳の人です。",
      strengths: ["誰とでも円満に打ち解ける卓越した対人能力", "場の空気を和ませる優しさと気配り", "柔軟な思考と情報収集のアンテナ", "信用を重んじる誠実な生き方"],
      weaknesses: ["八方美人になりすぎて決断がブレる", "他人の意見に流されやすく自分の軸を見失う", "迷いすぎて絶好のタイミングを逃す"],
      cautions: "誰からも好かれようとして板挟みになり、疲弊することがあります。『すべての人に良い顔はできない』と割り切る勇気が運気を開きます。",
      habits: "頼まれると嫌と言えず、自分の許容量を超えた仕事や約束を引き受けてしまう癖があります。",
      suitableJobs: ["営業・渉外・広報", "旅行・観光・貿易・航空", "通信・メディア・出版", "ブライダル・接客・カウンセラー", "流通・仲介ビジネス"],
      suitableJobDetail: "人と人を繋ぐ架け橋となる仕事や、遠方・海外と関わる仕事で大活躍します。人脈そのものがあなたの最大の武器となります。",
      communication: "自然な気遣いで相手を心地よくさせる名人です。自分の希望を伝える時も、角を立てずに柔らかく伝えることができます。",
      goodAffinity: ["一白水星", "九紫火星", "三碧木星"],
      affinityDetail: "水星（一白）からは深い安心感と愛をもらえ、火星（九紫）とは華やかで刺激的な高め合いの関係を築けます。"
    },
    "五黄土星": {
      personality: "大自然の中心で万物を支配するマグマのような圧倒的な存在感と統率力を持っています。困難に直面するほど本領を発揮し、どん底からでも自力で這い上がる最強の不屈の魂です。",
      strengths: ["圧倒的なリーダーシップとカリスマ性", "何事にも動じない度胸と不屈の精神力", "情に厚く仲間や部下を決して見捨てない親分肌", "ゼロから有を生み出す強烈な突破力"],
      weaknesses: ["自己主張が強すぎてワンマンになりやすい", "白黒をはっきりつけたがり妥協が苦手", "プライドが高く人に頭を下げるのが苦手"],
      cautions: "自分の正しさを押し通そうとすると周囲と衝突します。『負けるが勝ち』の精神と、他者への寛容さを持つことで真の帝王となります。",
      habits: "物事を『敵か味方か』『成功か失敗か』の二極化で捉え、自分を追い込みやすい傾向があります。",
      suitableJobs: ["会社経営者・政治家・事業家", "リーダー・組織のトップ", "再生事業・事業承継・コンサル", "不動産・建設・大規模開発", "警察・消防・危機管理"],
      suitableJobDetail: "誰かの指示に従うポジションよりも、全体を指揮し責任を背負う立場で真価を発揮します。難易度が高いプロジェクトほど燃えます。",
      communication: "頼もしさで人を惹きつけます。部下や後輩の意見にじっくり耳を傾け、感謝を言葉にすることで絶対的な忠誠と信頼を得られます。",
      goodAffinity: ["九紫火星", "六白金星", "七赤金星", "二黒土星", "八白土星"],
      affinityDetail: "火星（九紫）はあなたのカリスマ性を照らし、金星（六白・七赤）はあなたの力強いリーダーシップを喜んで支えてくれます。"
    },
    "六白金星": {
      personality: "磨き抜かれた白金のように気品高く、高い理想と誇りを持って突き進む生まれながらの指導者です。責任感が非常に強く、自分に厳しくストイックに完璧を追求します。",
      strengths: ["高潔な倫理観と揺るぎない正義感", "物事を完成形まで持っていく圧倒的な遂行力", "決断力に優れ大きな責任を背負える器", "神仏や目に見えない力に守られる強運"],
      weaknesses: ["自分にも他人にも厳しすぎて息が詰まる", "融通が利かず頑固になりやすい", "甘えるのが下手で孤立しやすい"],
      cautions: "正論を振りかざすと人を追い詰めてしまいます。時には『まあいいか』と他人の不完全さを許す大らかさが人望を高めます。",
      habits: "弱みを見せることを恥と感じ、限界まで一人で重圧を抱え込んでしまうストイックすぎる癖があります。",
      suitableJobs: ["経営層・エグゼクティブ・役員", "金融・銀行・投資・証券", "法律家・裁判官・公務員", "精密機械・航空・自動車・金属", "独立系コンサルタント"],
      suitableJobDetail: "大きな組織を動かすポジションや、高度な専門知識と責任を伴う分野でトップに君臨します。妥協のない仕事ぶりが絶賛されます。",
      communication: "礼儀正しく誠実ですが、威圧感を与えないよう笑顔を意識して。相手の些細なミスも笑って許す姿勢が人気を呼びます。",
      goodAffinity: ["二黒土星", "五黄土星", "八白土星", "一白水星"],
      affinityDetail: "土星（二黒・五黄・八白）はあなたを惜しみなく支えてくれる大地。水星（一白）へはあなたの知性を注ぎ込み深い絆を築けます。"
    },
    "七赤金星": {
      personality: "人々が集まる実りの秋の宴のように、愛嬌と話術に長け、その場をパッと明るくする天性の人気者です。人生を楽しく美味しく生きる知恵を持った幸運の星です。",
      strengths: ["人を魅了する卓越したトーク力と機転", "豊かなユーモアと人を喜ばせるエンタメ力", "金運を引き寄せる天性の豊かさのセンス", "直感的に美味しいものや良いものを見抜く鑑識眼"],
      weaknesses: ["軽はずみな失言やおしゃべりで失敗しやすい", "見栄っ張りで派手な出費になりがち", "物事を途中で投げ出すツメの甘さ"],
      cautions: "『口は災いの元』に最も注意すべき星です。人の噂話や愚痴に同調せず、相手を褒める言葉に徹することで金運と人脈が跳ね上がります。",
      habits: "気分が乗らないと後回しにしたり、言い訳でその場を乗り切ろうとする癖があります。",
      suitableJobs: ["飲食・カフェ・レストラン・食品", "タレント・アナウンサー・声優", "美容・ファッション・ジュエリー", "セールス・インフルエンサー", "金融・資産運用・接客"],
      suitableJobDetail: "人と会話する仕事や、食・美・楽しさを届ける分野で大成功します。あなたの笑顔そのものが最大のセールスポイントです。",
      communication: "場を和ませる天才です。人の話のオチを奪わず、相手を気持ちよく喋らせてあげる聞き上手を意識すると無敵です。",
      goodAffinity: ["二黒土星", "五黄土星", "八白土星", "一白水星"],
      affinityDetail: "土星（二黒・五黄・八白）からは溢れる愛情と物質的支援を受け、水星（一白）とは知的で楽しい対話が弾みます。"
    },
    "八白土星": {
      personality: "どっしりとそびえ立つ高山のように、高い志と不屈の粘り強さを持った大器晩成の人です。物事を根本から改革する力を持ち、困難な山も一歩ずつ確実に登りつめます。",
      strengths: ["一度決めたら絶対に諦めない驚異の継続力", "現状の停滞を打破する大胆な改革精神", "冷静沈着でブレない強固な意志", "家族や身内を命がけで守る深い情義"],
      weaknesses: ["頑固で一度心を閉ざすと融通が利かない", "人見知りで最初は近寄りがたいオーラを出す", "急激な変化を起こして周囲を振り回す"],
      cautions: "山が高ければ高いほど谷も深くなります。独りよがりにならず、周囲との対話と協調を大切にすることで真の天下を取れます。",
      habits: "納得いかないことがあると無言でシャットアウトし、相手を寄せ付けなくなる思考パターンがあります。",
      suitableJobs: ["不動産・建築・都市開発・ホテル", "事業承継・組織改革コンサルタント", "金融・ファンドマネージャー", "伝統芸能・宗教・研究職", "自営業・後継ぎビジネス"],
      suitableJobDetail: "時間をかけて大きな資産や事業を築く分野、あるいは停滞した組織を劇的に立て直す役割で圧倒的な成果を出します。",
      communication: "口数は少なくても一言一言に重みがあります。親しい人には笑顔と感謝を意識して見せることで、深い尊敬を集めます。",
      goodAffinity: ["九紫火星", "六白金星", "七赤金星", "二黒土星"],
      affinityDetail: "火星（九紫）はあなたの志を燃え上がらせてくれ、金星（六白・七赤）はあなたの頑固さを和らげて成果に変えてくれます。"
    },
    "九紫火星": {
      personality: "太陽や燃え盛る炎のように、華やかで情熱的、鋭い直感と知性を兼ね備えた天才肌です。美意識が極めて高く、物事の先を見通す先見の明で時代をリードします。",
      strengths: ["一瞬で本質を見抜く天才的な直感力", "人の目を釘付けにする華やかな存在感と美的センス", "知的好奇心が旺盛で学びを吸収するスピード", "情熱的で人を巻き込む熱量"],
      weaknesses: ["熱しやすく冷めやすい極端な性格", "プライドが高く批判されると激怒しやすい", "感情の起伏が激しく喜怒哀楽が激しい"],
      cautions: "火は燃え上がるのも早いですが、燃え尽きるのも早いです。一時の感情で人間関係を断ち切らず、長期的な視点を保つことが開運の鍵です。",
      habits: "白黒を即座につけたがり、グレーゾーンを許容できない短気な思考癖があります。",
      suitableJobs: ["デザイナー・クリエイター・芸術家", "IT・AI・先端科学・研究者", "美容・コスメ・モデル・アパレル", "法律家・学者・ジャーナリスト", "ブランディング・プロデューサー"],
      suitableJobDetail: "美意識、知性、直感、最先端トレンドが活きる分野で唯一無二の光を放ちます。枠にはめられたルーティン業務には耐えられません。",
      communication: "知的で刺激的な会話を好みます。相手の欠点を鋭く指摘しすぎず、温かい言葉で包み込む大人の余裕を持つとカリスマ性が倍増します。",
      goodAffinity: ["三碧木星", "四緑木星", "二黒土星", "八白土星"],
      affinityDetail: "木星（三碧・四緑）はあなたという炎に絶え間なく薪をくべてくれる最高のパートナー。土星（二黒・八白）へは情熱を分け与えられます。"
    }
  };

  const nsProfile = NINE_STAR_PROFILES[honmeiStar] || NINE_STAR_PROFILES["一白水星"];

  const nineStarLifeStages = generateNineStarLifeStages(currentAge, honmeiStar);

  const nineStarDetail: NineStarNatureDetail = {
    star: honmeiStar,
    honmeiStar,
    getsumeiStar,
    nichimeiStar,
    keisha: keishaInfo.name,
    keishaMeaning: keishaInfo.meaning,
    personality: nsProfile.personality,
    strengths: nsProfile.strengths,
    weaknesses: nsProfile.weaknesses,
    cautions: nsProfile.cautions,
    habits: nsProfile.habits,
    suitableJobs: nsProfile.suitableJobs,
    suitableJobDetail: nsProfile.suitableJobDetail,
    communication: nsProfile.communication,
    goodAffinity: nsProfile.goodAffinity,
    affinityDetail: nsProfile.affinityDetail,
    yearFlows: nineStarYearFlows,
    lifeStages: nineStarLifeStages,
    explanation: `${name}さんの九星気学の本命星は「${honmeiStar}」、月命星は「${getsumeiStar}」、日命星は「${nichimeiStar}」です。\nさらに深層心理と潜在能力を示す傾斜宮は「${keishaInfo.name}」に位置しています。\n外向きの性格（本命星）では${honmeiStar}特有の魅力が輝き、内面の精神（月命星・傾斜宮）では${keishaInfo.meaning}が強く働いています。`
  };

  // ----------------------------------------------------
  // 2. 四柱推命 (FourPillars)
  // ----------------------------------------------------
  const dayStem = pillars.day.charAt(0);
  const STEM_ELEMENTS: Record<string, { element: string; nature: string; desc: string }> = {
    "甲": { element: "木の陽", nature: "大樹・森林", desc: "大地にまっすぐ根を張り、天空を目指して誇り高く伸びる大樹。信念を曲げず、リーダーシップと正義感に溢れる性格です。" },
    "乙": { element: "木の陰", nature: "草花・蔦", desc: "可憐に咲き誇り、踏まれても立ち上がる柔軟な草花。協調性に富み、人を癒やしながらしなやかに生き抜く強さがあります。" },
    "丙": { element: "火の陽", nature: "太陽・光明", desc: "世界を公平に照らす暖かな太陽。情熱的で明るく、その場にいるだけで人々を元気づける陽気なカリスマです。" },
    "丁": { element: "火の陰", nature: "灯火・月光", desc: "静かに闇を照らす温かい灯火。繊細で思慮深く、内面に熱い信念と鋭い観察眼を秘めた情熱家です。" },
    "戊": { element: "土の陽", nature: "山岳・大地", desc: "どっしりとそびえ立つ雄大な山岳。包容力と落ち着きがあり、多くの人を引き寄せる安心感があります。" },
    "己": { element: "土の陰", nature: "田畑・肥沃な土", desc: "作物を育てる肥沃な田畑。多才で学習能力が高く、周囲を細やかにサポートし育成する能力に長けています。" },
    "庚": { element: "金の陽", nature: "剛鉄・刀剣", desc: "鍛錬によって切れ味を増す剛鉄や刀剣。決断力と行動力に優れ、困難を切り拓く突破力を持っています。" },
    "辛": { element: "金の陰", nature: "宝石・貴金属", desc: "磨かれるほどに気品ある輝きを放つ宝石。美意識とプライドが高く、繊細で独特のオーラを放ちます。" },
    "壬": { element: "水の陽", nature: "大河・大海", desc: "どこまでも広がる自由な大海原。スケールが大きく自由を愛し、知恵と臨機応変な柔軟性で世界を旅します。" },
    "癸": { element: "水の陰", nature: "雨露・清流", desc: "万物を静かに潤す恵みの雨露。純粋で奉仕の精神に富み、忍耐強く物事を成し遂げる清らかな心の持ち主です。" }
  };
  const stemInfo = STEM_ELEMENTS[dayStem] || STEM_ELEMENTS["甲"];

  const twelveFate = getTwelveFate(dayStem, pillars.day.charAt(1));
  const centerStar = getCenterStar(dayStem, pillars.month.charAt(1));

  const fpYearFlows = {
    lastYear: {
      year: 2025,
      label: "2025年(去年)",
      starOrStage: "流年：乙巳（偏官・沐浴の巡り）",
      theme: "環境の変化と行動力の年。試行錯誤を通じて新たな基盤が芽生えた時期",
      score: 72,
      work: "突発的な課題や新しい役割を任され、多忙を極めながらも実力を証明できた年。",
      romance: "ドラマチックな出会いや感情の揺れ動きを経験。お互いの本音を知る好機でした。",
      health: "首・肩の凝りや自律神経の乱れに注意が必要だった時期。睡眠の質が鍵でした。",
      family: "家族間での話し合いや役割分担の見直しが行われ、絆が再確認されました。",
      money: "自己投資や交際費での支出は多かったものの、将来への有益な種蒔きとなりました。",
      keyAdvice: "去年の挑戦で蒔いた種が、今年の大きな収穫の土台になっています。"
    },
    thisYear: {
      year: 2026,
      label: "2026年(今年)",
      starOrStage: "流年：丙午（正官・建禄の巡り）",
      theme: "社会的信用と成果の年。あなたの誠実な努力が公に認められる飛躍の時期",
      score: 92,
      work: "昇進、責任ある地位への抜擢、独立のチャンス。実力が正当に評価され大きな成果を結実します。",
      romance: "誠実で将来を見据えたパートナーシップが急速に進展。結婚への決断にも最適な年。",
      health: "エネルギーに満ち溢れますが、燃え尽き症候群に注意。定期的な休養日の確保を。",
      family: "家庭内が誇らしい喜びに満たされます。家族からの心強い応援を受けられます。",
      money: "本業での収入アップや正当な報酬の拡大。資産を安定的に増やす計画を立てると吉。",
      keyAdvice: "恐れずに責任を引き受けてください。今の決断が向こう10年の基盤を決定づけます。"
    },
    nextYear: {
      year: 2027,
      label: "2027年(来年)",
      starOrStage: "流年：丁未（偏印・冠帯の巡り）",
      theme: "知性と創造性の年。新しい学びやライフスタイルの刷新に適した発展期",
      score: 83,
      work: "独自のアイデアやクリエイティブな提案が大ヒット。新分野の研究や資格取得も大吉。",
      romance: "精神的な深いつながりを感じられる年。共通の趣味や学びを通じて愛が深まります。",
      health: "目の疲れやメンタルのケアを意識。自然と触れ合う旅行が最高の特効薬になります。",
      family: "家族旅行やライフスタイルの変化（住まいの模様替えなど）で心地よい運気を導入。",
      money: "知恵やスキルへの投資が将来大きなリターンを生みます。無駄な固定費の削減を。",
      keyAdvice: "これまでの常識にとらわれず、新しい発想をどんどん生活に取り入れてください。"
    }
  };

  const fourPillarsDetail: FourPillarsNatureDetail = {
    pillars,
    dayStem,
    dayStemElement: stemInfo.element,
    dayStemNature: stemInfo.nature,
    centerStar,
    twelveFate,
    personality: `あなたの魂の本質を示す日干は「${dayStem}（${stemInfo.nature}）」です。${stemInfo.desc}\nさらに中心星には「${centerStar}」、十二運星には「${twelveFate}」を宿しています。自分の芯をしっかり持ちながら、周囲との調和を大切にして着実に成功を掴み取る命式です。`,
    strengths: [
      `${stemInfo.nature}のような芯の強さと独立心`,
      `中心星「${centerStar}」がもたらす高い専門性と遂行力`,
      `十二運星「${twelveFate}」の持つ着実な前進力と人徳`,
      `どんな逆境でも自ら道を切り拓く強い生命力`
    ],
    weaknesses: [
      "他人に弱みを見せられず一人で抱え込みがち",
      "自分の信じた正しさに固執して頑固になる一面",
      "責任感が強すぎて限界を超えて頑張りすぎてしまう"
    ],
    cautions: "ストイックになりすぎず、たまには周囲に甘えたり任せたりする『抜け感』を持つことで、より大きな人望が集まります。",
    habits: "プレッシャーがかかると無意識に感情を押し殺し、論理だけで物事を解決しようとする傾向があります。",
    suitableJobs: [
      "専門職・スペシャリスト",
      "リーダー・マネジメント層",
      "企画・事業プロデュース",
      "クリエイティブ・開発・研究"
    ],
    suitableJobDetail: "裁量権が大きく、自分の信じる美学や専門性を発揮できる環境で無類の強さを発揮します。自立した働き方が成功への近道です。",
    communication: "誠実で信頼できる人柄が最大の魅力。言葉数は少なくても、行動で示す優しさが周囲から深く感謝されます。",
    goodAffinity: ["干合となる相手", "三合木局・金局の相手", "支合の相手"],
    affinityDetail: "あなたの不足している五行を補ってくれる相手や、同じ志を持って並走してくれる自立したパートナーと最高の関係を築けます。",
    yearFlows: fpYearFlows,
    lifeStages: generateFourPillarsLifeStages(y, m, d, currentAge, gender),
    explanation: `${name}さんの四柱推命は、日干「${dayStem}」を中心とした堂々たる命式です。\n中心星「${centerStar}」と十二運「${twelveFate}」が調和し、年を重ねるごとに魅力と実力が増していく大器晩成の気品を漂わせています。`
  };

  // ----------------------------------------------------
  // 3. 令翠学 (Reisui)
  // ----------------------------------------------------
  const reisuiInfo = getReisuiStar(y, m, d);
  const reisuiStar = reisuiInfo.star;
  const reisuiSub = reisuiInfo.subStar;
  const yinYang = reisuiInfo.yinYang;

  const rLastYearStage = getReisuiYearCycle(reisuiInfo.reiBranch, 2025);
  const rThisYearStage = getReisuiYearCycle(reisuiInfo.reiBranch, 2026);
  const rNextYearStage = getReisuiYearCycle(reisuiInfo.reiBranch, 2027);

  const getCycleFlowContent = (cycle: typeof REISUI_12_CYCLES[0]) => {
    switch (cycle.name) {
      case "開拓":
        return {
          work: "新しいプロジェクトの立ち上げ、起業・独立、新天地への転職に絶好の好機！蒔いた種が向こう10年の実りとなります。",
          romance: "新しい出会いや関係の進展が期待できる春の幕開け。過去を断ち切り、まっさらな心で愛を受け入れましょう。",
          health: "エネルギーが湧き上がり意欲満点。新しいスポーツや健康的な生活習慣をスタートさせるのに最適です。",
          family: "新しい生活環境への移行や模様替え吉。明るい希望を共有することで家族の結束が強まります。",
          money: "将来の可能性を広げるための前向きな自己投資が大吉。目先の損得より長期的な成長にお金を使いましょう。",
          advice: "過去のしがらみや前例にとらわれず、直感のままに新しい一歩を踏み出してください！"
        };
      case "生長":
        return {
          work: "蒔いた種が急速に芽を出し、成果が目に見えて現れ始める成長期。周囲からの協力も得て勢いが加速します。",
          romance: "深まる信頼関係の中で、具体的な将来の話（同棲・婚約など）がトントン拍子に進展します。",
          health: "フットワーク軽く活動できる好調期。ただし忙しさにかまけて無理を重ねないよう適度な休養を。",
          family: "家族でのレジャーや旅行で絆が深まる年。嬉しいニュースや祝賀行事に恵まれます。",
          money: "手応えのある収入増や新事業の立ち上がりに伴い、経済的な手応えを感じられる年です。",
          advice: "急激な成長を恐れず、自信を持ってチャンスの波に飛び乗ってください。"
        };
      case "精算":
        return {
          work: "冬の総決算。無理な事業拡大は避け、不採算な業務の見直しや身の回りの整理整頓に徹して吉。",
          romance: "曖昧な関係や我慢を強いられる関係に自然と結論が出る時。心のデトックスを最優先に。",
          health: "冷えや慢性疲労に注意が必要な年。無理をせず、温泉や質の高い睡眠で心身を休めてください。",
          family: "身内への感謝を伝え、家族の役割分担を再構築する好機。無理な衝突は避けて穏やかに。",
          money: "固定費の見直しや無駄な出費のカットなど、守りの金運を固めて次の春に備えましょう。",
          advice: "手放すことは失うことではありません。次の春に新しい幸福を掴むための大切な準備です。"
        };
      default:
        return {
          work: `${cycle.name}期のバイオリズムに寄り添い、状況に応じた柔軟な舵取りで着実な成果を築きましょう。`,
          romance: "自然体のコミュニケーションを心がけ、互いのリズムを尊重することで絆が深まります。",
          health: "季節の変わり目の体調変化に気を配り、規則正しい生活習慣を維持しましょう。",
          family: "家族との温かい対話を大切にすることで、家庭全体に安心感が広がります。",
          money: "収支のバランスを保ち、堅実な資産管理を心がけることで安定した運気を維持できます。",
          advice: `${cycle.name}期の持つ運命の波を信じ、無理のないペースで歩みを進めてください。`
        };
    }
  };

  const rLastContent = getCycleFlowContent(rLastYearStage);
  const rThisContent = getCycleFlowContent(rThisYearStage);
  const rNextContent = getCycleFlowContent(rNextYearStage);

  const reisuiYearFlows = {
    lastYear: {
      year: 2025,
      label: "2025年(去年)",
      starOrStage: `令翠学運命周期：${rLastYearStage.title}`,
      theme: rLastYearStage.theme,
      score: rLastYearStage.score,
      work: rLastContent.work,
      romance: rLastContent.romance,
      health: rLastContent.health,
      family: rLastContent.family,
      money: rLastContent.money,
      keyAdvice: rLastContent.advice
    },
    thisYear: {
      year: 2026,
      label: "2026年(今年)",
      starOrStage: `令翠学運命周期：${rThisYearStage.title}`,
      theme: rThisYearStage.theme,
      score: rThisYearStage.score,
      work: rThisContent.work,
      romance: rThisContent.romance,
      health: rThisContent.health,
      family: rThisContent.family,
      money: rThisContent.money,
      keyAdvice: rThisContent.advice
    },
    nextYear: {
      year: 2027,
      label: "2027年(来年)",
      starOrStage: `令翠学運命周期：${rNextYearStage.title}`,
      theme: rNextYearStage.theme,
      score: rNextYearStage.score,
      work: rNextContent.work,
      romance: rNextContent.romance,
      health: rNextContent.health,
      family: rNextContent.family,
      money: rNextContent.money,
      keyAdvice: rNextContent.advice
    }
  };

  // 令翠学12宿星マスタープロファイル（珀龍令翠・令翠学公式体系に準拠）
  const REISUI_STAR_PROFILES: Record<string, any> = {
    "月星": {
      personality: "「愛することを学び、慈愛ある心を持つことこそが人の生きる道である」という精神を宿す、博愛と調和の星です。他者の喜びや痛みに深く寄り添い、無償の愛と献身を注ぐ心のオアシスのような存在です。他人の相談には親身に的確な助言ができる一方、自分のことになると優柔不断になりやすい純粋な優しさを持っています。",
      strengths: [
        "他者の痛みに寄り添い包み込む深い慈愛と共感力",
        "見返りを求めず周囲を支える無償の献身性",
        "人の隠れた良さや才能を直感で見抜く慧眼",
        "どんな場にも温かな安心と調和をもたらす穏やかな人徳"
      ],
      weaknesses: [
        "頼まれごとを断れず自分を後回しにする自己犠牲",
        "他人の悩みやトラブルを背負いすぎて心身が疲弊する",
        "自分の進路や選択になると迷いやすく優柔不断になる"
      ],
      cautions: "『他者の人生』と『自分の人生』に健全な境界線を引きましょう。時には毅然と『NO』と断る勇気を持つことが、あなたの気品と運気を守る最大の鍵となります。",
      habits: "困っている人を見ると放っておけず、自分の予定や体調を犠牲にしてでも手を差し伸べてしまう思考パターンがあります。",
      suitableJobs: [
        "カウンセラー・心理職・セラピスト",
        "人事・キャリアアドバイザー・相談支援",
        "医療・看護・福祉・介護ケア",
        "教育・保育・子育て支援・指導員",
        "コミュニティ運営・NPO・ホスピタリティ事業"
      ],
      suitableJobDetail: "人と直接心を通わせ、誰かの支えや安心となる分野で無類の強さを発揮します。数字や効率だけを追う環境よりも、温かい信頼関係が循環する環境で大成します。",
      communication: "相手の話を遮らず最後まで温かく聴く天性の聞き上手です。自分の本音や悩みも、信頼できるパートナーに定期的に打ち明けて心を開放しましょう。",
      goodAffinity: ["土星", "天令星", "魚令星", "木星"],
      affinityDetail: "対照星である土星（天令星）はあなたの迷いをどっしりと支えて形にしてくれます。同じ月令星の魚令星とは以心伝心で理解し合えます。"
    },
    "魚令星": {
      personality: "人からものを頼まれると断れず、困っている人を放っておけない抜群の面倒見の良さを持つ情の深い星です。人情味に溢れ、誰に対しても親身に手を差し伸べる温かさを持っています。豊かな感受性と繊細な気配りで、周囲の人の心の機微を敏感に察知して癒やします。",
      strengths: [
        "困っている人を決して見捨てない抜群の面倒見の良さ",
        "人の心の機微を敏感に察知する繊細な気配りと優しさ",
        "誰からも愛される純粋で嘘のない温かい人柄",
        "情に厚く、一度結んだ絆を大切にし続ける誠実さ"
      ],
      weaknesses: [
        "お人好しすぎて都合よく利用されやすい",
        "相手の感情の波やトラブルに巻き込まれやすい",
        "情に流されて現実的な損得やルールを後回しにしがち"
      ],
      cautions: "相手の自立のためにも、時には手を出さずに温かく見守る距離感を保ちましょう。情と規律のバランスが運気を高めます。",
      habits: "頼まれるとキャパシティを超えていても『大丈夫』と引き受けてしまう癖があります。",
      suitableJobs: [
        "ソーシャルワーカー・相談員・福祉指導",
        "保育士・教育・学童支援",
        "カスタマーサクセス・コンシェルジュ",
        "クリエイティブ・イラスト・ハンドメイド",
        "アロマ・リラクゼーション・ヒーリング"
      ],
      suitableJobDetail: "人の役に立っている実感がダイレクトに得られる職種や、細やかな愛情・気配りを表現できるアットホームな職場で真価を発揮します。",
      communication: "理屈よりも心と心の触れ合いを重視します。感謝の気持ちを素直に伝え合うことで、深い絆を育みます。",
      goodAffinity: ["月星", "土星", "天令星"],
      affinityDetail: "月星とは深い魂の共鳴が起こり、土星からは現実的な安心感と守りを与えられます。"
    },
    "火星": {
      personality: "クールかつ知性的で、極めて忍耐強い芯の強さを持つ星です。物事を感情に流されず冷静に分析する緻密な思考能力を備え、一度引き受けた責任は何があっても最後までやり遂げる不屈の気概を持っています。一見控えめで静かに見えますが、内面には確固たる信念を秘めています。",
      strengths: [
        "感情に左右されないクールで客観的な大人の判断力",
        "物事の構造や本質を筋道立てて捉える緻密な分析力",
        "逆境や困難にも決して音を上げない不屈の忍耐力",
        "任された重責を完璧に全うする強い責任感と誠実さ"
      ],
      weaknesses: [
        "感情を表に出さないため近寄りがたく冷徹に見られがち",
        "慎重に考えすぎて即断即決のチャンスを逃すことがある",
        "人に頼ることが苦手で、一人で責任を抱え込んでしまう"
      ],
      cautions: "冷静沈着さは大きな武器ですが、時には素直な感情や笑顔を見せることで周囲との距離が縮まります。一人で抱え込まず仲間を信頼しましょう。",
      habits: "問題が起きた時、周囲に相談せず一人で黙々と背負い込んで解決しようとする傾向があります。",
      suitableJobs: [
        "経営企画・戦略コンサルタント・リサーチ",
        "法務・財務・会計・公認会計士・税理士",
        "研究開発・システムエンジニア・データサイエンティスト",
        "品質管理・プロジェクトマネージャー",
        "専門技術職・学術研究・アナリスト"
      ],
      suitableJobDetail: "緻密な論理的思考や高度な専門知識、長期的な忍耐力が求められる知的な分野で圧倒的な実績を築きます。",
      communication: "言葉数は控えめですが、発言の一つひとつに確固たる根拠と重みがあります。温かい一言を添えると信頼がさらに深まります。",
      goodAffinity: ["水星", "冥令星", "氷令星"],
      affinityDetail: "対照星の水星はあなたの知性に明るい突破力を吹き込み、同じ火令星の冥令星とは戦略面で抜群の補完関係を築けます。"
    },
    "冥令星": {
      personality: "内向性と外向性の二面性を持ち合わせ、状況や相手に応じて自らを自在に使い分けることができる知性派です。物事の本質を深く探求する集中力と、社交の場で見せるスマートな柔軟性を併せ持ちます。感情のコントロールに長け、複雑な利害関係の中でも冷静に立ち回る戦略家です。",
      strengths: [
        "相手や環境に合わせて柔軟に振る舞いを変えられる高度な適応力",
        "表面的な現象に惑わされず核心を見抜く鋭い洞察力",
        "興味を持った分野をどこまでも深掘りする驚異の集中力",
        "感情を巧みにコントロールして成果を導くセルフマネジメント力"
      ],
      weaknesses: [
        "本心が外から見えにくく秘密主義だと誤解されやすい",
        "感情を内に抑え込みすぎてストレスを一人で溜めがち",
        "一度心を閉ざすと頑固になり妥協を許さない一面がある"
      ],
      cautions: "すべてを一人で抱え込まず、心から信頼できる特定のパートナーには素の弱みや本音を分かち合う場を持ちましょう。",
      habits: "相手の本音を観察するあまり、自分の意見を後出しにして慎重になりすぎる傾向があります。",
      suitableJobs: [
        "リサーチ・市場調査・アナリスト",
        "戦略企画・渉外交渉・ブランド戦略",
        "編集者・ライター・コンテンツプロデューサー",
        "専門技術スペシャリスト・開発設計",
        "人事評価・カウンセリング・心理分析"
      ],
      suitableJobDetail: "多角的な視点や洞察力、専門的な深掘りが求められるポジションで唯一無二の価値を発揮します。",
      communication: "相手の懐にスッと入るスマートな会話術を持ちます。親しい相手には飾らない素顔を見せると深い絆が育まれます。",
      goodAffinity: ["火星", "水星", "木星"],
      affinityDetail: "火星の揺るぎない知性とタッグを組むことで、理論と実践が完璧に噛み合った強力な成果を生み出せます。"
    },
    "金星": {
      personality: "朝一番の新鮮な空気のようにフレッシュで若々しく、邪気のない爽やかな気質の持ち主です。流行や美に対する感度が抜群で、新しい世界や未知のカルチャーに恐れず飛び込んでいく天性の開拓力を持っています。人懐っこく明るいオーラで、周囲に新鮮な風を吹き込みます。",
      strengths: [
        "場を一瞬で明るくするフレッシュで爽やかな清潔感",
        "時代のトレンドや美の息吹を先取りする高感度なセンス",
        "未知の環境や新しい挑戦に軽やかに飛び込む行動力",
        "邪気がなく素直で、誰からも自然と可愛がられる愛され力"
      ],
      weaknesses: [
        "好奇心が旺盛すぎて目移りし、飽きっぽい一面がある",
        "思いつきや衝動で動き、最後までやり遂げる持続力に課題",
        "見栄を張ったり直感的な出費で浪費しやすい"
      ],
      cautions: "始めたことを形にするまで粘り強く続ける習慣を持ちましょう。あなたの爽やかな開拓力に『継続性』が加われば無敵です。",
      habits: "気分が乗っている時は超高速で動く反面、興味を失うと途端に後回しにしてしまう癖があります。",
      suitableJobs: [
        "広報・PR・ブランドマーケティング",
        "ファッション・アパレル・コスメ・デザイン",
        "イベントプロデューサー・エンタメ・メディア",
        "新規事業立ち上げ・トレンド発信・インフルエンサー",
        "ブライダル・スタイリスト・ライフスタイル提案"
      ],
      suitableJobDetail: "人と接し、楽しさや最新のトレンドを発信する華やかな舞台で天賦の才を最大限に発揮します。",
      communication: "快活で誰とでも即座に打ち解ける天才的な社交性を持ちます。人の話を腰を折らずに聞く姿勢を意識するとさらに人望が高まります。",
      goodAffinity: ["木星", "小令星", "土星"],
      affinityDetail: "対照星の木星はあなたの軽やかさに重厚な安定感を与え、長期的な成功を確固たるものにしてくれます。"
    },
    "小令星": {
      personality: "夜空に光り輝く星のように華やかで、表面はざっくばらんで陽気、花のような明るさで人を和ませる魅力の星です。温和で気さくな人柄で、殺伐とした空気も一瞬で和やかに変えてしまう天性のムードメーカーです。細やかな気配りと愛嬌で、多くのファンを引き寄せます。",
      strengths: [
        "周囲をパッと明るく照らす花のような華やかさと親しみやすさ",
        "気取らずざっくばらんに人と心を通わせる陽気な人徳",
        "場の緊張を自然にほぐす卓越したユーモアと気配り",
        "人を惹きつけて離さない天性のチャーミングな魅力"
      ],
      weaknesses: [
        "周囲の期待に応えようとして八方美人になり気疲れする",
        "シビアな決断や厳しい指摘を求められる場面で優柔不断になる",
        "褒め言葉やおだてに弱く、甘い誘いに流されやすい"
      ],
      cautions: "誰からも好かれようと無理をせず、自分の本音や『譲れない軸』を大切にしましょう。時には断ることもあなたを守る優しさです。",
      habits: "波風を立てないように、その場では相手に合わせて笑ってごまかしてしまう傾向があります。",
      suitableJobs: [
        "接客・サービス・ホスピタリティ統括",
        "司会・アナウンサー・タレント・MC",
        "セールス・顧客リレーション・サロン運営",
        "ウェディングプランナー・フラワーデザイナー",
        "フード・飲食・カフェプロデュース"
      ],
      suitableJobDetail: "笑顔と華やかさでお客様をもてなし、ファンやリピーターを増やしていく対人サービスやエンタメ分野で大活躍します。",
      communication: "上品で明るい物腰が周囲に深い安心感を与えます。重要な場面では真剣な眼差しと言葉を伝えることで大きな信頼を勝ち得ます。",
      goodAffinity: ["金星", "木星", "海令星"],
      affinityDetail: "金星とは互いの華やかさを引き立て合い、木星からは温かく守られる深い安心感を得られます。"
    },
    "土星": {
      personality: "向上心が極めて強くまっすぐな性分で、曲がったことを嫌い、神経細やかで繊細な清廉さを持つ星です。高い理想と誇りを胸に抱き、自らの信念をどこまでもまっすぐに貫きます。不正や妥協を許さない潔癖さと、自らを常に磨き続ける崇高な精神性を備えています。",
      strengths: [
        "常に自己を高め高みを目指し続ける強い向上心",
        "嘘やごまかしを一切許さない清廉潔白な正義感と倫理観",
        "細部まで行き届く繊細な配慮と誠実な責任感",
        "困難に屈せず掲げた目標をまっすぐに貫く誇り高い意志"
      ],
      weaknesses: [
        "潔癖すぎて他人の些細なミスや甘えを許せず衝突しやすい",
        "神経質になりすぎて自分自身を追い込んでしまいがち",
        "プライドが高く、自分の非を素直に認めるのに時間がかかる"
      ],
      cautions: "正論だけで人を裁かず、『清濁併せ呑む』大らかさを養いましょう。不完全な人間らしさを許容する心の広さが、あなたの器を何倍にも大きくします。",
      habits: "基準に満たない物事や不条理を見ると、我慢できずに厳しく指摘してしまう癖があります。",
      suitableJobs: [
        "経営リーダー・事業統括・取締役",
        "法曹・裁判官・弁護士・行政書士",
        "教育者・教授・人材育成の最高責任者",
        "品質監査・コンプライアンス統括・公務員",
        "伝統産業の継承者・格式ある組織のリーダー"
      ],
      suitableJobDetail: "規律と正義、格式が重んじられる分野や、組織全体の土台を正しく導くリーダーシップの場で真価を発揮します。",
      communication: "言葉に嘘がなく圧倒的な説得力があります。相手の努力や長所をまず認めてからアドバイスすることで、絶大な人望が集まります。",
      goodAffinity: ["月星", "天令星", "金星"],
      affinityDetail: "対照星の月星はお互いの人生の最良のパートナー。あなたの厳格さに月星の慈愛が加わることで、完全無欠の器が完成します。"
    },
    "天令星": {
      personality: "ガラスのように繊細で鋭敏な神経を持った、高い美意識と品格を漂わせる完璧主義者です。常識的で洗練された立ち居振る舞いを持ち、世俗の粗野なものを嫌う高潔な魂を持っています。物事の細やかな差異や美の本質を見極める卓越した審美眼を備えています。",
      strengths: [
        "誰をも惹きつける気品と洗練されたマナー・所作",
        "本物と偽物を瞬時に見分ける鋭敏な審美眼と直感力",
        "細部に至るまで一切の妥協を排する高い完璧主義",
        "常識と礼節を重んじる気高く誠実な生き方"
      ],
      weaknesses: [
        "精神的にデリケートで周囲の雑音やストレスに傷つきやすい",
        "理想が高すぎて人を寄せ付けず孤立しやすい",
        "プライドが邪魔して素直に弱音を吐くことができない"
      ],
      cautions: "心安らぐプライベート空間と静寂な時間を定期的に確保しましょう。繊細な感性を守るためのセルフケアが運気安定の秘訣です。",
      habits: "不調和や無礼な言動を感じると、無言で心を閉ざして相手をシャットアウトしてしまう傾向があります。",
      suitableJobs: [
        "デザイナー・建築家・美術工芸家",
        "VIP対応・秘書・国際儀礼・格式ある接遇",
        "文筆家・思想家・評論家・大学教授",
        "ハイブランド・美術商・キュレーター",
        "専門性の高い独立事業・コンサルティング"
      ],
      suitableJobDetail: "美意識や高い品格、正確無比なクオリティが求められる格式ある世界で、唯一無二の存在感を放ちます。",
      communication: "物静かですが洗練された言葉遣いが安心感を与えます。信頼できる人には冗談や弱音を見せることで、真の理解者が集まります。",
      goodAffinity: ["土星", "月星", "魚令星"],
      affinityDetail: "月星の深い優しさはあなたの孤高の心を優しく癒やし、土星の信念はあなたの繊細さを力強く守ってくれます。"
    },
    "木星": {
      personality: "自分が心から納得しないと行動に移せない用意周到な慎重派で、スタートで人より後れを取ることがあっても、確実に大きな成果を残す大器晩成の星です。誠実で実直、地道な準備を怠らず、一度決めた目標には脇目も振らずに向き合い、ゆるぎない信頼を築き上げます。",
      strengths: [
        "綿密な準備と計画に基づくミスのない遂行力",
        "一度納得したら困難にも屈せずやり抜く堅実な意志",
        "誰からも裏切られない誠実さと揺るぎない社会的信用",
        "時間をかけて確実な大輪を咲かせる大器晩成の力"
      ],
      weaknesses: [
        "納得するまでに時間がかかり好機を逃しやすい慎重さ",
        "突発的なトラブルや急な方針転換への対応が苦手",
        "頑固で一度決めたやり方にこだわり融通が利かない"
      ],
      cautions: "時には『準備が8割でもまず動き出す』スピード感を意識しましょう。走りながら軌道修正することで、チャンスの波に乗ることができます。",
      habits: "不安を解消するために準備を重ね、スタートラインに立つまでに時間をかけすぎてしまう癖があります。",
      suitableJobs: [
        "公務員・司法書士・法務行政",
        "金融・信託・堅実な資産運用・リスク管理",
        "研究・製造技術・インフラ・建築土木",
        "農業・林業・環境保全・長期事業",
        "医療・教育・伝統技術の継承"
      ],
      suitableJobDetail: "長年の信用と地道な実績がものを言う分野や、確実なルールと高い倫理性が求められる環境で大成します。",
      communication: "飾らない実直な言葉が相手に強い安心感を与えます。素直な想いを言葉にして伝えることで、生涯の信頼関係が築かれます。",
      goodAffinity: ["金星", "海令星", "月星"],
      affinityDetail: "対照星の金星はあなたの堅苦しさを和らげて活気をもたらし、同じ木令星の海令星とは堅実な同志として深く信頼し合えます。"
    },
    "海令星": {
      personality: "地道にコツコツと努力を重ねるタイプで、ルールや秩序を重んじる規律正しい星です。時に融通性を欠く傾向もありますが、自分が興味を持った対象や専門分野には寝食を忘れて深く没頭する驚異の探求心を持っています。目立たずとも陰で組織を支える真の立役者です。",
      strengths: [
        "どんな地味な作業も飽きずに続けられる驚異の継続力",
        "決められたルールや約束を忠実に守る誠実な秩序感",
        "関心のある専門分野を極限まで深掘りする没頭力",
        "裏表がなく、組織の土台を静かに支える高い信頼性"
      ],
      weaknesses: [
        "マニュアルや前例に縛られ臨機応変な対応が苦手",
        "視野が自分の専門分野だけに狭まりやすい",
        "想定外の変化に直面すると強いストレスを感じる"
      ],
      cautions: "ルールを守るだけでなく『何のためのルールか』という本質的な目的意識を持ちましょう。柔軟な遊び心を持つことで世界が大きく広がります。",
      habits: "前例がないことに対して強い抵抗を感じ、まずは現状維持を選ぼうとする傾向があります。",
      suitableJobs: [
        "研究員・学術研究・専門データアナリスト",
        "ITアーキテクト・品質保証エンジニア・デバッガー",
        "公務員・コンプライアンス管理・文書統括",
        "職人・精密機械・技術スペシャリスト",
        "アーカイブ・司書・学芸員・記録管理"
      ],
      suitableJobDetail: "高度な専門知識の深掘りや、厳格なルール遵守が求められる正確無比な職場で唯一無二の信頼を獲得します。",
      communication: "誠実で落ち着いた対話が得意です。時には自分の専門分野の面白さを楽しそうに語ることで、周囲を惹きつけます。",
      goodAffinity: ["木星", "金星", "小令星"],
      affinityDetail: "木星の信念があなたの探求をどっしりと支え、金星の機転があなたに新しい風と広い視野を吹き込みます。"
    },
    "水星": {
      personality: "いつも明るくパワフルで、常に現実を見つめ、前を向いて力強く進んでいく行動派の星です。多少の失敗や挫折にも決してめげず、持ち前のバイタリティと現実感覚で道を切り拓いていきます。空想に逃げず地に足をつけ、結果にこだわるたくましい前進力を持っています。",
      strengths: [
        "どんな困難も吹き飛ばす明るさとパワフルな生命力",
        "現実を正確に見極めて具体的な行動に落とし込む実行力",
        "失敗を恐れず果敢に挑戦し、即座に立ち直るタフな精神力",
        "周囲をグイグイ巻き込んで前進させる力強い牽引力"
      ],
      weaknesses: [
        "せっかちで他人のゆっくりしたペースに苛立ちやすい",
        "現実主義すぎて情緒やロマンに欠けると見られることがある",
        "勢い余って周囲の感情や体調のケアを置き去りにしがち"
      ],
      cautions: "周囲の歩調にも温かい配慮を配りましょう。あなたのパワフルさに『仲間への思いやり』が加わることで、誰もがついてくる偉大なリーダーとなります。",
      habits: "結論をすぐに求めたがり、プロセスよりも結果を優先して突っ走ってしまう癖があります。",
      suitableJobs: [
        "起業家・事業立ち上げ・統括リーダー",
        "営業統括・ビジネスディベロップメント・ディレクター",
        "スポーツ・フィットネス・アウトドアビジネス",
        "商社・流通・物流・スピード重視の実業",
        "プロデューサー・現場監督・推進リーダー"
      ],
      suitableJobDetail: "裁量権が大きく、スピード感と具体的な成果がダイレクトに求められるダイナミックな環境で最大のエネルギーを爆発させます。",
      communication: "明るくストレートで分かりやすいコミュニケーションが得意です。相手への感謝や労いの言葉を意識的に増やすと強力な味方が育ちます。",
      goodAffinity: ["火星", "氷令星", "月星"],
      affinityDetail: "対照星の火星の知性とあなたの行動力が合わさることで、理論と実践が完璧に調和した大きな成果を収められます。"
    },
    "氷令星": {
      personality: "エレガントでかつソフトなイメージを兼ね備え、物腰柔らかく人を惹きつける穏やかな魅力を持つ星です。フワフワとした優しさと温和な佇まいで、出会う人に深い安心感と癒やしを与えます。争いごとを好まない平和主義で、自然と人が集まってくる柔和な人徳を備えています。",
      strengths: [
        "誰をもホッと安心させるエレガントでソフトな気品",
        "物腰柔らかく自然と人が寄ってくる穏やかな人徳と魅力",
        "対立を避け、場に和やかな調和をもたらす天性の調停力",
        "相手の気持ちを優しく受け止める柔らかな受容力"
      ],
      weaknesses: [
        "流されやすく他人の強い意見にノーと言えない",
        "芯の強さを表に出さないため優柔不断に見られやすい",
        "自分の希望や主張を後回しにして我慢を重ねてしまう"
      ],
      cautions: "あなたの中にある静かな信念をもっと信じましょう。必要な場面では凛とした姿勢で自分の意思を表明することが、あなたの魅力をさらに輝かせます。",
      habits: "相手に気を遣うあまり、自分の本音を胸の奥にしまい込んで笑顔で流してしまう傾向があります。",
      suitableJobs: [
        "接客・コンシェルジュ・広報・サロン経営",
        "アロマ・リラクゼーション・エステ・美容",
        "カウンセラー・福祉・相談援助・調停役",
        "文化・アート・フラワー・インテリアコーディネート",
        "ホスピタリティ・観光・ブライダル"
      ],
      suitableJobDetail: "美意識や優しさ、きめ細やかなホスピタリティが活かされる落ち着いた環境で、多くの人々に愛される存在となります。",
      communication: "物腰が柔らかく、相手を包み込むような優しい会話が得意です。時には自分の希望も素直に言葉にすることで、より対等で深い信頼関係が築かれます。",
      goodAffinity: ["水星", "火星", "冥令星"],
      affinityDetail: "同じ水令星の水星とは深い波長の一致があり、火星の冷静な守りによってあなたの優しさが安心して発揮されます。"
    }
  };

  const reisuiProfile = REISUI_STAR_PROFILES[reisuiStar] || REISUI_STAR_PROFILES["月星"];

  const reisuiDetail: ReisuiNatureDetail = {
    star: reisuiStar,
    subStar: reisuiSub,
    reiStar: reisuiInfo.reiStar,
    oppositeStar: reisuiInfo.oppositeStar,
    yinYang,
    personality: `あなたの令翠学における宿星は「${reisuiStar}（${yinYang}）」、本質を司る六令星は「${reisuiInfo.reiStar}」、対を成す宿星は「${reisuiSub}」、対照星は「${reisuiInfo.oppositeStar}」です。\n${reisuiProfile.personality}`,
    strengths: reisuiProfile.strengths,
    weaknesses: reisuiProfile.weaknesses,
    cautions: reisuiProfile.cautions,
    habits: reisuiProfile.habits,
    suitableJobs: reisuiProfile.suitableJobs,
    suitableJobDetail: reisuiProfile.suitableJobDetail,
    communication: reisuiProfile.communication,
    goodAffinity: reisuiProfile.goodAffinity,
    affinityDetail: reisuiProfile.affinityDetail,
    yearFlows: reisuiYearFlows,
    lifeStages: generateReisuiLifeStages(currentAge, reisuiStar),
    explanation: `${name}さんの令翠学における宿星は「${reisuiStar}（六令星：${reisuiInfo.reiStar}）」です。\n2025年の冬の【精算期】を経て、2026年（今年）は運命周期の新たな春の幕開けである【開拓期】を迎えています。\nこの人生の四季がもたらす大いなる追い風に乗り、新しい一歩を踏み出すことで実りを引き寄せることができます。`
  };

  // ----------------------------------------------------
  // 4. 総合 (Overall) - 3占術の共通点を強調した統合鑑定
  // ----------------------------------------------------
  const overallYearFlows = {
    lastYear: {
      year: 2025,
      label: "2025年(去年)",
      starOrStage: "3占術統合：【内省と土台づくりの年】",
      theme: "水面下で着実に力を蓄え、試行錯誤を通じて次のステージへの基礎を固めた時期",
      score: 75,
      work: "九星気学、四柱推命、令翠学のいずれも、無理な拡張よりも『基礎固めと根回し』の重要性を示していました。ここで蓄えた実力が今生きています。",
      romance: "本音で向き合うための試練や絆の深まりを経験。表面的な付き合いから真実の関係へと昇華しました。",
      health: "冷えや慢性疲労のケアが課題だった年。心身の休息を学ぶ良い機会となりました。",
      family: "家族への感謝と役割の再確認。身近な人との結束が強まりました。",
      money: "知恵や将来への投資が中心となった年。無駄遣いを戒め土台を整えました。",
      keyAdvice: "去年の努力は1ミリも無駄になっていません。すべては今年の飛躍のための必然でした。"
    },
    thisYear: {
      year: 2026,
      label: "2026年(今年)",
      starOrStage: "3占術統合：【確信と社会的飛躍の大吉年】",
      theme: "すべての占術の追い風が重なる勝負年！自信を持って前進し大願を成就する時",
      score: 93,
      work: "四柱推命の流年・九星気学の年盤・令翠学のバイオリズムが完全に一致して『実りのピーク』を示しています。リーダーシップを発揮し大きな成果を掴み取ってください。",
      romance: "一生涯のパートナーとの出逢いや、結婚・婚約への決断に最高の年。温かく揺るぎない愛に包まれます。",
      health: "活力に満ち溢れますが、過信は禁物。良質な食事と睡眠を確保してエネルギーをチャージして。",
      family: "家族全体に喜ばしい祝賀ムードが漂います。あなたの活躍が家族の誇りとなります。",
      money: "収入の増加や正当な評価による経済的充実。長期的な資産運用の基盤を整える絶好機。",
      keyAdvice: "迷う必要は一切ありません。直感を信じ、堂々と主役として人生の舞台に立ってください！"
    },
    nextYear: {
      year: 2027,
      label: "2027年(来年)",
      starOrStage: "3占術統合：【発展と新境地開拓の年】",
      theme: "今年掴んだ成果を基盤に、より広い世界へと視野を広げていく展開期",
      score: 86,
      work: "知性と創造性がさらに冴え渡り、次なる新事業や新テーマへのステップアップが進みます。",
      romance: "互いを尊重し高め合える大人の愛へと成熟。共通の夢に向かって歩みを進めます。",
      health: "精神的なリフレッシュと知的好奇心を満たす旅が最高の健康法になります。",
      family: "住環境の改善や新しいライフスタイルの導入で、家庭の居心地が一段と向上。",
      money: "着実な利益の確保と、未来の可能性への前向きな投資が実を結びます。",
      keyAdvice: "今年築いた土台の上で、より軽やかに、あなたらしい自由な夢を描いてください。"
    }
  };

  const overallDetail: OverallNatureDetail = {
    title: `${name}さんの本質統合鑑定書（四柱推命・九星気学・令翠学の共通核心）`,
    coreStrengths: [
      `【直感と洞察の深さ】九星（${honmeiStar}）の知性と、四柱推命（${dayStem}）の精神性が一致して示す『物事の本質を瞬時に見抜く卓越した洞察力』`,
      `【不動の芯と継続力】どんな困難や環境の変化に遭っても、自らの信念を曲げずにやり遂げる強靭な意志の強さ`,
      `【天性の徳と人望】言葉で飾るのではなく、誠実な行動と自然な気配りによって周囲から絶大な信頼を寄せられる人間力`,
      `【時代を読む先見性】令翠学（${reisuiStar}）の感性がもたらす、既存の枠にとらわれない独自の視点と創造性`
    ],
    commonPitfalls: [
      `【抱え込みすぎる癖】すべての占術が一致して警告しているのは『責任感が強すぎて、限界まで一人で重圧を抱え込んでしまうこと』です。`,
      `【完璧主義による自己批判】理想が高すぎるあまり、80%できている自分を褒めず、足りない20%を責めてしまう思考癖があります。`,
      `【本音のシャットアウト】傷つくことを恐れて、本当に苦しい時に無口になり、周囲との心のシャッターを下ろしてしまう傾向があります。`
    ],
    lifeTheme: "『自らの信念を貫きながら、温かな愛と知恵で周囲を照らす人生の航海者』",
    synthesisAdvice: `プロの鑑定士として、${name}さんの命式・星回りを深く読み解いて強く感じるのは、**『生まれ持った器の大きさと、内に秘めた純度の高い情熱』**です。\n\n四柱推命が示す「${stemInfo.nature}」の如き芯の強さ、九星気学が示す「${honmeiStar}」の知性、そして令翠学が示す「${reisuiStar}」の唯一無二の感性。\nこれら3つの占術が口を揃えて告げている共通の真実は、**『あなたには、自分の手で運命を切り拓き、人を導いていく確固たる力がすでに備わっている』**ということです。\n\n過去のあなたは、周囲に理解されない孤独や、理想と現実の狭間での葛藤を経験されたかもしれません。しかし、それらの試練はすべて、あなたの魂を磨き、誰よりも人の痛みがわかる優しい強さを培うための必然の通過儀礼でした。\n\n2026年という今年は、これまでの忍耐と努力が一気に報われる、人生でも指折りの大飛躍の年盤を迎えています。自分の直感と才能を疑わず、胸を張って歩みを進めてください。あなたの前には、想像以上に明るく豊かな未来が広がっています。`,
    yearFlows: overallYearFlows,
    lifeStages: generateOverallLifeStages(currentAge)
  };

  // バイオリズムオフセット（令翠学の12運命周期と連動）
  const reisuiOffset = (12 - ((reisuiInfo.reiBranch + 6) % 12)) % 12;
  const cycleOffset = {
    reisui: reisuiOffset,
    four: (seedBase + 5) % 12,
    nine: (seedBase + 9) % 12
  };

  // 100年分のバイオリズムデータ
  const hundredYears: PeriodData[] = Array.from({ length: 100 }).map((_, i) => {
    const targetYear = y + i;
    const age = i;
    const yearSeed = seedBase + targetYear;
    
    const yearData = generatePeriodData(yearSeed, `${targetYear}年`, targetYear, age, cycleOffset, false, reisuiInfo.reiBranch);
    yearData.months = Array.from({ length: 12 }).map((_, monthIndex) => {
      const targetMonth = monthIndex + 1;
      const monthSeed = yearSeed + targetMonth * 100;
      const monthOffset = {
        reisui: (cycleOffset.reisui + monthIndex) % 12,
        four: (cycleOffset.four + monthIndex) % 12,
        nine: (cycleOffset.nine + monthIndex) % 12
      };
      return generatePeriodData(monthSeed, `${targetMonth}月`, targetMonth, age, monthOffset, true, reisuiInfo.reiBranch);
    });
    return yearData;
  });

  // ----------------------------------------------------
  // 占術別ターニングポイント（婚期・仕事運のベスト年）の個別算出
  // ----------------------------------------------------
  const futureYears = hundredYears.filter(yData => yData.periodValue >= currentYear && yData.periodValue <= currentYear + 30);

  // 1. 総合 (Overall): 3占術の統合バイオリズムに基づくピーク年
  let bestMarriageOverall = futureYears[0];
  let bestWorkOverall = futureYears[0];
  for (const yData of futureYears) {
    if (yData.marriage.value > bestMarriageOverall.marriage.value) bestMarriageOverall = yData;
    if (yData.work.value > bestWorkOverall.work.value) bestWorkOverall = yData;
  }

  // 2. 令翠学 (Reisui):
  // 婚期: 12運命周期の「人気」（人望・良縁・願望達成）または「充実」（大成）
  // 仕事: 12運命周期の「充実」（12年の最高峰・完成）または「経済」（収穫）
  const reisuiMarriageCand = futureYears.filter(y => y.stageReisui.name === "人気" || y.stageReisui.name === "充実");
  const reisuiMarriageYear = reisuiMarriageCand.length > 0 ? reisuiMarriageCand[0] : bestMarriageOverall;

  const reisuiWorkCand = futureYears.filter(y => y.stageReisui.name === "充実" || y.stageReisui.name === "経済");
  const reisuiWorkYear = reisuiWorkCand.length > 0 ? reisuiWorkCand[0] : bestWorkOverall;

  // 3. 九星気学 (Nine Star Ki):
  // 婚期: 本命星が「巽宮（南東・福徳期＝結婚・良縁結実の絶頂）」回座年（次点: 兌宮）
  // 仕事: 本命星が「乾宮（北西・秋の収穫期＝社会的成果・独立・昇進）」回座年（次点: 離宮）
  const nineStarYearsWithGyu = futureYears.map(yData => {
    const centerStarNum = ((1 - (yData.periodValue - 2026)) % 9 + 9) % 9 || 9;
    const gyuData = getYearGyu(honmeiStar, centerStarNum);
    return { yData, gyuData };
  });

  const sonCand = nineStarYearsWithGyu.find(item => item.gyuData.gyuName.includes("巽宮"));
  const daCand = nineStarYearsWithGyu.find(item => item.gyuData.gyuName.includes("兌宮"));
  const nineStarMarriageItem = sonCand || daCand || nineStarYearsWithGyu[0];
  const nineStarMarriageYear = nineStarMarriageItem.yData;
  const nineStarMarriageGyu = nineStarMarriageItem.gyuData;

  const kenCand = nineStarYearsWithGyu.find(item => item.gyuData.gyuName.includes("乾宮"));
  const riCand = nineStarYearsWithGyu.find(item => item.gyuData.gyuName.includes("離宮"));
  const nineStarWorkItem = kenCand || riCand || nineStarYearsWithGyu[0];
  const nineStarWorkYear = nineStarWorkItem.yData;
  const nineStarWorkGyu = nineStarWorkItem.gyuData;

  // 4. 四柱推命 (Four Pillars):
  // 流年バイオリズム stageFourPillars による判定
  // 婚期: stageFourPillars が「充実」「人気」「決定」期の中で結婚スコアが最高の年
  const fpMarriageCand = futureYears.filter(y => y.stageFourPillars.name === "充実" || y.stageFourPillars.name === "人気" || y.stageFourPillars.name === "決定");
  let fpMarriageYear = fpMarriageCand[0] || futureYears[0];
  for (const cand of fpMarriageCand) {
    if (cand.marriage.value > fpMarriageYear.marriage.value) {
      fpMarriageYear = cand;
    }
  }

  // 仕事: stageFourPillars が「充実」または「経済」でスコアが最大の年
  const fpWorkCand = futureYears.filter(y => y.stageFourPillars.name === "充実" || y.stageFourPillars.name === "経済");
  let fpWorkYear = fpWorkCand[0] || futureYears[0];
  for (const cand of fpWorkCand) {
    if (cand.stageFourPillars.score > fpWorkYear.stageFourPillars.score) {
      fpWorkYear = cand;
    }
  }

  const nextMonthNum = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  return {
    nature: {
      overall: overallDetail,
      fourPillars: fourPillarsDetail,
      nineStar: nineStarDetail,
      reisui: reisuiDetail
    },
    fortuneExplanations: {
      overall: {
        thisMonth: {
          period: `${currentYear}年${currentMonth}月`,
          description: "今月は「準備と充実」の月です。内面を整え、周囲との信頼関係を温めることで、大きなチャンスが舞い込みます。"
        },
        nextMonth: {
          period: `${nextMonthYear}年${nextMonthNum}月`,
          description: "来月は運気が急上昇し、「行動と発展」の月となります。温めていたアイデアを実行に移すのに最適なタイミングです。"
        },
        thisYear: {
          period: `${currentYear}年`,
          description: overallYearFlows.thisYear.theme
        },
        nextYear: {
          period: `${currentYear + 1}年`,
          description: overallYearFlows.nextYear.theme
        }
      },
      fourPillars: {
        thisMonth: {
          period: `${currentYear}年${currentMonth}月`,
          description: "月干支の巡りにより、直感力と仕事運が高まります。誠実な対話が吉運を引き寄せます。"
        },
        nextMonth: {
          period: `${nextMonthYear}年${nextMonthNum}月`,
          description: "社会的信用がさらに高まる巡りです。リーダーシップを発揮して前進してください。"
        },
        thisYear: {
          period: `${currentYear}年`,
          description: fpYearFlows.thisYear.theme
        },
        nextYear: {
          period: `${currentYear + 1}年`,
          description: fpYearFlows.nextYear.theme
        }
      },
      nineStar: {
        thisMonth: {
          period: `${currentYear}年${currentMonth}月`,
          description: `今月は「${getsumeiStar}」の気が巡り、社交運とコミュニケーション運が良好です。`
        },
        nextMonth: {
          period: `${nextMonthYear}年${nextMonthNum}月`,
          description: "宮の回座が切り替わり、新しい出会いと知的な刺激に恵まれます。"
        },
        thisYear: {
          period: `${currentYear}年`,
          description: nineStarYearFlows.thisYear.theme
        },
        nextYear: {
          period: `${currentYear + 1}年`,
          description: nineStarYearFlows.nextYear.theme
        }
      },
      reisui: {
        thisMonth: {
          period: `${currentYear}年${currentMonth}月`,
          description: "月周期バイオリズムの追い風を受け、創造性が豊かに発揮される時期です。"
        },
        nextMonth: {
          period: `${nextMonthYear}年${nextMonthNum}月`,
          description: "計画を行動に移す好機。直感に従って動くことで良い結果に結びつきます。"
        },
        thisYear: {
          period: `${currentYear}年`,
          description: reisuiYearFlows.thisYear.theme
        },
        nextYear: {
          period: `${currentYear + 1}年`,
          description: reisuiYearFlows.nextYear.theme
        }
      }
    },
    flows: {
      hundredYears
    },
    turningPoints: {
      overall: {
        marriage: { 
          year: bestMarriageOverall.period, 
          description: `${bestMarriageOverall.period}（${bestMarriageOverall.age}才）は、四柱推命・九星気学・令翠学の3占術すべての吉運が調和する、総合的な婚期・パートナー運の最高潮の年です。` 
        },
        work: { 
          year: bestWorkOverall.period, 
          description: `${bestWorkOverall.period}（${bestWorkOverall.age}才）は、3占術のバイオリズムが共に上昇気流を描く、キャリアと人生の大きな飛躍の年となります。` 
        }
      },
      fourPillars: {
        marriage: { 
          year: fpMarriageYear.period, 
          description: `四柱推命の流年バイオリズムにおいて「${fpMarriageYear.stageFourPillars.name}」を迎える${fpMarriageYear.period}（${fpMarriageYear.age}才）は、良縁と家庭の結実が約束される黄金期です。` 
        },
        work: { 
          year: fpWorkYear.period, 
          description: `四柱推命の巡りにおいて「${fpWorkYear.stageFourPillars.name}」を迎える${fpWorkYear.period}（${fpWorkYear.age}才）は、持ち前の才能が公に認められ、社会的地位と名誉を手にする大勝負の年です。` 
        }
      },
      nineStar: {
        marriage: { 
          year: nineStarMarriageYear.period, 
          description: `九星の年盤において、本命星（${honmeiStar}）が「${nineStarMarriageGyu.gyuName}」に回座する${nineStarMarriageYear.period}（${nineStarMarriageYear.age}才）は、ご縁と信頼の結実・結婚に12年で最大の好機となる大吉年です。` 
        },
        work: { 
          year: nineStarWorkYear.period, 
          description: `九星の年盤において「${nineStarWorkGyu.gyuName}」に回座する${nineStarWorkYear.period}（${nineStarWorkYear.age}才）は、強力な天の加護と指導力が宿り、社会的成果と大願成就を果たすキャリアの絶頂期です。` 
        }
      },
      reisui: {
        marriage: { 
          year: reisuiMarriageYear.period, 
          description: `令翠学12運命周期の「${reisuiMarriageYear.stageReisui.name}」期を迎える${reisuiMarriageYear.period}（${reisuiMarriageYear.age}才）は、人望と人気が最高潮に達し、生涯の絆を結ぶ結婚・パートナーシップの絶好のタイミングです。` 
        },
        work: { 
          year: reisuiWorkYear.period, 
          description: `令翠学12周期の頂点である「${reisuiWorkYear.stageReisui.name}」期を迎える${reisuiWorkYear.period}（${reisuiWorkYear.age}才）は、長年の努力が大きな実績と評価となって結実し、人生最大の収穫を果たす黄金期です。` 
        }
      }
    }
  };
}

// 補助関数：疑似乱数とスコア生成
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateScore(seed: number, category: '恋愛' | '仕事' | '家庭' | '婚期' | '健康', age: number, baseScore: number): Score {
  let value = baseScore + Math.floor(pseudoRandom(seed) * 20 - 10);
  if (value > 100) value = 100;
  if (value < 0) value = 0;

  if (category === '仕事') {
    if (age < 18) value = Math.floor(value * 0.1);
    else if (age >= 18 && age < 22) value = Math.floor(value * 0.5);
    else if (age > 65) value = Math.floor(value * 0.6);
  }
  
  if (category === '婚期') {
    if (age < 16) value = 0;
    else if (age >= 16 && age < 20) value = Math.floor(value * 0.3);
    else if (age >= 20 && age <= 35) value = Math.min(100, value + 20);
    else if (age > 50) value = Math.floor(value * 0.4);
  }

  if (category === '恋愛') {
    if (age < 12) value = Math.floor(value * 0.1);
  }

  let detail = "";
  let caution = "";
  let recommendation = "";

  if (value >= 80) {
    detail = `${category}において最高の運気が巡ってきています。これまでの努力が大きく実を結び、素晴らしい展開が期待できるでしょう。`;
    caution = `順調な時こそ、周囲への感謝や謙虚な姿勢を忘れないようにしましょう。油断は禁物です。`;
    recommendation = `迷わず積極的に行動を起こしてください。新しいことへの挑戦や、大きな決断に最適なタイミングです。`;
  } else if (value >= 50) {
    detail = `穏やかで安定した${category}の運気です。大きなトラブルもなく、自分のペースで物事を進められる時期です。`;
    caution = `現状維持に甘んじてしまうとチャンスを逃す可能性があります。小さな変化を見落とさないように。`;
    recommendation = `基礎固めや、身の回りの整理整頓に力を入れると良いでしょう。地道な努力が後に活きてきます。`;
  } else if (value >= 30) {
    detail = `少し停滞気味の${category}運です。思い通りに進まないことがあり、もどかしさを感じるかもしれません。`;
    caution = `焦って無理な行動を起こすと空回りしやすくなります。感情的にならないよう注意が必要です。`;
    recommendation = `今は準備期間と捉え、情報収集やスキルアップ、内面を磨くことに時間を使うのがおすすめです。`;
  } else {
    detail = `${category}に関して注意が必要な時期です。予期せぬ試練や見直すべき課題が浮き彫りになる可能性があります。`;
    caution = `大きな決断や新しいスタートは控えた方が無難です。対人関係での衝突にも十分注意してください。`;
    recommendation = `無理をせず、心身の休息を最優先に。信頼できる人に相談し、一人で抱え込まないことが大切です。`;
  }

  return { value, detail, caution, recommendation };
}

function generatePeriodData(
  seedBase: number, 
  periodLabel: string, 
  periodValue: number, 
  age: number, 
  offset: {reisui: number, four: number, nine: number}, 
  isMonth: boolean = false,
  reiBranch?: number
): PeriodData {
  let stageReisui: BiorhythmStage;
  if (typeof reiBranch === 'number') {
    const rStage = isMonth 
      ? getReisuiMonthCycle(reiBranch, periodValue)
      : getReisuiYearCycle(reiBranch, periodValue);
    stageReisui = {
      name: rStage.name,
      score: rStage.score,
      description: rStage.description,
      isPeak: rStage.isPeak,
      isValley: rStage.isValley,
      season: rStage.season,
      seasonLabel: rStage.seasonLabel,
      seasonTheme: rStage.seasonTheme,
      keywords: rStage.keywords,
      fuyuShitaku: rStage.fuyuShitaku
    };
  } else {
    stageReisui = BIORHYTHM_CYCLE[(offset.reisui + periodValue) % 12];
  }

  const stageFourPillars = BIORHYTHM_CYCLE[(offset.four + periodValue) % 12];
  const stageNineStar = BIORHYTHM_CYCLE[(offset.nine + periodValue) % 12];
  
  const avgScore = Math.round((stageReisui.score + stageFourPillars.score + stageNineStar.score) / 3);
  let stageOverall = BIORHYTHM_CYCLE[0];
  let minDiff = 999;
  for (const s of BIORHYTHM_CYCLE) {
    const diff = Math.abs(s.score - avgScore);
    if (diff < minDiff) {
      minDiff = diff;
      stageOverall = s;
    }
  }
  
  const baseScore = stageOverall.score;

  return {
    period: periodLabel,
    periodValue,
    age,
    stage: stageOverall,
    stageReisui,
    stageFourPillars,
    stageNineStar,
    romance: generateScore(seedBase + 1, "恋愛", age, baseScore),
    work: generateScore(seedBase + 2, "仕事", age, baseScore),
    family: generateScore(seedBase + 3, "家庭", age, baseScore),
    marriage: generateScore(seedBase + 4, "婚期", age, baseScore),
    health: generateScore(seedBase + 5, "健康", age, baseScore),
  };
}

// ----------------------------------------------------
// 相性診断計算関数（二人の相性）
// ----------------------------------------------------
export function calculateCompatibility(
  birthdate1: string, name1: string,
  birthdate2: string, name2: string
): CompatibilityResult {
  const [y1, m1, d1] = birthdate1.split('-').map(Number);
  const [y2, m2, d2] = birthdate2.split('-').map(Number);
  
  const seed1 = y1 + m1 + d1 + name1.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seed2 = y2 + m2 + d2 + name2.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const combinedSeed = seed1 + seed2;

  const pillar1 = getPillar(y1, m1, d1);
  const pillar2 = getPillar(y2, m2, d2);
  const star1 = getHonmeiStar(y1, m1, d1);
  const star2 = getHonmeiStar(y2, m2, d2);
  const reisuiStar1 = getReisuiStar(y1, m1, d1).star;
  const reisuiStar2 = getReisuiStar(y2, m2, d2).star;

  // 四柱推命相性
  const dayStem1 = pillar1.day.charAt(0);
  const dayStem2 = pillar2.day.charAt(0);
  const stemPairs: Record<string, string> = {
    '甲': '己', '己': '甲',
    '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙',
    '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
  };
  const isKango = stemPairs[dayStem1] === dayStem2;
  const isSameStem = dayStem1 === dayStem2;

  let fourPillarsScore = 72;
  let fpStarPair = `日干: ${dayStem1} × ${dayStem2}`;
  if (isKango) {
    fourPillarsScore = 95 + (combinedSeed % 5);
    fpStarPair += ` (天合・魂の引き寄せ合い)`;
  } else if (isSameStem) {
    fourPillarsScore = 82 + (combinedSeed % 6);
    fpStarPair += ` (比和・同志・親友のような波長)`;
  } else {
    fourPillarsScore = 70 + (combinedSeed % 8);
    fpStarPair += ` (刺激と成長の調和関係)`;
  }

  const fourPillarsDetail: CompatibilityMethodDetail = {
    score: fourPillarsScore,
    label: "四柱推命の相性",
    starPair: fpStarPair,
    overall: isKango
      ? `四柱推命において最高峰の吉相とされる「干合（かんごう）」の関係です。二人の魂が磁石のように引き寄せ合い、補い合うことで完全な調和が生まれます。`
      : isSameStem
      ? `同じ日干の気質を持つため、価値観や物事の判断基準が非常に似通っています。言葉を尽くさずとも理解し合える親友のような安心感があります。`
      : `お互いに異なる五行の要素を持ち、刺激を与え合える相性です。違いを受け入れることで視野が大きく広がり、人間的な成長を遂げられます。`,
    romance: isKango
      ? `出逢った瞬間から運命的な惹かれ合いを感じる最高の恋愛相性です。お互いにとって唯一無二の存在になります。`
      : `親友から自然と恋愛に発展しやすい穏やかで心地よい関係です。笑いのツボや好みが一致しやすいでしょう。`,
    work: isKango
      ? `お互いの弱点を完璧に補い合えるビジネスパートナーです。共同で事業を起こしたり、プロジェクトを進めると大成します。`
      : `同じビジョンを共有しやすく、スピード感を持って目標に向かえます。役割分担を明確にするとさらに成果が上がります。`,
    communication: `お互いの個性とペースを認め合うことが最大の秘訣です。相手を型にはめようとせず、自然体で接することで末永く安定した信頼関係が続きます。`
  };

  // 九星気学相性
  const STAR_ELEMENTS: Record<string, string> = {
    '一白水星': '水', '二黒土星': '土', '三碧木星': '木', '四緑木星': '木',
    '五黄土星': '土', '六白金星': '金', '七赤金星': '金', '八白土星': '土', '九紫火星': '火'
  };
  const elem1 = STAR_ELEMENTS[star1] || '水';
  const elem2 = STAR_ELEMENTS[star2] || '水';
  const SHENG_MAP: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const isSheng = SHENG_MAP[elem1] === elem2 || SHENG_MAP[elem2] === elem1;
  const isBiwa = elem1 === elem2;

  let nineStarScore = 74;
  let nsStarPair = `本命星: ${star1} × ${star2}`;
  if (isSheng) {
    nineStarScore = 93 + (combinedSeed % 6);
    nsStarPair += ` (相生・運気を押し上げ合う好相性)`;
  } else if (isBiwa) {
    nineStarScore = 85 + (combinedSeed % 6);
    nsStarPair += ` (比和・波長がぴったり合う共鳴関係)`;
  } else {
    nineStarScore = 69 + (combinedSeed % 7);
    nsStarPair += ` (相剋・互いに刺激し合える成長関係)`;
  }

  const nineStarDetail: CompatibilityMethodDetail = {
    score: nineStarScore,
    label: "九星気学の相性",
    starPair: nsStarPair,
    overall: isSheng
      ? `九星気学における「相生（そうじょう）」の組み合わせです。一方がもう一方の運気を自然と押し上げ、一緒にいるだけで幸福感と活力が湧いてきます。`
      : isBiwa
      ? `同じ五行（比和）に属するため、リズムや感覚が自然と一致します。無理に気を遣わずに過ごせる居心地の良い相性です。`
      : `気の性質が異なるため、自分にはない魅力に強く惹かれ合います。互いへの礼儀と思いやりを忘れないことが開運の鍵です。`,
    romance: isSheng
      ? `ありのままの自分で愛し愛される理想的な恋愛です。自然とお互いを支え合う温かい家庭を築けます。`
      : `友達のように楽しく冗談を言い合えるさわやかな恋愛です。共通の趣味を通じてさらに親密になります。`,
    work: isSheng
      ? `アイデアを出す側と形にする側の連携が完璧に機能します。ビジネスにおいて最強のコンビとなります。`
      : `息の合った連携で素早い判断が可能です。客観的なチェックを意識することで盤石になります。`,
    communication: `相手の意見を尊重し、否定せずにまずは受け止める姿勢が吉。感謝の言葉を日常的に口にすることで絆がより強固になります。`
  };

  // 令翠学相性
  const isReisuiSame = reisuiStar1 === reisuiStar2;
  const idx1 = REISUI_STARS.indexOf(reisuiStar1);
  const idx2 = REISUI_STARS.indexOf(reisuiStar2);
  const diff = Math.abs(idx1 - idx2);
  const isOpposite = diff === 6;

  let reisuiScore = 75;
  let reisuiStarPair = `宿星: ${reisuiStar1} × ${reisuiStar2}`;
  if (isReisuiSame) {
    reisuiScore = 94 + (combinedSeed % 5);
    reisuiStarPair += ` (同気星・バイオリズムの完全同調)`;
  } else if (isOpposite) {
    reisuiScore = 82 + (combinedSeed % 6);
    reisuiStarPair += ` (対照星・鏡のように補い合うバディ)`;
  } else {
    reisuiScore = 72 + (combinedSeed % 8);
    reisuiStarPair += ` (自立調和星・適度な距離感が育む絆)`;
  }

  const reisuiDetail: CompatibilityMethodDetail = {
    score: reisuiScore,
    label: "令翠学の相性",
    starPair: reisuiStarPair,
    overall: isReisuiSame
      ? `12年のバイオリズムが完全に一致する「同気星」の相性です。好調な時も充電の時も互いの心の動きが手にとるように理解でき、人生の伴侶として最高のパートナーとなります。`
      : isOpposite
      ? `宿星の円環（六令星）において正反対に位置する「対照星」です。自分が見落としがちな視点を相手が持っており、互いを認め合えば無敵のチームとなります。`
      : `周期のリズムが適度にズレているため、一方が充電期の時に、もう一方が上昇期で支えてあげられる理想的なリレー関係を築けます。`,
    romance: isReisuiSame
      ? `タイミングが常に一致し、トントン拍子に関係が深まります。同じ未来を描きやすく結婚生活も安泰です。`
      : `異なる魅力に強く惹かれ合います。相手の世界観を受け入れることで自身の器が大きく広がる豊かな恋となります。`,
    work: isReisuiSame
      ? `息の合った連携で素早い意思決定ができます。同じビジョンに向かって突き進むビジネスで無類の強さを発揮します。`
      : `得意分野が明確に分かれるため、前線とバックオフィスなど役割を分担すると何倍もの成果を生み出せます。`,
    communication: `相手のバイオリズムの状態（充電期か好調期か）を理解して接することが秘訣。相手が疲れている時は温かく見守りましょう。`
  };

  // 総合相性
  const overallScore = Math.round(fourPillarsScore * 0.35 + reisuiScore * 0.35 + nineStarScore * 0.3);
  const overallDetail: CompatibilityMethodDetail = {
    score: overallScore,
    label: "総合相性スコア",
    starPair: "総合鑑定: 四柱推命・九星気学・令翠学の統合",
    overall: overallScore >= 85
      ? `四柱推命・九星気学・令翠学のいずれの観点からも極めて高い調和を示しています。出逢ったこと自体が必然であるかのように、心と運気の波長がしっかりと重なり合っており、互いの人生を何倍にも豊かに高め合える素晴らしい相性です。`
      : overallScore >= 70
      ? `全体的にバランスが良く、安定した信頼関係を築ける好相性です。共通の目的や価値観を共有することで結びつきが一段と強まり、かけがえのないパートナーへと成長していけます。`
      : `それぞれの占術で異なる個性と課題が現れていますが、これは互いに自立し刺激を与え合える関係を示しています。違いを面白がり、相手のペースを尊重することで長く心地よい関係が続きます。`,
    romance: overallScore >= 80
      ? `恋愛において非常に深い惹かれ合いと安心感が共存しています。自然体で過ごせる理想的な関係です。`
      : `お互いを思いやる温かい愛情を育める相性です。日頃の感謝の言葉を大切にすることで絆がより確固たるものになります。`,
    work: overallScore >= 75
      ? `ビジネスや共同作業において強力なタッグを組めます。互いの強みが噛み合い、一人では達成できない大きな成果を生み出せます。`
      : `役割分担とルールを明確にすることが成功への近道です。お互いの専門性を尊重し合うことで着実に前進できます。`,
    communication: overallScore >= 80
      ? `連絡の頻度や呼吸が自然と合う二人です。短文のメッセージでも温かさが伝わり、心地よい時間を共有できます。`
      : `お互いの生活リズムを尊重したコミュニケーションが吉です。日々のちょっとした気遣いが信頼関係をしっかりと支えてくれます。`
  };

  return {
    person1: { name: name1, star: star1, reisuiStar: reisuiStar1, dayPillar: pillar1.day },
    person2: { name: name2, star: star2, reisuiStar: reisuiStar2, dayPillar: pillar2.day },
    score: overallScore,
    overall: overallDetail.overall,
    romance: overallDetail.romance,
    work: overallDetail.work,
    communication: overallDetail.communication,
    methods: {
      overall: overallDetail,
      reisui: reisuiDetail,
      fourPillars: fourPillarsDetail,
      nineStar: nineStarDetail
    }
  };
}

export function calculateCoupleFortune(
  birthdate1: string, name1: string,
  birthdate2: string, name2: string
): FortuneResult {
  const f1 = calculateFortune(birthdate1, name1);
  const f2 = calculateFortune(birthdate2, name2);

  // 100年分の総合スコアをマージ
  const hundredYears: PeriodData[] = f1.flows.hundredYears.map((y1, idx) => {
    const y2 = f2.flows.hundredYears[idx] || y1;
    const avgStageScore = Math.round((y1.stage.score + y2.stage.score) / 2);
    
    let combinedStage = BIORHYTHM_CYCLE[0];
    let minDiff = 999;
    for (const s of BIORHYTHM_CYCLE) {
      const diff = Math.abs(s.score - avgStageScore);
      if (diff < minDiff) {
        minDiff = diff;
        combinedStage = s;
      }
    }

    const mergeScore = (s1: Score, s2: Score): Score => ({
      value: Math.round((s1.value + s2.value) / 2),
      detail: `【${name1}】${s1.detail}\n【${name2}】${s2.detail}`,
      caution: `【注意】${s1.caution}`,
      recommendation: `【開運アドバイス】二人のタイミングを合わせて行動すると吉運が倍増します。`
    });

    return {
      period: y1.period,
      periodValue: y1.periodValue,
      age: y1.age,
      stage: combinedStage,
      stageReisui: y1.stageReisui,
      stageFourPillars: y1.stageFourPillars,
      stageNineStar: y1.stageNineStar,
      romance: mergeScore(y1.romance, y2.romance),
      work: mergeScore(y1.work, y2.work),
      family: mergeScore(y1.family, y2.family),
      marriage: mergeScore(y1.marriage, y2.marriage),
      health: mergeScore(y1.health, y2.health),
      months: y1.months?.map((m1, mIdx) => {
        const m2 = y2.months?.[mIdx] || m1;
        return {
          ...m1,
          stage: combinedStage,
          romance: mergeScore(m1.romance, m2.romance),
          work: mergeScore(m1.work, m2.work),
          family: mergeScore(m1.family, m2.family),
          marriage: mergeScore(m1.marriage, m2.marriage),
          health: mergeScore(m1.health, m2.health),
        };
      })
    };
  });

  return {
    nature: f1.nature,
    fortuneExplanations: f1.fortuneExplanations,
    flows: { hundredYears },
    turningPoints: f1.turningPoints
  };
}
