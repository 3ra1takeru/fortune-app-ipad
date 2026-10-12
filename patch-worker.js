const fs = require('fs');
const path = require('path');

const workerPath = path.join(__dirname, '.open-next', 'worker.js');
if (fs.existsSync(workerPath)) {
  let content = fs.readFileSync(workerPath, 'utf8');
  
  // Just find "Unexpected loadManifest" and try to replace that specific throw statement
  const targetStr = 'throw new Error(`Unexpected loadManifest(${path2}) call!`)';
  
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, 'return {}');
    fs.writeFileSync(workerPath, content);
    console.log('Successfully patched worker.js');
  } else {
    // try to match using index
    const idx = content.indexOf('Unexpected loadManifest');
    if (idx !== -1) {
       console.log('Found string but exact match failed. Surrounding text:', content.substring(idx - 50, idx + 50));
    } else {
       console.log('Not found at all');
    }
  }
} else {
  console.log('worker.js not found');
}
