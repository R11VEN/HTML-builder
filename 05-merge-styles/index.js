const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'styles');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const { stdout } = process;

fs.readdir(folder, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach(file => {
      const dir = path.join(folder, `${file}`);
      const input = fs.createReadStream(dir, 'utf-8');
      fs.stat(dir, (error, stats) => {
        const fileProp = path.parse(dir);
        if (error) {
          console.log(error);
        } else if (fileProp.ext === '.css' && stats.isFile()) {
          let data = '';
          input.on('data', chunk => data += chunk);
          input.on('end', () => output.write(data + '\n'));
        }
      })
    });
  }
});

process.on('exit', () => stdout.write('Finising!'));
