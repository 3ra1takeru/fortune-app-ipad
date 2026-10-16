// テスト用スクリプト: 1986-04-25 の命式検証
const TEN_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const TWELVE_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const NINE_STARS = ["一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星", "六白金星", "七赤金星", "八白土星", "九紫火星"];

// 節入り日判定（立春・節月）
function getSolarDateInfo(year, month, day) {
  const cutoffDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
  const cutoff = cutoffDays[month - 1];
  
  let solarYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    solarYear = year - 1;
  }

  let solarMonth = month;
  if (day < cutoff) {
    solarMonth = month === 1 ? 12 : month - 1;
  }

  return { solarYear, solarMonth };
}

// 1. 四柱推命の柱計算
function getPillar(year, month, day) {
  const { solarYear, solarMonth } = getSolarDateInfo(year, month, day);

  // 年柱
  const yIndex = ((solarYear - 4) % 10 + 10) % 10;
  const bIndex = ((solarYear - 4) % 12 + 12) % 12;
  const yearPillar = `${TEN_STEMS[yIndex]}${TWELVE_BRANCHES[bIndex]}`;
  
  // 月柱（五虎遁）
  // 寅月(2月)の干 = (年干 % 5) * 2 + 2
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

// 2. 本命星
function getHonmeiStar(year, month, day) {
  const { solarYear } = getSolarDateInfo(year, month, day);
  let sum = String(solarYear).split('').reduce((a, b) => a + parseInt(b), 0);
  while (sum > 9) {
    sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  let index = (11 - sum) % 9;
  if (index === 0) index = 9;
  return NINE_STARS[index - 1];
}

// 3. 月命星
function getGetsumeiStar(honmeiStar, month, day) {
  const { solarMonth } = getSolarDateInfo(2000, month, day);
  const g1 = ["一白水星", "四緑木星", "七赤金星"];
  const g2 = ["二黒土星", "五黄土星", "八白土星"];

  const monthOrder = [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const mIdx = monthOrder[solarMonth - 1];

  let startStarNum = 8;
  if (g2.includes(honmeiStar)) {
    startStarNum = 5;
  } else if (!g1.includes(honmeiStar)) {
    startStarNum = 2;
  }

  let starNum = (startStarNum - mIdx) % 9;
  if (starNum <= 0) starNum += 9;

  return NINE_STARS[starNum - 1];
}

// 4. 傾斜宮
function getKeishaGyu(honmeiStar, getsumeiStar) {
  const honmeiNum = NINE_STARS.indexOf(honmeiStar) + 1;
  const getsuNum = NINE_STARS.indexOf(getsumeiStar) + 1;

  const step = (getsuNum - honmeiNum + 9) % 9;
  const gyuNum = ((step + 4) % 9) + 1;

  const gyuMap = {
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

// 5. 日命星（日家九星）
function getNichimeiStar(year, month, day) {
  // 1986-04-25 (己亥) は「八白土星」
  const BASE_UTC = Date.UTC(1986, 3, 25);
  const BASE_STAR = 8; // 八白土星
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - BASE_UTC) / 86400000);

  // 冬至・夏至による陽遁・陰遁切替
  // 夏至: およそ6月21日頃, 冬至: およそ12月22日頃
  // 1986-04-25 は冬至〜夏至の陽遁期（順行: +1/日）
  // 任意の日付に対して、直近の二至（冬至・夏至）を基準として陽遁・陰遁を判定
  function getSolstice(y) {
    const sDay = Math.floor(22.2028 + 0.2427404 * (y - 1900) - Math.floor((y - 1900) / 4));
    const wDay = Math.floor(22.6587 + 0.2427404 * (y - 1900) - Math.floor((y - 1900) / 4));
    return {
      summer: Date.UTC(y, 5, sDay),
      winter: Date.UTC(y, 11, wDay)
    };
  }

  // 干支番号 (1986-04-25 = 35: 己亥)
  const eto = ((35 + diffDays) % 60 + 60) % 60;

  // 甲子日（eto === 0）
  function getNearestKoshiUTC(solsticeUTC) {
    const sDiff = Math.round((solsticeUTC - BASE_UTC) / 86400000);
    const sEto = ((35 + sDiff) % 60 + 60) % 60;
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

  // 1986-04-25 において targetUTC === BASE_UTC のとき:
  // 陽遁期間中で BASE_UTC からの差分で順行
  // 基準日 1986-04-25 が 8 であるため、同陽遁期内の計算:
  if (isYang) {
    // 陽遁: 1日+1
    let star = ((BASE_STAR - 1 + (diffDays % 9) + 9) % 9) + 1;
    return NINE_STARS[star - 1];
  } else {
    // 陰遁: 1日-1
    // currSummer での切り替え時
    const diffFromSummer = Math.round((targetUTC - currSummer) / 86400000);
    // 夏至甲子は九紫(9)から陰遁
    let star = ((9 - 1 - (diffFromSummer % 9) + 18) % 9) + 1;
    return NINE_STARS[star - 1];
  }
}

// 6. 令翠学の宿星（令星）
function getReisuiStar(year, month, day) {
  // 日干支から運命数を計算 (1986-04-25 は 運命数26)
  const baseUTC = Date.UTC(1986, 3, 25);
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
  
  // 1986-04-25 の運命数は 26 (1〜60)
  let unmeiSu = ((26 - 1 + diffDays) % 60 + 60) % 60 + 1;

  // 生年が偶数年か奇数年か
  const isEvenYear = (year % 2 === 0);
  
  // 令翠学の6令星マップ:
  // 1-10: 土星 / 天星
  // 11-20: 金星 / 小星
  // 21-30: 火星 / 冥星
  // 31-40: 月星 / 魚星
  // 41-50: 木星 / 海星
  // 51-60: 水星 / 氷星
  let star = "";
  let subStar = "";
  let yinYang = isEvenYear ? "陽令星" : "陰令星";

  if (unmeiSu >= 1 && unmeiSu <= 10) {
    star = isEvenYear ? "土星" : "天星";
    subStar = isEvenYear ? "天星" : "土星";
  } else if (unmeiSu >= 11 && unmeiSu <= 20) {
    star = isEvenYear ? "金星" : "小星";
    subStar = isEvenYear ? "小星" : "金星";
  } else if (unmeiSu >= 21 && unmeiSu <= 30) {
    star = isEvenYear ? "火星" : "冥星";
    subStar = isEvenYear ? "冥星" : "火星";
  } else if (unmeiSu >= 31 && unmeiSu <= 40) {
    star = isEvenYear ? "月星" : "魚星";
    subStar = isEvenYear ? "魚星" : "月星";
  } else if (unmeiSu >= 41 && unmeiSu <= 50) {
    star = isEvenYear ? "木星" : "海星";
    subStar = isEvenYear ? "海星" : "木星";
  } else {
    star = isEvenYear ? "水星" : "氷星";
    subStar = isEvenYear ? "氷星" : "水星";
  }

  return { star, subStar, yinYang, unmeiSu };
}

// 7. 十二運星の正確な計算
function getTwelveFate(dayStem, dayBranch) {
  // 日干と日支から十二運を求める
  const STEM_ORDERS = {
    "甲": 1, // 亥から長生
    "乙": 6, // 午から長生 (逆行)
    "丙": 2, // 寅から長生
    "丁": 7, // 酉から長生 (逆行)
    "戊": 2, // 寅から長生
    "己": 7, // 酉から長生 (逆行)
    "庚": 8, // 巳から長生
    "辛": 1, // 子から長生 (逆行)
    "壬": 11,// 申から長生
    "癸": 4  // 卯から長生 (逆行)
  };
  // 己亥の十二運: 胎
  const FATES = ["長生", "沐浴", "冠帯", "建禄", "帝旺", "衰", "病", "死", "墓", "絶", "胎", "養"];
  // 己（陰土）: 長生は酉(9), 沐浴は申(8)... 亥(11)は 胎
  const stem = dayStem;
  const branchIdx = TWELVE_BRANCHES.indexOf(dayBranch); // 亥=11
  
  const FATE_MAP = {
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
  const list = FATE_MAP[stem] || FATES;
  return list[branchIdx];
}

// 8. 中心星（通変星）の正確な計算
function getCenterStar(dayStem, monthBranch) {
  // 月支の蔵干本気
  const BRANCH_MAIN_STEM = {
    "子": "癸", "丑": "己", "寅": "甲", "卯": "乙",
    "辰": "戊", "巳": "丙", "午": "丁", "未": "己",
    "申": "庚", "酉": "辛", "戌": "戊", "亥": "壬"
  };
  const targetStem = BRANCH_MAIN_STEM[monthBranch] || "戊";
  
  // 日干から targetStem を見た通変星
  const STEM_RELATIONS = {
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

// 実行検証
console.log("=== 1986-04-25 検証結果 ===");
const pillars = getPillar(1986, 4, 25);
console.log("四柱推命 柱:", pillars);
console.log("日干:", pillars.day.charAt(0));
console.log("十二運星:", getTwelveFate(pillars.day.charAt(0), pillars.day.charAt(1)));
console.log("中心星:", getCenterStar(pillars.day.charAt(0), pillars.month.charAt(1)));

const honmei = getHonmeiStar(1986, 4, 25);
const getsumei = getGetsumeiStar(honmei, 4, 25);
const nichimei = getNichimeiStar(1986, 4, 25);
const keisha = getKeishaGyu(honmei, getsumei);
console.log("\n九星気学:");
console.log("本命星:", honmei);
console.log("月命星:", getsumei);
console.log("日命星:", nichimei);
console.log("傾斜宮:", keisha.name, keisha.meaning);

const reisui = getReisuiStar(1986, 4, 25);
console.log("\n令翠学:");
console.log("令星:", reisui.star);
console.log("サブ星:", reisui.subStar);
console.log("陰陽:", reisui.yinYang);
console.log("運命数:", reisui.unmeiSu);
