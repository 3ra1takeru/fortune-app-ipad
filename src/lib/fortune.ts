// 四柱推命と九星気学の基本計算ロジック

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

export interface FortuneResult {
  nature: {
    fourPillars: {
      pillars: { year: string; month: string; day: string; };
      explanation: string;
    };
    nineStar: {
      star: string;
      explanation: string;
    };
    reisui: {
      star: string;
      explanation: string;
    };
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


const NINE_STARS = [
  "一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星",
  "六白金星", "七赤金星", "八白土星", "九紫火星"
];

const TEN_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const TWELVE_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const REISUI_STARS = ["水星", "氷星", "木星", "海星", "月星", "魚星", "火星", "冥星", "金星", "小星", "土星", "天星"];

const BIORHYTHM_CYCLE: BiorhythmStage[] = [
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

function getPillar(year: number, month: number, day: number) {
  const yIndex = year % 10;
  const bIndex = year % 12;
  const yearPillar = `${TEN_STEMS[yIndex]}${TWELVE_BRANCHES[bIndex]}`;
  
  const mIndex = (year * 12 + month) % 10;
  const mbIndex = month % 12;
  const monthPillar = `${TEN_STEMS[mIndex]}${TWELVE_BRANCHES[mbIndex]}`;
  
  const dIndex = (year * 365 + month * 30 + day) % 10;
  const dbIndex = day % 12;
  const dayPillar = `${TEN_STEMS[dIndex]}${TWELVE_BRANCHES[dbIndex]}`;

  return { year: yearPillar, month: monthPillar, day: dayPillar };
}

function getNineStar(year: number): string {
  let sum = String(year).split('').reduce((a, b) => a + parseInt(b), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  const index = (11 - sum) % 9;
  return NINE_STARS[index === 0 ? 8 : index - 1] || NINE_STARS[0];
}

function getMonthStar(yIndex: number, m: number): string {
  // 簡易的な月命星計算
  const table = [
    [8, 7, 6, 5, 4, 3, 2, 1, 9, 8, 7, 6], // 一白・四緑・七赤
    [5, 4, 3, 2, 1, 9, 8, 7, 6, 5, 4, 3], // 二黒・五黄・八白
    [2, 1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 9]  // 三碧・六白・九紫
  ];
  let group = 0;
  if ([0, 3, 6].includes(yIndex)) group = 0;
  else if ([1, 4, 7].includes(yIndex)) group = 1;
  else group = 2;
  return NINE_STARS[table[group][(m - 1) % 12] - 1] || NINE_STARS[0];
}

function getReisuiStar(y: number, m: number, d: number): string {
  const seed = y + m + d;
  return REISUI_STARS[seed % 12];
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// 運気のベーススコアを年齢で補正する（子供時代に仕事や結婚が高くならないようにする）
function generateScore(seed: number, category: '恋愛' | '仕事' | '家庭' | '婚期' | '健康', age: number, baseScore: number): Score {
  let value = baseScore + Math.floor(pseudoRandom(seed) * 20 - 10); // ベースから±10のブレ
  if (value > 100) value = 100;
  if (value < 0) value = 0;

  // 年齢による現実的な補正
  if (category === '仕事') {
    if (age < 18) value = Math.floor(value * 0.1); // 学生時代は仕事運ほぼゼロ
    else if (age >= 18 && age < 22) value = Math.floor(value * 0.5); // バイト・就活
    else if (age > 65) value = Math.floor(value * 0.6); // 定年後
  }
  
  if (category === '婚期') {
    if (age < 16) value = 0;
    else if (age >= 16 && age < 20) value = Math.floor(value * 0.3);
    else if (age >= 20 && age <= 35) value = Math.min(100, value + 20); // 婚期のピーク補正
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
  // 各占術のバイオリズムのステージを計算
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
  
  // ベーススコアは総合スコア
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

export function calculateFortune(birthdate: string, name: string): FortuneResult {
  const [y, m, d] = birthdate.split('-').map(Number);
  const nameBase = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedBase = y + m + d + nameBase;
  
  const pillars = getPillar(y, m, d);
  const star = getNineStar(y);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 誕生年に基づくバイオリズムのオフセット（人によってサイクルの開始位置を変える）
  const cycleOffset = {
    reisui: (seedBase + 1) % 12,
    four: (seedBase + 5) % 12,
    nine: (seedBase + 9) % 12
  };

  // 100年分のデータを生成
  const hundredYears: PeriodData[] = Array.from({ length: 100 }).map((_, i) => {
    const targetYear = y + i; // 生まれた年から100年
    const age = i;
    const yearSeed = seedBase + targetYear;
    
    const yearData = generatePeriodData(yearSeed, `${targetYear}年`, targetYear, age, cycleOffset);
    
    // 各年の12ヶ月分のデータを生成（月ごとの細かい波を作るため、月に1を足してずらす）
    yearData.months = Array.from({ length: 12 }).map((_, monthIndex) => {
      const targetMonth = monthIndex + 1;
      const monthSeed = yearSeed + targetMonth * 100;
      // 月ごとの簡易バイオリズム（年と同じサイクルを12ヶ月にマッピング）
      const monthOffset = {
        reisui: (cycleOffset.reisui + monthIndex) % 12,
        four: (cycleOffset.four + monthIndex) % 12,
        nine: (cycleOffset.nine + monthIndex) % 12
      };
      return generatePeriodData(monthSeed, `${targetMonth}月`, targetMonth, age, monthOffset, true);
    });

    return yearData;
  });

  // 婚期と仕事のベストな年を探す（総合・各占術で未来の年の中でスコアが一番高い年を個別抽出）
  const futureYears = hundredYears.filter(yData => yData.periodValue >= currentYear && yData.periodValue <= currentYear + 30);
  
  // 総合のピーク年
  let bestMarriageYear = futureYears[0];
  let bestWorkYear = futureYears[0];
  for (const yData of futureYears) {
    if (yData.marriage.value > bestMarriageYear.marriage.value) bestMarriageYear = yData;
    if (yData.work.value > bestWorkYear.work.value) bestWorkYear = yData;
  }

  // 令翠学のピーク年
  let bestReisuiMarriageYear = futureYears[0];
  let bestReisuiWorkYear = futureYears[0];
  let maxReisuiMarriageScore = -1;
  let maxReisuiWorkScore = -1;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 100, "婚期", yData.age, yData.stageReisui.score).value;
    const wScore = generateScore(seedBase + 2 + 100, "仕事", yData.age, yData.stageReisui.score).value;
    if (mScore > maxReisuiMarriageScore) {
      maxReisuiMarriageScore = mScore;
      bestReisuiMarriageYear = yData;
    }
    if (wScore > maxReisuiWorkScore) {
      maxReisuiWorkScore = wScore;
      bestReisuiWorkYear = yData;
    }
  }

  // 四柱推命のピーク年
  let bestFourPillarsMarriageYear = futureYears[0];
  let bestFourPillarsWorkYear = futureYears[0];
  let maxFpMarriageScore = -1;
  let maxFpWorkScore = -1;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 200, "婚期", yData.age, yData.stageFourPillars.score).value;
    const wScore = generateScore(seedBase + 2 + 200, "仕事", yData.age, yData.stageFourPillars.score).value;
    if (mScore > maxFpMarriageScore) {
      maxFpMarriageScore = mScore;
      bestFourPillarsMarriageYear = yData;
    }
    if (wScore > maxFpWorkScore) {
      maxFpWorkScore = wScore;
      bestFourPillarsWorkYear = yData;
    }
  }

  // 九星気学のピーク年
  let bestNineStarMarriageYear = futureYears[0];
  let bestNineStarWorkYear = futureYears[0];
  let maxNineMarriageScore = -1;
  let maxNineWorkScore = -1;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 300, "婚期", yData.age, yData.stageNineStar.score).value;
    const wScore = generateScore(seedBase + 2 + 300, "仕事", yData.age, yData.stageNineStar.score).value;
    if (mScore > maxNineMarriageScore) {
      maxNineMarriageScore = mScore;
      bestNineStarMarriageYear = yData;
    }
    if (wScore > maxNineWorkScore) {
      maxNineWorkScore = wScore;
      bestNineStarWorkYear = yData;
    }
  }

  const fourPillarsTraits = [
    "非常に思慮深く、一度決めたことは最後までやり遂げる芯の強さを持っています。表面的には穏やかですが、内面には熱い情熱と独立心を秘めています。",
    "柔軟な思考と高い適応能力を持ち、どのような環境でも自分らしく輝くことができます。人との調和を大切にし、場の空気を読むことに長けています。",
    "物事の本質を見抜く直感力に優れ、新しい環境でも自ら道を切り開いていく力強さを持っています。独自性こそがあなたの最大の魅力です。",
    "とても愛情深く、周囲の人を包み込むような優しさを持っています。困っている人を放っておけず、誰からも慕われる人情味あふれる性格です。",
    "論理的で客観的な視点を持ち、常に冷静な判断を下すことができます。知的好奇心が旺盛で、新しい知識を吸収することに喜びを感じます。"
  ];
  
  const twelveFates = ["長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"];
  const fateIndex = seedBase % 12;
  const dayFate = twelveFates[fateIndex];
  
  const traitIndex = seedBase % 5;
  const fpDetail = fourPillarsTraits[traitIndex];

  const honmeiIndex = NINE_STARS.indexOf(star);
  const getsuMei = getMonthStar(honmeiIndex, m);
  
  const keishaList = ["乾宮傾斜", "兌宮傾斜", "離宮傾斜", "震宮傾斜", "巽宮傾斜", "坎宮傾斜", "艮宮傾斜", "坤宮傾斜"];
  const keisha = keishaList[seedBase % 8];

  const nineStarDetail = `本命星は「${star}」、月命星は「${getsuMei}」となります。さらにあなたの内面的な性質や潜在的な才能を表す傾斜は「${keisha}」です。
表面上は${star}の持つ社交性や行動力が目立ちますが、本質的な部分では${getsuMei}の緻密さや思慮深さが強く影響しています。
${keisha}の性質により、いざという時の決断力や、困難な状況を打破する強いエネルギーを秘めています。時には直感に従って思い切った行動に出ることが開運の鍵となります。`;

  const reisuiStar = getReisuiStar(y, m, d);
  const reisuiSub = REISUI_STARS[(seedBase + 6) % 12];
  
  const reisuiDetail = `あなたの支配星は「${reisuiStar}」です。裏星として「${reisuiSub}」の要素も併せ持っています。
${reisuiStar}の性質により、あなたは生まれながらにして独自の感性と表現力を持っています。周囲からは「個性的」と評価されることが多く、既存の枠に囚われない自由な発想が武器です。
また、裏星の${reisuiSub}が作用することで、一見大胆に見えても実は非常に繊細で、人の心の機微に敏感な一面があります。この二面性を上手にコントロールすることが、人生をより豊かにする秘訣です。`;

  // 各占術の現在・未来の暦や星回りのラベル計算
  const nextMonthNum = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const fpThisYear = getPillar(currentYear, currentMonth, 1).year;
  const fpNextYear = getPillar(currentYear + 1, currentMonth, 1).year;
  const fpThisMonth = getPillar(currentYear, currentMonth, 1).month;
  const fpNextMonth = getPillar(nextMonthYear, nextMonthNum, 1).month;

  const nsThisYear = getNineStar(currentYear);
  const nsNextYear = getNineStar(currentYear + 1);
  const nsThisMonth = getMonthStar(NINE_STARS.indexOf(nsThisYear), currentMonth);
  const nsNextMonth = getMonthStar(NINE_STARS.indexOf(getNineStar(nextMonthYear)), nextMonthNum);

  const reisuiThisYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentYear) % 12];
  const reisuiNextYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentYear + 1) % 12];
  const reisuiThisMonthStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentMonth) % 12];
  const reisuiNextMonthStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + nextMonthNum) % 12];

  return {
    nature: {
      fourPillars: {
        pillars,
        explanation: `${name}さんの四柱推命の命式は、年柱が「${pillars.year}」、月柱が「${pillars.month}」、日柱が「${pillars.day}」となります。日干から導き出される十二運星は「${dayFate}」です。\n${fpDetail}\n特に「${dayFate}」の星回りを持つため、人生において着実にステップアップしていく運命にあります。周囲からの信頼も厚く、自然とリーダーシップを発揮する場面が多くなるでしょう。人間関係の構築において、誠実さを意識することでさらなる幸運を引き寄せます。`
      },
      nineStar: {
        star,
        explanation: nineStarDetail
      },
      reisui: {
        star: reisuiStar,
        explanation: reisuiDetail
      }
    },
    fortuneExplanations: {
      overall: {
        thisMonth: {
          period: `${currentYear}年${currentMonth}月`,
          description: "今月は「準備と充電」の時期です。大きな決断や新しいスタートよりも、情報収集や内省に時間をかけることで、今後の飛躍に繋がります。"
        },
        nextMonth: {
          period: `${nextMonthYear}年${nextMonthNum}月`,
          description: "来月は運気が急上昇し、「行動と発展」の月となります。温めていたアイデアを実行に移すのに最適なタイミングです。自信を持って前進してください。"
        },
        thisYear: {
          period: `${currentYear}年`,
          description: "今年の全体的なテーマは「人間関係の広がりと自己成長」です。新しい出会いがあなたの価値観を大きく広げ、思いがけないチャンスをもたらすでしょう。"
        },
        nextYear: {
          period: `${currentYear + 1}年`,
          description: "来年は「収穫と安定」の年です。これまで努力してきたことが具体的な形となって表れ、経済的にも精神的にも充実した日々を送ることができるでしょう。"
        }
      },
      fourPillars: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${fpThisMonth}月）`, description: "四柱推命の観点では、今月は自分自身を見つめ直すのに良い星回りです。少し立ち止まることで、新しい目標が見えてきます。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${fpNextMonth}月）`, description: "来月は「比肩」のような自立のエネルギーが高まります。自分の意志を強く持って行動すると吉です。" },
        thisYear: { period: `${currentYear}年（${fpThisYear}年）`, description: "今年はあなたにとって、大きな飛躍の年となる「建禄」のようなエネルギーがあります。着実な一歩が実を結びます。" },
        nextYear: { period: `${currentYear + 1}年（${fpNextYear}年）`, description: "来年は少しペースを落とし、学びに時間を使うと良い年回りです。資格取得やスキルの研鑽に向いています。" }
      },
      nineStar: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${nsThisMonth}盤）`, description: "九星気学では、今月は暗剣殺を避けた吉方への移動が開運の鍵。身の回りの整理整頓がツキを呼びます。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${nsNextMonth}盤）`, description: "来月はあなたの本命星のエネルギーが強まる月。直感に従ってスピーディに行動することが幸運を引き寄せます。" },
        thisYear: { period: `${currentYear}年（${nsThisYear}年）`, description: "今年の年盤では、あなたは「変化」の宮に位置しています。恐れずに新しい環境に飛び込んでみてください。" },
        nextYear: { period: `${currentYear + 1}年（${nsNextYear}年）`, description: "来年は「結実」の宮に入ります。これまでの努力が周囲に認められ、大きな成果を手にするでしょう。" }
      },
      reisui: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${reisuiThisMonthStage.name}の月）`, description: "令翠学によれば、今月は「精算」の時期。不要なものや人間関係を整理することで、新しい風が入り込みます。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${reisuiNextMonthStage.name}の月）`, description: "来月は「種まき」の運気です。新しい趣味や勉強を始めるのに最適で、将来的に大きな実をつけるでしょう。" },
        thisYear: { period: `${currentYear}年（${reisuiThisYearStage.name}の年）`, description: "今年は「成長」のバイオリズムに乗っています。試行錯誤しながらも、確実にステージアップできる年です。" },
        nextYear: { period: `${currentYear + 1}年（${reisuiNextYearStage.name}の年）`, description: "来年は「充実」のピークを迎えます。仕事もプライベートも思い通りに運びやすい、最高の幸運期です。" }
      }
    },
    flows: {
      hundredYears
    },
    turningPoints: {
      overall: {
        marriage: {
          year: bestMarriageYear.period,
          description: `この年（年齢: ${bestMarriageYear.age}歳）は結婚やパートナーシップにおいて最大の追い風が吹くタイミングです。（バイオリズム：${bestMarriageYear.stage.name}）`
        },
        work: {
          year: bestWorkYear.period,
          description: `この年（年齢: ${bestWorkYear.age}歳）は仕事運が頂点に達し、努力が大きな成果として実を結ぶ年です。（バイオリズム：${bestWorkYear.stage.name}）`
        }
      },
      fourPillars: {
        marriage: { year: bestFourPillarsMarriageYear.period, description: `四柱推命の観点では、この時期（${bestFourPillarsMarriageYear.period} / 年齢: ${bestFourPillarsMarriageYear.age}歳）に「正財」や「正官」といった家庭を築くのに適した星が巡ってきます。（バイオリズム：${bestFourPillarsMarriageYear.stageFourPillars.name}）` },
        work: { year: bestFourPillarsWorkYear.period, description: `この年（${bestFourPillarsWorkYear.period} / 年齢: ${bestFourPillarsWorkYear.age}歳）は「印綬」や「偏財」など、社会的地位や財を築きやすい星回りが集中しています。（バイオリズム：${bestFourPillarsWorkYear.stageFourPillars.name}）` }
      },
      nineStar: {
        marriage: { year: bestNineStarMarriageYear.period, description: `九星気学では、この時期（${bestNineStarMarriageYear.period} / 年齢: ${bestNineStarMarriageYear.age}歳）は「縁結び」や「調和」のエネルギーが最大となり、良縁に恵まれやすい運気です。（バイオリズム：${bestNineStarMarriageYear.stageNineStar.name}）` },
        work: { year: bestNineStarWorkYear.period, description: `この年（${bestNineStarWorkYear.period} / 年齢: ${bestNineStarWorkYear.age}歳）は「発展」と「名誉」の宮に星が入り、これまでの努力が一気に開花する時期です。（バイオリズム：${bestNineStarWorkYear.stageNineStar.name}）` }
      },
      reisui: {
        marriage: { year: bestReisuiMarriageYear.period, description: `令翠学におけるあなたのバイオリズムが最高潮に達するこの年（${bestReisuiMarriageYear.period} / 年齢: ${bestReisuiMarriageYear.age}歳）は、理想のパートナーとの深い結びつきを得るでしょう。（バイオリズム：${bestReisuiMarriageYear.stageReisui.name}）` },
        work: { year: bestReisuiWorkYear.period, description: `この年（${bestReisuiWorkYear.period} / 年齢: ${bestReisuiWorkYear.age}歳）は令翠学のサイクルの中で最もエネルギーが高く、仕事面で大きな目標を達成できる時期です。（バイオリズム：${bestReisuiWorkYear.stageReisui.name}）` }
      }
    }
  };
}

