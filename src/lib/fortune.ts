export interface FortuneResult {
  fourPillars: {
    year: string;
    month: string;
    day: string;
    nature: string;
  };
  nineStar: string;
  timing: Array<{
    month: string;
    romance: '◎' | '◯' | '△' | '✕';
    work: '◎' | '◯' | '△' | '✕';
    family: '◎' | '◯' | '△' | '✕';
    marriage: '◎' | '◯' | '△' | '✕';
    health: '◎' | '◯' | '△' | '✕';
  }>;
}

const tenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const twelveBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const nineStars = ['一白水星', '二黒土星', '三碧木星', '四緑木星', '五黄土星', '六白金星', '七赤金星', '八白土星', '九紫火星'];

export function calculateFortune(birthdate: string, name: string): FortuneResult {
  const date = new Date(birthdate);
  if (isNaN(date.getTime())) {
      date.setTime(Date.now());
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yearIndex = Math.abs(year - 4) % 60;
  const yearPillar = tenStems[yearIndex % 10] + twelveBranches[yearIndex % 12];
  
  const monthPillar = tenStems[(month * 2) % 10] + twelveBranches[month % 12];
  const dayPillar = tenStems[(day * 3) % 10] + twelveBranches[(day * 4) % 12];

  let baseStar = 11 - (year % 9);
  if (baseStar > 9) baseStar -= 9;
  if (baseStar === 0) baseStar = 9;
  const nineStar = nineStars[baseStar - 1];

  const natures = [
    '大らかで人を包み込む優しさを持つ',
    '情熱的で行動力があり、リーダーシップを発揮する',
    '知的で冷静、物事を深く分析する',
    '協調性が高く、人との和を大切にする',
    '自由奔放で、型にはまらない魅力がある',
    '誠実で忍耐強く、目標に向かってコツコツ努力する',
    '直感力に優れ、クリエイティブな才能を持つ'
  ];
  
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const natureIndex = (year + month + day + charCodeSum) % natures.length;

  const marks = ['◎', '◯', '△', '✕'];
  const timing = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const m = `${d.getFullYear()}年${d.getMonth() + 1}月`;

    return {
      month: m,
      romance: marks[(year + i + charCodeSum + 1) % 4] as any,
      work: marks[(month + i + charCodeSum + 2) % 4] as any,
      family: marks[(day + i + charCodeSum + 3) % 4] as any,
      marriage: marks[(year + month + i + charCodeSum) % 4] as any,
      health: marks[(year + day + i + charCodeSum) % 4] as any,
    }
  });

  return {
    fourPillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      nature: natures[natureIndex]
    },
    nineStar,
    timing
  };
}
