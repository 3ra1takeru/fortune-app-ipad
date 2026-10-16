const http = require('http');
const querystring = require('querystring');

// 日干支番号（1〜60）の計算
function getSexagenaryDayNumber(year, month, day) {
  const baseUTC = Date.UTC(1986, 3, 25); // 1986-04-25 is 己亥 = 36
  const targetUTC = Date.UTC(year, month - 1, day);
  const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
  return ((36 - 1 + diffDays) % 60 + 60) % 60 + 1;
}

async function testReisui(y, m, d) {
  const postData = querystring.stringify({
    y: String(y),
    m: String(m).padStart(2, '0'),
    d: String(d).padStart(2, '0')
  });

  return new Promise((resolve) => {
    const req = http.request('http://www.reisui.jp/syukusei.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const decoder = new TextDecoder('shift_jis');
        const text = decoder.decode(buf);
        const match = text.match(/color:#ff8099;\">([^<]+)<\/li>/);
        resolve(match ? match[1].trim() : 'NOT_FOUND');
      });
    });
    req.on('error', (e) => resolve('ERROR: ' + e.message));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const dates = [
    [1986, 4, 25],
    [1987, 4, 25],
    [1985, 4, 25],
    [1980, 1, 1],
    [1990, 7, 7],
    [1971, 5, 29],
    [1986, 1, 1],
    [1986, 2, 1],
    [1986, 3, 1],
    [2000, 10, 10],
    [1995, 8, 15],
    [1965, 12, 3]
  ];

  for (const [y, m, d] of dates) {
    const dayNum = getSexagenaryDayNumber(y, m, d);
    const star = await testReisui(y, m, d);
    console.log(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')} (dayNum=${dayNum}): ${star}`);
    await new Promise(r => setTimeout(r, 200));
  }
}

run();