export function calculateCoupleFortune(
  birthdate1: string, name1: string,
  birthdate2: string, name2: string
): FortuneResult {
  const [y1, m1, d1] = birthdate1.split('-').map(Number);
  const [y2, m2, d2] = birthdate2.split('-').map(Number);
  
  const nameBase1 = name1.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameBase2 = name2.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const seedBase = y1 + m1 + d1 + y2 + m2 + d2 + nameBase1 + nameBase2;
  
  // 1人目の生年をベースにする
  const baseYear = y1;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const cycleOffset = {
    reisui: (seedBase + 1) % 12,
    four: (seedBase + 5) % 12,
    nine: (seedBase + 9) % 12
  };

  const hundredYears: PeriodData[] = Array.from({ length: 100 }).map((_, i) => {
    const targetYear = baseYear + i;
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

  const futureYears = hundredYears.filter(yData => yData.periodValue >= currentYear && yData.periodValue <= currentYear + 30);
  
  // 総合
  let bestMarriageYear = futureYears[0];
  let worstRomanceYear = futureYears[0];
  for (const yData of futureYears) {
    if (yData.marriage.value > bestMarriageYear.marriage.value) bestMarriageYear = yData;
    if (yData.romance.value < worstRomanceYear.romance.value) worstRomanceYear = yData;
  }

  // 令翠学
  let bestReisuiMarriageYear = futureYears[0];
  let worstReisuiRomanceYear = futureYears[0];
  let maxReisuiMarriageScore = -1;
  let minReisuiRomanceScore = 999;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 100, "婚期", yData.age, yData.stageReisui.score).value;
    const rScore = generateScore(seedBase + 1 + 100, "恋愛", yData.age, yData.stageReisui.score).value;
    if (mScore > maxReisuiMarriageScore) {
      maxReisuiMarriageScore = mScore;
      bestReisuiMarriageYear = yData;
    }
    if (rScore < minReisuiRomanceScore) {
      minReisuiRomanceScore = rScore;
      worstReisuiRomanceYear = yData;
    }
  }

  // 四柱推命
  let bestFourPillarsMarriageYear = futureYears[0];
  let worstFourPillarsRomanceYear = futureYears[0];
  let maxFpMarriageScore = -1;
  let minFpRomanceScore = 999;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 200, "婚期", yData.age, yData.stageFourPillars.score).value;
    const rScore = generateScore(seedBase + 1 + 200, "恋愛", yData.age, yData.stageFourPillars.score).value;
    if (mScore > maxFpMarriageScore) {
      maxFpMarriageScore = mScore;
      bestFourPillarsMarriageYear = yData;
    }
    if (rScore < minFpRomanceScore) {
      minFpRomanceScore = rScore;
      worstFourPillarsRomanceYear = yData;
    }
  }

  // 九星気学
  let bestNineStarMarriageYear = futureYears[0];
  let worstNineStarRomanceYear = futureYears[0];
  let maxNineMarriageScore = -1;
  let minNineRomanceScore = 999;
  for (const yData of futureYears) {
    const mScore = generateScore(seedBase + 4 + 300, "婚期", yData.age, yData.stageNineStar.score).value;
    const rScore = generateScore(seedBase + 1 + 300, "恋愛", yData.age, yData.stageNineStar.score).value;
    if (mScore > maxNineMarriageScore) {
      maxNineMarriageScore = mScore;
      bestNineStarMarriageYear = yData;
    }
    if (rScore < minNineRomanceScore) {
      minNineRomanceScore = rScore;
      worstNineStarRomanceYear = yData;
    }
  }

  // 各占術の現在・未来の暦や星回りのラベル計算
  const nextMonthNum = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextMonthYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const fpThisYear = getPillar(currentYear, currentMonth, 1).year;
  const fpNextYear = getPillar(currentYear + 1, currentMonth, 1).year;
  const fpThisMonth = getPillar(currentYear, currentMonth, 1).month;
  const fpNextMonth = getPillar(nextMonthYear, nextMonthNum, 1).month;

  const nsThisYear = getNineStar(currentYear);
  const nsNextYear = getNineStar(currentYear + 1);
  const nsThisMonth = getMonthStar(NINE_STARS.indexOf(nsThisYear), currentMonth);
  const nsNextMonth = getMonthStar(NINE_STARS.indexOf(getNineStar(nextMonthYear)), nextMonthNum);

  const reisuiThisYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentYear) % 12];
  const reisuiNextYearStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentYear + 1) % 12];
  const reisuiThisMonthStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + currentMonth) % 12];
  const reisuiNextMonthStage = BIORHYTHM_CYCLE[(cycleOffset.reisui + nextMonthNum) % 12];

  return {
    nature: {
      fourPillars: {
        pillars: getPillar(y1, m1, d1),
        explanation: `${name1}さんと${name2}さんが交わると、お互いの足りない部分を補い合い、新しい価値観を生み出すパワフルな相性となります。時には意見がぶつかることもありますが、それこそが絆を深めるスパイスになります。一緒にいることで、一人では成し遂げられない大きな目標に向かって進むことができるでしょう。`
      },
      nineStar: {
        star: "二人の関係性",
        explanation: `この組み合わせは「共に成長する」というテーマを持っています。片方が落ち込んでいる時はもう片方が自然と引っ張り上げる、という素晴らしいバランスを保ちます。相手の価値観を尊重し、言葉にして感謝を伝えることで、どんな困難も乗り越えられる運気を秘めています。`
      },
      reisui: {
        star: "二人の令翠学",
        explanation: `お二人の相性は、お互いの運気を補完し合う関係にあります。片方が停滞している時に、もう片方の強い運気がサポートに回ることで、常にどちらかがリードして困難を乗り越えられるでしょう。`
      }
    },
    fortuneExplanations: {
      overall: {
        thisMonth: { period: `${currentYear}年${currentMonth}月`, description: "今月は「二人の絆が試される」時期です。些細なすれ違いが起きやすいですが、本音で話し合うことでかえって関係が深まります。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月`, description: "来月は二人の運気が急上昇し、「喜びを分かち合う」月となります。デートや旅行など、一緒に楽しい計画を立てるのに最適です。" },
        thisYear: { period: `${currentYear}年`, description: "今年の全体的なテーマは「関係性のステップアップ」です。付き合いが長いカップルは同棲や結婚など次のステージへ進む大きなチャンスの年です。出会ったばかりの二人は一気に距離が縮まるでしょう。" },
        nextYear: { period: `${currentYear + 1}年`, description: "来年は「安定と信頼」の年です。穏やかで平和な時間が流れ、お互いの存在が一番の心の拠り所となるでしょう。将来に向けた具体的な話し合いにも適しています。" }
      },
      fourPillars: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${fpThisMonth}月）`, description: "四柱推命で見ると、今月はお互いの価値観の違いをすり合わせるのに良い時期です。相手の意見に耳を傾けてみましょう。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${fpNextMonth}月）`, description: "来月は二人の間に調和をもたらす星が巡ります。穏やかで温かい時間を共有できるでしょう。" },
        thisYear: { period: `${currentYear}年（${fpThisYear}年）`, description: "今年は四柱推命の観点から「結びつき」が強まる年回り。共通の趣味や目標を持つと、二人の絆がより盤石になります。" },
        nextYear: { period: `${currentYear + 1}年（${fpNextYear}年）`, description: "来年はお互いの成長を支え合う年になります。相手の挑戦を応援することで、深い信頼関係が築かれます。" }
      },
      nineStar: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${nsThisMonth}盤）`, description: "九星気学では、今月は少しコミュニケーション不足になりやすい星回り。意識して感謝の言葉を伝えましょう。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${nsNextMonth}盤）`, description: "来月は二人の星の相性が抜群に良くなる月です。一緒に出かけると、思いがけない幸運な出来事がありそうです。" },
        thisYear: { period: `${currentYear}年（${nsThisYear}年）`, description: "今年は二人の関係性が周囲から祝福される年。家族や友人に紹介するのにも適した運気です。" },
        nextYear: { period: `${currentYear + 1}年（${nsNextYear}年）`, description: "来年は「安定」の宮に入ります。波風の少ない穏やかな一年で、将来を見据えた落ち着いた交際ができるでしょう。" }
      },
      reisui: {
        thisMonth: { period: `${currentYear}年${currentMonth}月（${reisuiThisMonthStage.name}の月）`, description: "令翠学によれば、今月はお互いのプライベートな時間を尊重することが良好な関係を保つ鍵となります。" },
        nextMonth: { period: `${nextMonthYear}年${nextMonthNum}月（${reisuiNextMonthStage.name}の月）`, description: "来月は二人の運命星が共鳴し合い、言葉にしなくても相手の気持ちが手に取るようにわかる時期です。" },
        thisYear: { period: `${currentYear}年（${reisuiThisYearStage.name}の年）`, description: "今年は令翠学のサイクルにおいて、二人の絆が確固たるものに成長する年。困難も二人でなら乗り越えられます。" },
        nextYear: { period: `${currentYear + 1}年（${reisuiNextYearStage.name}の年）`, description: "来年は二人にとっての「充実期」。愛情が最も深まり、結婚などの大きな決断にも最適な素晴らしい一年です。" }
      }
    },
    flows: {
      hundredYears
    },
    turningPoints: {
      overall: {
        marriage: { year: bestMarriageYear.period, description: `この年（${bestMarriageYear.period}）は二人にとって「結婚」や「関係の決定的な進展」において最大の追い風が吹くタイミングです。（バイオリズム：${bestMarriageYear.stage.name}）` },
        work: { year: worstRomanceYear.period, description: `この年（${worstRomanceYear.period}）はすれ違いやすく「別れの危機」や「関係の停滞」が訪れやすい要注意の時期です。思いやりを忘れずに。（バイオリズム：${worstRomanceYear.stage.name}）` }
      },
      fourPillars: {
        marriage: { year: bestFourPillarsMarriageYear.period, description: `四柱推命の観点では、この時期（${bestFourPillarsMarriageYear.period}）に二人の運命を強く結びつける星が巡り、自然な形で次のステップへと進むでしょう。（バイオリズム：${bestFourPillarsMarriageYear.stageFourPillars.name}）` },
        work: { year: worstFourPillarsRomanceYear.period, description: `この年（${worstFourPillarsRomanceYear.period}）はお互いの主張がぶつかりやすい星回りです。少し距離を置き、冷静になる時間を持つことが大切です。（バイオリズム：${worstFourPillarsRomanceYear.stageFourPillars.name}）` }
      },
      nineStar: {
        marriage: { year: bestNineStarMarriageYear.period, description: `九星気学では、この時期（${bestNineStarMarriageYear.period}）は二人の星が最も良い角度で交わり、家族としての絆を結ぶのに絶好の運気となります。（バイオリズム：${bestNineStarMarriageYear.stageNineStar.name}）` },
        work: { year: worstNineStarRomanceYear.period, description: `この年（${worstNineStarRomanceYear.period}）は暗剣殺のようなトラブルの気配があります。誤解を避けるため、丁寧なコミュニケーションを心がけてください。（バイオリズム：${worstNineStarRomanceYear.stageNineStar.name}）` }
      },
      reisui: {
        marriage: { year: bestReisuiMarriageYear.period, description: `令翠学における二人のバイオリズムが同調し、最高潮に達するこの年（${bestReisuiMarriageYear.period}）は、まさに運命が交差するベストタイミングです。（バイオリズム：${bestReisuiMarriageYear.stageReisui.name}）` },
        work: { year: worstReisuiRomanceYear.period, description: `この年（${worstReisuiRomanceYear.period}）は運気が停滞しやすく、お互いの短所が目につきやすくなります。相手を許容する広い心が必要です。（バイオリズム：${worstReisuiRomanceYear.stageReisui.name}）` }
      }
    }
  };
}

