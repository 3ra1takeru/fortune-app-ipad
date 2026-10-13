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
  star: string;
  subStar: string;
  yinYang: string;
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
export const REISUI_STARS = ["水星", "氷星", "木星", "海星", "月星", "魚星", "火星", "冥星", "金星", "小星", "土星", "天星"];

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

  const yIndex = (solarYear - 4) % 10;
  const bIndex = (solarYear - 4) % 12;
  const yearPillar = `${TEN_STEMS[(yIndex + 10) % 10]}${TWELVE_BRANCHES[(bIndex + 12) % 12]}`;
  
  // 節月と干支
  const mStemBase = ((solarYear % 5) * 2 + solarMonth + 1) % 10;
  const mBranchIndex = (solarMonth + 1) % 12; // 寅月が2月
  const monthPillar = `${TEN_STEMS[mStemBase]}${TWELVE_BRANCHES[mBranchIndex]}`;

  // 日柱（基準日からの通日日数計算）
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dIndex = (diffDays + 10) % 10;
  const dbIndex = (diffDays + 10) % 12;
  const dayPillar = `${TEN_STEMS[(dIndex + 10) % 10]}${TWELVE_BRANCHES[(dbIndex + 12) % 12]}`;

  return { year: yearPillar, month: monthPillar, day: dayPillar };
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
  // グループ1: 一白・四緑・七赤
  // グループ2: 二黒・五黄・八白
  // グループ3: 三碧・六白・九紫
  const g1 = ["一白水星", "四緑木星", "七赤金星"];
  const g2 = ["二黒土星", "五黄土星", "八白土星"];

  // 節月1(丑)〜12(子)の早見順
  // 節月2月(寅月)が年の最初
  const monthOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 1月〜12月
  const mIdx = monthOrder[solarMonth - 1];

  let startStarNum = 8; // グループ1の2月は八白(8)
  if (g2.includes(honmeiStar)) {
    startStarNum = 5; // グループ2の2月は五黄(5)
  } else if (!g1.includes(honmeiStar)) {
    startStarNum = 2; // グループ3の2月は二黒(2)
  }

  // 月命星は逆行（8, 7, 6, 5...）
  let starNum = (startStarNum - mIdx) % 9;
  if (starNum <= 0) starNum += 9;

  return NINE_STARS[starNum - 1];
}

// 日命星計算
function getNichimeiStar(year: number, month: number, day: number): string {
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 日家九星（簡易的に60日サイクルを陽遁・陰遁で巡行）
  // 6月〜12月は陰遁、12月〜6月は陽遁
  const isSummerToWinter = month >= 6 && month <= 11;
  let num = isSummerToWinter 
    ? (9 - (diffDays % 9)) % 9 + 1
    : (diffDays % 9) + 1;
  return NINE_STARS[num - 1];
}

