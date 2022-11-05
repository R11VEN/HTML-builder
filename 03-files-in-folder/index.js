const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      const dir = path.join(secretFolder, `${file}`);
      fs.stat(dir, (error, stats) => {
        if (error) {
          console.log(error);
        } else if (stats.isFile()) {
          const fileProp = path.parse(dir);
          console.log(`${fileProp.name} - ${fileProp.ext.slice(1)} - ${(stats.size / 1024).toFixed(3)} Кбайт`);
        }
      });
    })
  }
});