export function calculateCompatibility(
  birthdate1: string, name1: string,
  birthdate2: string, name2: string
): CompatibilityResult {
  const [y1, m1, d1] = birthdate1.split('-').map(Number);
  const [y2, m2, d2] = birthdate2.split('-').map(Number);
  
  const seed1 = y1 * 365 + m1 * 31 + d1 + name1.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed2 = y2 * 365 + m2 * 31 + d2 + name2.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const combinedSeed = seed1 + seed2;

  // 1. 各種星・命式の算出
  const star1 = getNineStar(y1);
  const star2 = getNineStar(y2);
  const reisuiStar1 = getReisuiStar(y1, m1, d1);
  const reisuiStar2 = getReisuiStar(y2, m2, d2);
  const pillar1 = getPillar(y1, m1, d1);
  const pillar2 = getPillar(y2, m2, d2);

  const dayStem1 = pillar1.day[0];
  const dayBranch1 = pillar1.day[1];
  const dayStem2 = pillar2.day[0];
  const dayBranch2 = pillar2.day[1];

  // ----------------------------------------------------
  // 四柱推命 (Four Pillars) の相性判定
  // ----------------------------------------------------
  const kanGoPairs: [string, string][] = [
    ["甲", "己"], ["乙", "庚"], ["丙", "辛"], ["丁", "壬"], ["戊", "癸"]
  ];
  const isKanGo = kanGoPairs.some(
    ([a, b]) => (dayStem1 === a && dayStem2 === b) || (dayStem1 === b && dayStem2 === a)
  );

  const shiGoPairs: [string, string][] = [
    ["子", "丑"], ["寅", "亥"], ["卯", "戌"], ["辰", "酉"], ["巳", "申"], ["午", "未"]
  ];
  const isShiGo = shiGoPairs.some(
    ([a, b]) => (dayBranch1 === a && dayBranch2 === b) || (dayBranch1 === b && dayBranch2 === a)
  );

  const sanGoGroups = [
    ["申", "子", "辰"], ["巳", "酉", "丑"], ["寅", "午", "戌"], ["亥", "卯", "未"]
  ];
  const isSanGo = sanGoGroups.some(g => g.includes(dayBranch1) && g.includes(dayBranch2));

  const chyuPairs: [string, string][] = [
    ["子", "午"], ["丑", "未"], ["寅", "申"], ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]
  ];
  const isChyu = chyuPairs.some(
    ([a, b]) => (dayBranch1 === a && dayBranch2 === b) || (dayBranch1 === b && dayBranch2 === a)
  );

  const stemElement: Record<string, '木' | '火' | '土' | '金' | '水'> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
    '庚': '金', '辛': '金', '壬': '水', '癸': '水'
  };
  const elem1 = stemElement[dayStem1] || '木';
  const elem2 = stemElement[dayStem2] || '木';

  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const keMap: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

  const isFourPillarsSheng = shengMap[elem1] === elem2 || shengMap[elem2] === elem1;
  const isFourPillarsBiwa = elem1 === elem2;
  const isFourPillarsKe = keMap[elem1] === elem2 || keMap[elem2] === elem1;

  let fourPillarsScore = 72;
  let fourPillarsStarPair = `日柱: ${pillar1.day} × ${pillar2.day}`;

  if (isKanGo && isShiGo) {
    fourPillarsScore = 98;
    fourPillarsStarPair += ` (天地徳合・奇跡の相性)`;
  } else if (isKanGo) {
    fourPillarsScore = 93 + (combinedSeed % 4);
    fourPillarsStarPair += ` (天生干合・魂の惹かれ合い)`;
  } else if (isShiGo) {
    fourPillarsScore = 87 + (combinedSeed % 4);
    fourPillarsStarPair += ` (地支支合・自然体で居られる相性)`;
  } else if (isSanGo) {
    fourPillarsScore = 83 + (combinedSeed % 4);
    fourPillarsStarPair += ` (三合理気・価値観の共鳴)`;
  } else if (isFourPillarsSheng) {
    fourPillarsScore = 80 + (combinedSeed % 5);
    fourPillarsStarPair += ` (五行相生・互いを高め合う調和)`;
  } else if (isFourPillarsBiwa) {
    fourPillarsScore = 74 + (combinedSeed % 5);
    fourPillarsStarPair += ` (五行比和・同志のような安心感)`;
  } else if (isChyu) {
    fourPillarsScore = 60 + (combinedSeed % 5);
    fourPillarsStarPair += ` (七冲・刺激と成長の境界線)`;
  } else if (isFourPillarsKe) {
    fourPillarsScore = 66 + (combinedSeed % 5);
    fourPillarsStarPair += ` (五行相剋・互いにない魅力を補う関係)`;
  } else {
    fourPillarsScore = 70 + (combinedSeed % 6);
    fourPillarsStarPair += ` (安定の調和)`;
  }

  const fourPillarsDetail: CompatibilityMethodDetail = {
    score: fourPillarsScore,
    label: "四柱推命の相性",
    starPair: fourPillarsStarPair,
    overall: fourPillarsScore >= 85
      ? `日柱の結びつき（${fourPillarsStarPair}）が非常に強く、出逢った瞬間からどこか懐かしさや強い縁を感じる特別な相性です。天干と地支のエネルギーが調和しており、人生の荒波も二人で力を合わせれば何倍もの力に変えて乗り越えられます。`
      : fourPillarsScore >= 70
      ? `五行のバランス（${elem1} × ${elem2}）が良好で、お互いの役割分担が自然に成立しやすい相性です。日干の持つ本質が互いに心地よく作用し合い、過度な緊張感なく長期的な信頼関係を育むことができます。`
      : `日柱の気質において異なる要素を持っていますが、これは「互いが持っていない強みを持ち寄る」素晴らしい補完関係を意味します。相手の考え方に無理に同調するのではなく、違いを認め合う姿勢が深い絆を生み出します。`,
    romance: fourPillarsScore >= 85
      ? `恋愛において非常に情熱的でありながら、同時に深い安心感に満たされます。お互いが素の自分を見せやすく、結婚や将来を自然と意識できる組み合わせです。`
      : fourPillarsScore >= 70
      ? `互いに歩調を合わせて穏やかに愛を育める関係です。日々の何気ない会話や共通の趣味を大切にすることで、じわじわと愛情が深まります。`
      : `時には感情のすれ違いを感じることもありますが、素直な気持ちを言葉にすることでかえって二人の理解が深まります。駆け引きをせず誠実に向き合うことが幸福の鍵です。`,
    work: fourPillarsScore >= 80
      ? `仕事や共通のプロジェクトにおいて最高のパートナーシップを発揮します。直感と緻密さ、実行力と計画力が見事なハーモニーを奏でます。`
      : `役割やテリトリーを明確に切り分けることで相乗効果が最大化します。お互いの得意分野を全面的にリスペクトし合う関係性がベストです。`,
    communication: fourPillarsScore >= 80
      ? `日柱の波長が合っているため、言葉足らずでも真意が伝わりやすい関係です。連絡のテンポも自然と一致し、心地よい距離感をキープできます。`
      : `連絡の頻度や文量の好みに少し差が出やすい星回りです。要件や感情を濁さずシンプルかつ温かい言葉で伝えることで、誤解のないスムーズな関係を維持できます。`
  };

  // ----------------------------------------------------
  // 九星気学 (Nine Star Ki) の相性判定
  // ----------------------------------------------------
  const nineStarElement: Record<string, '水' | '土' | '木' | '金' | '火'> = {
    '一白水星': '水',
    '二黒土星': '土', '五黄土星': '土', '八白土星': '土',
    '三碧木星': '木', '四緑木星': '木',
    '六白金星': '金', '七赤金星': '金',
    '九紫火星': '火'
  };
  const nsElem1 = nineStarElement[star1] || '水';
  const nsElem2 = nineStarElement[star2] || '水';

  const isNineStarSheng = shengMap[nsElem1] === nsElem2 || shengMap[nsElem2] === nsElem1;
  const isNineStarBiwa = nsElem1 === nsElem2;
  const isNineStarKe = keMap[nsElem1] === nsElem2 || keMap[nsElem2] === nsElem1;

  let nineStarScore = 70;
  let nineStarStarPair = `本命星: ${star1} × ${star2}`;

  if (isNineStarSheng) {
    nineStarScore = 90 + (combinedSeed % 6);
    const giver = shengMap[nsElem1] === nsElem2 ? `${star1}が${star2}を生じる` : `${star2}が${star1}を生じる`;
    nineStarStarPair += ` (相生の大吉・${giver})`;
  } else if (isNineStarBiwa) {
    nineStarScore = 78 + (combinedSeed % 6);
    nineStarStarPair += ` (比和の吉・同じ気を持つ同盟)`;
  } else if (isNineStarKe) {
    nineStarScore = 63 + (combinedSeed % 6);
    nineStarStarPair += ` (相剋・互いを鍛え成長を促す気)`;
  } else {
    nineStarScore = 72 + (combinedSeed % 5);
    nineStarStarPair += ` (調和の巡り)`;
  }

  const nineStarDetail: CompatibilityMethodDetail = {
    score: nineStarScore,
    label: "九星気学の相性",
    starPair: nineStarStarPair,
    overall: isNineStarSheng
      ? `九星気学において「相生（そうじょう）」と呼ばれる大変恵まれた気配です。一方の持つ気がもう一方の運気を自然と押し上げ、一緒に過ごすだけでエネルギーが湧いてくる幸運の引き寄せ合いが生まれます。`
      : isNineStarBiwa
      ? `本命星の五行が同じ（比和）であるため、物事の捉え方や好みの波長が似ており、まるで幼馴染や親友のように気を遣わずに過ごせる相性です。共感し合える場面が非常に多いでしょう。`
      : `九星の気（${nsElem1} × ${nsElem2}）が刺激し合う相剋の配置です。互いに自分にはない鋭い視点や行動力に憧れや刺激を受けます。礼儀と思いやりを常に忘れないことが運気を安定させる鍵です。`,
    romance: isNineStarSheng
      ? `どちらかが無理に背伸びをすることなく、自然体で甘えたり支え合ったりできる素晴らしい恋愛相性です。お互いの笑顔が最大の活力になります。`
      : isNineStarBiwa
      ? `友達関係の延長のように楽しくさわやかな恋愛ができます。共通の趣味や旅行を通じて思い出を共有すると、急速に関係が進展します。`
      : `一度火がつくとドラマチックで情熱的な恋愛に発展しやすい星回りです。感情的なぶつかり合いを避け、相手の意見を尊重するゆとりを持ちましょう。`,
    work: isNineStarSheng
      ? `気の巡りが抜群で、アイデアを出す人とそれを形にする人の連携が綺麗に噛み合います。共同プロジェクトで大きな成果を上げられます。`
      : `感覚が似ているため合意形成がスムーズです。ただし同じ落とし穴にハマらないよう、客観的なチェックを意識すると盤石です。`,
    communication: isNineStarSheng
      ? `相手が今何を望んでいるかが言葉なしでも伝わりやすい巡りです。日常のちょっとしたLINEや電話が大きな安心感を生みます。`
      : `連絡頻度についての認識を初めに共有しておくと良好な関係が保てます。「既読」や「返信の速さ」に囚われず、相手のリズムを尊重しましょう。`
  };

  // ----------------------------------------------------
  // 令翠学 (Reisui) の相性判定
  // ----------------------------------------------------
  const reisuiPairs: Record<string, string> = {
    '水星': '氷星', '氷星': '水星',
    '木星': '海星', '海星': '木星',
    '月星': '魚星', '魚星': '月星',
    '火星': '冥星', '冥星': '火星',
    '金星': '小星', '小星': '金星',
    '土星': '天星', '天星': '土星'
  };
  const isReisuiSameGroup = reisuiPairs[reisuiStar1] === reisuiStar2 || reisuiStar1 === reisuiStar2;
  const idx1 = REISUI_STARS.indexOf(reisuiStar1);
  const idx2 = REISUI_STARS.indexOf(reisuiStar2);
  const diff = Math.abs(idx1 - idx2);
  const isOpposite = diff === 6; // 対照星（反対の星）

  let reisuiScore = 73;
  let reisuiStarPair = `支配星: ${reisuiStar1} × ${reisuiStar2}`;

  if (isReisuiSameGroup) {
    reisuiScore = 92 + (combinedSeed % 6);
    reisuiStarPair += ` (同気星・バイオリズムの完全同調)`;
  } else if (isOpposite) {
    reisuiScore = 80 + (combinedSeed % 5);
    reisuiStarPair += ` (対照星・運命の鏡となる補完関係)`;
  } else if (diff % 2 === 0) {
    reisuiScore = 84 + (combinedSeed % 6);
    reisuiStarPair += ` (調和星・運気の波が支え合う好相性)`;
  } else {
    reisuiScore = 68 + (combinedSeed % 6);
    reisuiStarPair += ` (自立星・適度な距離感が幸運を呼ぶ)`;
  }

  const reisuiDetail: CompatibilityMethodDetail = {
    score: reisuiScore,
    label: "令翠学の相性",
    starPair: reisuiStarPair,
    overall: isReisuiSameGroup
      ? `令翠学における12周期のバイオリズムが同調する「同気星」の組み合わせです。好調な時も充電の時も互いの心の動きが手にとるように理解でき、人生の伴侶として最も心強い絆を結べます。`
      : isOpposite
      ? `支配星の円環において正反対に位置する「対照星」です。まるで自分を映し出す鏡のように、自分が見落としがちな視点を相手が持っています。互いを認め合えば最強のバディとなります。`
      : `運気のサイクルが程よくズレているため、一方が充電期で落ち込んでいる時に、もう一方が上昇期で支えてあげられる理想的なリレー関係を築けます。`,
    romance: isReisuiSameGroup
      ? `二人のタイミングが常に一致するため、トントン拍子に関係が深まりやすい相性です。同じ未来の夢を描きやすく、結婚生活も安泰です。`
      : `お互いの異なる魅力に強烈に惹かれ合います。相手の世界観を受け入れることで、自身の視野が大きく広がる豊かな恋愛となります。`,
    work: isReisuiSameGroup
      ? `息の合った連携で素早い意思決定ができます。同じビジョンを共有して進めるビジネスで無類の強さを発揮します。`
      : `お互いに得意分野が異なるため、前線とバックオフィスなど明確に分担するとお互いの才能が何倍にも輝きます。`,
    communication: `令翠学の運気バイオリズムに合わせたコミュニケーションが効果的です。相手が充電期（清算・内省・自覚）のときは温かく見守り、好調期には一緒に楽しむ柔軟性が長続きの秘訣です。`
  };

  // ----------------------------------------------------
  // 総合 (Overall) 相性判定
  // ----------------------------------------------------
  const overallScore = Math.round(fourPillarsScore * 0.35 + reisuiScore * 0.35 + nineStarScore * 0.3);
  let overallStarPair = `総合鑑定: 四柱推命・九星気学・令翠学の統合`;

  const overallDetail: CompatibilityMethodDetail = {
    score: overallScore,
    label: "総合相性スコア",
    starPair: overallStarPair,
    overall: overallScore >= 85
      ? `四柱推命・九星気学・令翠学のいずれの観点からも非常に高い調和を示しています。出逢ったこと自体が必然であるかのように、心と運気の波長がしっかりと重なり合っており、お互いの人生をより豊かなものへと高め合える素晴らしい相性です。`
      : overallScore >= 70
      ? `全体的にバランスが良く、安定した信頼関係を築ける相性です。共通の目的や価値観を共有することで結びつきが一段と強まり、お互いにかけがえのないパートナーへと成長していけるでしょう。`
      : `それぞれの占術で異なる個性と課題が現れていますが、これは「互いに自立し、刺激を与え合える関係」であることを示しています。違いを面白がり、相手のペースを尊重することで長く心地よい関係が続きます。`,
    romance: overallScore >= 80
      ? `恋愛において非常に深い惹かれ合いと安心感が共存しています。言葉にしなくても相手の気持ちが伝わりやすく、自然体で過ごせる理想的な関係です。`
      : `お互いを思いやる温かい愛情を育める相性です。記念日や日頃の感謝の言葉を大切にすることで、絆がより確固たるものになります。`,
    work: overallScore >= 75
      ? `ビジネスや共同作業において強力なタッグを組めます。互いの強みが噛み合い、一人では達成できない大きな成果を生み出すことができます。`
      : `役割分担とルールを明確にすることが成功への近道です。お互いの専門性や感性を尊重し合うことで、着実に前進できます。`,
    communication: overallScore >= 80
      ? `連絡の頻度や呼吸が自然と合う二人です。短文のLINEでも温かさが伝わり、長電話をしても心地よい時間を共有できます。今の自然なペースを大切にしてください。`
      : `お互いの生活リズムを尊重したコミュニケーションが吉です。「おはよう」「お疲れ様」といった日々のちょっとした気遣いが、信頼関係をしっかりと支えてくれます。`
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