// 傾斜宮計算（本命星中宮盤で月命星が位置する宮）
function getKeishaGyu(honmeiStar: string, getsumeiStar: string): { name: string; meaning: string } {
  const honmeiNum = NINE_STARS.indexOf(honmeiStar) + 1;
  const getsuNum = NINE_STARS.indexOf(getsumeiStar) + 1;

  // 定位盤の宮: 1:坎, 2:坤, 3:震, 4:巽, 5:中宮, 6:乾, 7:兌, 8:艮, 9:離
  // 本命星が中宮にあるとき、月命星が入るステップ
  const step = (getsuNum - honmeiNum + 9) % 9;
  const gyuNum = ((step + 4) % 9) + 1;

  const gyuMap: Record<number, { name: string; meaning: string }> = {
    1: { name: "坎宮傾斜（北）", meaning: "深い洞察力と探求心、人知れず努力しピンチをチャンスに変える粘り強さ" },
    2: { name: "坤宮傾斜（南西）", meaning: "大地のような包容力と補佐役としての卓越した手腕、人や事業を育てる母性" },
    3: { name: "震宮傾斜（東）", meaning: "時代の先を読む直感力と先駆者精神、困難を打破するスピーディーな突破力" },
    4: { name: "巽宮傾斜（南東）", meaning: "卓越した交渉力と人たらしの魅力、誰とでも円満に信用を築き上げる調和力" },
    5: { name: "中宮傾斜（中央）", meaning: "生まれながらの支配力と求心力、いざという時に周囲を束ねる帝王の器" },
    6: { name: "乾宮傾斜（北西）", meaning: "高潔なプライドと揺るぎないリーダーシップ、理想を形にする不屈の実行力" },
    7: { name: "兌宮傾斜（西）", meaning: "人を喜ばせる天性のユーモアと社交性、会話や表現を通じて人を惹きつける魅力" },
    8: { name: "艮宮傾斜（北東）", meaning: "現状を大胆に刷新する改革精神と粘り強さ、逆境をバネに山を登りつめる底力" },
    9: { name: "離宮傾斜（南）", meaning: "鋭敏な美的センスと知性、物事の本質を瞬時に見抜く閃きと華やかな存在感" },
  };

  return gyuMap[gyuNum] || gyuMap[1];
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
// 年代別の人生サイクル（0〜18, 19〜29, 30〜44, 45〜59, 60〜）
// ----------------------------------------------------
function generateLifeStages(currentAge: number, baseSeed: number, fortuneType: 'nineStar' | 'fourPillars' | 'reisui' | 'overall'): AgePeriodLifeStage[] {
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

  return stagesConfig.map(s => {
    const [minAgeStr, maxAgeStr] = s.range.replace('才', '').replace('以降', '').split('〜');
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
      dynamicDesc = `【まさに今、あなたはこの人生の重要なステージの只中にいます】\n${s.pastDesc}\n現在、あなたは次のステージへ向かうための大きな分岐点に立っており、日々の選択の一つひとつが今後の未来を大きく決定づける鍵となっています。`;
    } else if (timingType === 'future') {
      dynamicDesc = `【これから迎える未来のステージです】\n${s.pastDesc}\n現在の努力や経験がすべてこの時期の大きな収穫へと直結していきます。楽しみにして準備を進めてください。`;
    }

    return {
      ageRange: s.range,
      stageTitle: s.title,
      timingType,
      lifeTheme: s.theme,
      description: dynamicDesc,
      checkPoint: s.checkPoint
    };
  });
}

