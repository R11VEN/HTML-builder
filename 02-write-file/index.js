const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const { stdin, stdout } = process;
stdout.write('Привет! Введите текст и нажмите Enter для записи в файл. Для выхода введите exit или нажмите Ctrl + C.\n');

stdin.on('data', data => {
  let dataStringified = data.toString().trim();
  if (dataStringified == 'exit') {
    process.exit();
  } else {
    output.write(data);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Удачи!'));
process.on('error', error => console.log('Error', error.message));