// 令翠学の計算ロジック検証スクリプト
function getReisuiInfo(year, month, day) {
  // 日干支番号（1〜60）の計算
  // 1986-04-25 は 己亥 = 36番
  const baseUTC = Date.UTC(1986, 3, 25);
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
  const unmeiSu = ((36 - 1 + diffDays) % 60 + 60) % 60 + 1;
  const isEvenYear = (year % 2 === 0);

  let star = "";
  let subStar = "";
  let reiStar = "";
  let reiBranch = 0; // 子=0, 丑=1, 寅=2, 卯=3, 辰=4, 巳=5, 午=6, 未=7, 申=8, 酉=9, 戌=10, 亥=11

  if (unmeiSu >= 1 && unmeiSu <= 10) {
    reiStar = "土令星";
    reiBranch = 10; // 戌
    star = isEvenYear ? "土星" : "天令星";
    subStar = isEvenYear ? "天令星" : "土星";
  } else if (unmeiSu >= 11 && unmeiSu <= 20) {
    reiStar = "金令星";
    reiBranch = 8; // 申
    star = isEvenYear ? "金星" : "小令星";
    subStar = isEvenYear ? "小令星" : "金星";
  } else if (unmeiSu >= 21 && unmeiSu <= 30) {
    reiStar = "火令星";
    reiBranch = 6; // 午
    star = isEvenYear ? "火星" : "冥令星";
    subStar = isEvenYear ? "冥令星" : "火星";
  } else if (unmeiSu >= 31 && unmeiSu <= 40) {
    reiStar = "月令星";
    reiBranch = 4; // 辰
    star = isEvenYear ? "月星" : "魚令星";
    subStar = isEvenYear ? "魚令星" : "月星";
  } else if (unmeiSu >= 41 && unmeiSu <= 50) {
    reiStar = "木令星";
    reiBranch = 2; // 寅
    star = isEvenYear ? "木星" : "海令星";
    subStar = isEvenYear ? "海令星" : "木星";
  } else {
    reiStar = "水令星";
    reiBranch = 0; // 子
    star = isEvenYear ? "水星" : "氷令星";
    subStar = isEvenYear ? "氷令星" : "水星";
  }

  const yinYang = isEvenYear ? "陽令星" : "陰令星";

  // 12運命周期テーブル
  const REISUI_CYCLES = [
    { name: "令", season: "冬", score: 60, desc: "運気のリセット期。直感とインスピレーションが高まる精神的転換点。" },
    { name: "精算", season: "冬", score: 50, desc: "冬の大掃除期。不要な執着やしがらみを手放し、次の春への準備を整える年。" },
    { name: "開拓", season: "春", score: 85, desc: "春の始まり。新しい種を蒔き、未来への果敢な挑戦をスタートさせる飛躍の年！" },
    { name: "生長", season: "春", score: 88, desc: "新芽がぐんぐんと伸びる成長期。蒔いた種が形になり勢いが加速する時。" },
    { name: "決定", season: "春", score: 92, desc: "春の頂点。進路や目標を一本に絞り込み、確固たる決断を下す最重要の年。" },
    { name: "健康", season: "夏", score: 70, desc: "小休止期。体調管理や生活リズムを整え、夏のピークに向けて活力を養う時。" },
    { name: "人気", season: "夏", score: 95, desc: "人気と人望の最高潮！これまでの努力が脚光を浴び、絶大な支持を得る大吉年。" },
    { name: "油断", season: "夏", score: 65, desc: "絶好調ゆえの慢心に注意。冷静な判断と周囲への感謝を忘れないことが肝心。" },
    { name: "再開", season: "秋", score: 82, desc: "秋の始まり。諦めていた夢や過去の経験に再挑戦し、見事に復活を遂げる年。" },
    { name: "経済", season: "秋", score: 90, desc: "実利の収穫期。具体的な金運や資産、ビジネスでの大きな成果を手にする時。" },
    { name: "充実", season: "秋", score: 96, desc: "人生の集大成・大願成就！最高の達成感と豊かさを享受する大収穫の年。" },
    { name: "背信", season: "冬", score: 45, desc: "冬の入り口。予期せぬ裏切りや予定の狂いに注意し、守りに徹して静観する時。" }
  ];

  // 年の十二支 (2024=辰:4, 2025=巳:5, 2026=午:6, 2027=未:7, ...)
  // (year - 4) % 12
  const getYearStage = (targetYear) => {
    const yearBranch = ((targetYear - 4) % 12 + 12) % 12;
    const cycleIndex = (yearBranch - reiBranch + 12) % 12;
    return REISUI_CYCLES[cycleIndex];
  };

  return {
    unmeiSu,
    star,
    subStar,
    reiStar,
    yinYang,
    lastYear: { year: 2025, ...getYearStage(2025) },
    thisYear: { year: 2026, ...getYearStage(2026) },
    nextYear: { year: 2027, ...getYearStage(2027) }
  };
}

const res = getReisuiInfo(1986, 4, 25);
console.log("=== 1986/4/25 男性 令翠学鑑定 ===");
console.log("運命数:", res.unmeiSu);
console.log("宿星 (主星):", res.star);
console.log("裏星 (陰陽ペア):", res.subStar);
console.log("令星グループ:", res.reiStar);
console.log("陰陽区分:", res.yinYang);
console.log("\n2025年(去年):", res.lastYear.name, `【${res.lastYear.season}】`, res.lastYear.desc);
console.log("2026年(今年):", res.thisYear.name, `【${res.thisYear.season}】`, res.thisYear.desc);
console.log("2027年(来年):", res.nextYear.name, `【${res.nextYear.season}】`, res.nextYear.desc);
