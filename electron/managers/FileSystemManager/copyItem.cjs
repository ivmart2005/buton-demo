const fs = require('fs');
const path = require('path');

const copyItem = async (src, dest) => {
  let finalDest = dest;

  // если файл с таким еж именем существует
  if (fs.existsSync(dest)) {
    const extension = path.extname(dest);
    const name = path.basename(dest, extension);
    const dir = path.dirname(dest);
    // перебор: "... - копия (1)", "... - копия (2)"
    let copy_number = 1;
    finalDest = path.join(dir, `${name} — копия${extension}`);
    while (fs.existsSync(finalDest)) {
      finalDest = path.join(dir, `${name} — копия (${copy_number})${extension}`);
      copy_number++;
    }
  }
  // копирование
  fs.cpSync(src, finalDest, { recursive: true, force: false });
  return finalDest;
};

module.exports = copyItem;