// ----------------------------------------------------
// メイン鑑定計算関数
// ----------------------------------------------------
export function calculateFortune(birthdate: string, name: string): FortuneResult {
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

  const nineStarLifeStages = generateLifeStages(currentAge, seedBase + 10, 'nineStar');

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

  const twelveFatesList = ["長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"];
  const twelveFate = twelveFatesList[seedBase % 12];

  const centerStarsList = ["比肩", "劫財", "食神", "傷官", "偏財", "正財", "偏官", "正官", "偏印", "印綬"];
  const centerStar = centerStarsList[(seedBase + 3) % 10];

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
    lifeStages: generateLifeStages(currentAge, seedBase + 20, 'fourPillars'),
    explanation: `${name}さんの四柱推命は、日干「${dayStem}」を中心とした堂々たる命式です。\n中心星「${centerStar}」と十二運「${twelveFate}」が調和し、年を重ねるごとに魅力と実力が増していく大器晩成の気品を漂わせています。`
  };

  // ----------------------------------------------------
  // 3. 令翠学 (Reisui)
  // ----------------------------------------------------
  const reisuiStar = REISUI_STARS[(seedBase) % 12];
  const reisuiSub = REISUI_STARS[(seedBase + 6) % 12];
  const yinYang = seedBase % 2 === 0 ? "陽令星" : "陰令星";

  const cycleOffset = {
    reisui: (seedBase + 1) % 12,
    four: (seedBase + 5) % 12,
    nine: (seedBase + 9) % 12
  };

  const rLastYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + 2025) % 12];
  const rThisYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + 2026) % 12];
  const rNextYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + 2027) % 12];

  const reisuiYearFlows = {
    lastYear: {
      year: 2025,
      label: "2025年(去年)",
      starOrStage: `バイオリズム：【${rLastYearStage.name}期】(スコア: ${rLastYearStage.score}点)`,
      theme: rLastYearStage.description,
      score: rLastYearStage.score,
      work: "昨年のステージに応じた地道な積み重ねが確実に実を結んだ時期。",
      romance: "心を通わせる深い対話を通じて関係性が洗練されました。",
      health: "生活習慣のリズムを整えることが最大の防御となった時期。",
      family: "身内との協力体制を整え、心の拠り所を築きました。",
      money: "堅実な計画に基づいた運用で無理のない収支を維持。",
      keyAdvice: "去年の経験すべてが、今のあなたを支える強固な根っこになっています。"
    },
    thisYear: {
      year: 2026,
      label: "2026年(今年)",
      starOrStage: `バイオリズム：【${rThisYearStage.name}期】(スコア: ${rThisYearStage.score}点)`,
      theme: rThisYearStage.description,
      score: rThisYearStage.score,
      work: "バイオリズムの波に乗り、温めてきた計画を具現化する最高のタイミング。",
      romance: "自然体でいられる最高のパートナーシップを引き寄せる好機。",
      health: "心身のバランスが整い、活力が湧き出ます。適度な運動を習慣化して。",
      family: "家庭内に笑顔と温かい会話が満ち溢れる安心の年。",
      money: "努力に応じた正当な経済的実りを手にするチャンス期。",
      keyAdvice: "周期の追い風を信じて、思い切った一歩を踏み出してください。"
    },
    nextYear: {
      year: 2027,
      label: "2027年(来年)",
      starOrStage: `バイオリズム：【${rNextYearStage.name}期】(スコア: ${rNextYearStage.score}点)`,
      theme: rNextYearStage.description,
      score: rNextYearStage.score,
      work: "今年掴んだ成果をさらに広げ、新たなステージへ昇華させる時期。",
      romance: "落ち着いた信頼関係の中で、未来の約束を交わす時。",
      health: "メリハリのある休養を取り入れ、長期戦に備える準備を。",
      family: "家族との時間を最優先にすることで、全体の運気が安定します。",
      money: "将来に向けた計画的な貯蓄と手堅い運用が吉運を呼びます。",
      keyAdvice: "焦らず自然体のリズムで、着実に前進を続けてください。"
    }
  };

  const reisuiDetail: ReisuiNatureDetail = {
    star: reisuiStar,
    subStar: reisuiSub,
    yinYang,
    personality: `あなたの運命星は「${reisuiStar}（${yinYang}）」です。さらに裏星として「${reisuiSub}」の要素を宿しています。\n生まれ持った独自の美的センスと鋭い直感力を持ち、既存のルールに縛られない自由な生き方で輝く星です。裏星の繊細さが加わることで、大胆でありながら人の心の機微を察知する優しさを持っています。`,
    strengths: [
      `${reisuiStar}特有の唯一無二の感性と発想力`,
      `裏星「${reisuiSub}」によるきめ細やかな配慮と共感力`,
      `12年周期のバイオリズムを直感的に察知し波に乗る才能`,
      `人とは違う切り口で価値を生み出すオリジナリティ`
    ],
    weaknesses: [
      "気分屋で感情のアップダウンに振り回されやすい",
      "他人の無神経な言動に深く傷つきやすい繊細さ",
      "納得できないことには一切妥協できない不器用さ"
    ],
    cautions: "自分のバイオリズム（充電期・好調期）を把握し、無理に年中フルスロットルで走ろうとしないことが生涯の開運の秘訣です。",
    habits: "気分が乗らない時は完全に引きこもり、好調な時は寝食を忘れて没頭する極端な行動パターンがあります。",
    suitableJobs: [
      "クリエイティブ・デザイン・企画",
      "コンサルタント・カウンセラー",
      "フリーランス・独立起業",
      "広報・ブランディング・表現分野"
    ],
    suitableJobDetail: "マニュアル通りの仕事よりも、あなたのセンスや裁量が尊重される自由度の高い分野で最高の才能を発揮します。",
    communication: "共感力が高く人の本質を見抜くため、聞き上手として愛されます。苦手な人とは無理に付き合わず距離を保って吉。",
    goodAffinity: ["同気星の相手", "対照星の相手", "調和星の相手"],
    affinityDetail: "運気の波を理解し合える仲間や、正反対の視点からあなたを補完してくれる対照星のパートナーと強い絆を結べます。",
    yearFlows: reisuiYearFlows,
    lifeStages: generateLifeStages(currentAge, seedBase + 30, 'reisui'),
    explanation: `${name}さんの支配星は「${reisuiStar}（${yinYang}）」、裏星は「${reisuiSub}」です。\n12年のバイオリズムの波を味方につけることで、驚くほどスムーズに望む人生を引き寄せることができます。`
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
    lifeStages: generateLifeStages(currentAge, seedBase + 40, 'overall')
  };

  // 100年分のバイオリズムデータ
  const hundredYears: PeriodData[] = Array.from({ length: 100 }).map((_, i) => {
    const targetYear = y + i;
    const age = i;
    const yearSeed = seedBase + targetYear;
    
    const yearData = generatePeriodData(yearSeed, `${targetYear}年`, targetYear, age, cycleOffset);
    yearData.months = Array.from({ length: 12 }).map((_, monthIndex) => {
      const targetMonth = monthIndex + 1;
      const monthSeed = yearSeed + targetMonth * 100;
      const monthOffset = {
        reisui: (cycleOffset.reisui + monthIndex) % 12,
        four: (cycleOffset.four + monthIndex) % 12,
        nine: (cycleOffset.nine + monthIndex) % 12
      };
      return generatePeriodData(monthSeed, `${targetMonth}月`, targetMonth, age, monthOffset, true);
    });
    return yearData;
  });

  // ターニングポイント
  const futureYears = hundredYears.filter(yData => yData.periodValue >= currentYear && yData.periodValue <= currentYear + 30);
  let bestMarriageYear = futureYears[0];
  let bestWorkYear = futureYears[0];
  for (const yData of futureYears) {
    if (yData.marriage.value > bestMarriageYear.marriage.value) bestMarriageYear = yData;
    if (yData.work.value > bestWorkYear.work.value) bestWorkYear = yData;
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
        marriage: { year: bestMarriageYear.period, description: `${bestMarriageYear.period}（${bestMarriageYear.age}才）は総合的に婚期・パートナー運の最高潮の年です。` },
        work: { year: bestWorkYear.period, description: `${bestWorkYear.period}（${bestWorkYear.age}才）はキャリアと人生の大きな飛躍の年となります。` }
      },
      fourPillars: {
        marriage: { year: bestMarriageYear.period, description: `四柱推命の流年において、良縁と結実が約束される黄金期です。` },
        work: { year: bestWorkYear.period, description: `社会的地位と名誉を手にする大勝負の年です。` }
      },
      nineStar: {
        marriage: { year: bestMarriageYear.period, description: `九星の年盤において、巽宮（福徳）または乾宮への回座が重なる大吉年です。` },
        work: { year: bestWorkYear.period, description: `運気の頂点に立ち、周囲からの絶大な支持を得られる時期です。` }
      },
      reisui: {
        marriage: { year: bestMarriageYear.period, description: `令翠学12周期の「充実・人気」期が重なる奇跡のタイミングです。` },
        work: { year: bestWorkYear.period, description: `「経済・充実」の収穫期を迎え、人生の集大成を達成します。` }
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

function generatePeriodData(seedBase: number, periodLabel: string, periodValue: number, age: number, offset: {reisui: number, four: number, nine: number}, isMonth: boolean = false): PeriodData {
  const stageReisui = BIORHYTHM_CYCLE[(offset.reisui + periodValue) % 12];
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
  const reisuiStar1 = REISUI_STARS[seed1 % 12];
  const reisuiStar2 = REISUI_STARS[seed2 % 12];

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
  let reisuiStarPair = `支配星: ${reisuiStar1} × ${reisuiStar2}`;
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
      ? `支配星の円環において正反対に位置する「対照星」です。自分が見落としがちな視点を相手が持っており、互いを認め合えば無敵のチームとなります。`
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
