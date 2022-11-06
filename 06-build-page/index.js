const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
  if (err) throw err;
  console.log('Папка была создана!');
});

const folderDes = path.join(__dirname, 'project-dist');
const folderStyles = path.join(__dirname, 'styles');
const folderComp = path.join(__dirname, 'components');
const outputCss = fs.createWriteStream(path.join(folderDes, 'style.css'));
const assets = path.join(__dirname, 'assets');
const assetsFolderDes = path.join(folderDes, 'assets');

function getStyles() {
  fs.readdir(folderStyles, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        const dir = path.join(folderStyles, file.name);
        const fileProp = path.parse(dir);
        if (file.isFile() && fileProp.ext === '.css') {
          const input = fs.createReadStream(dir, 'utf-8');
          let data = '';
          input.on('data', chunk => data += chunk);
          input.on('end', () => outputCss.write(data + '\n'));
        }
      });
    }
  });
}

getStyles ();

function getIndex() {
  let data = '';
  const inputIndex = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  inputIndex.on('data', chunk => data += chunk);
  inputIndex.on('end', () => {
    fs.readdir(folderComp, {withFileTypes: true}, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          let compData = '';
          const dir = (path.join(folderComp, file.name));
          const fileProp = path.parse(dir);
          if(file.isFile() && fileProp.ext === '.html') {
            const inputComp = fs.createReadStream(dir, 'utf-8');
            const outputHtml = fs.createWriteStream(path.join(folderDes, 'index.html'));
            inputComp.on('data', chunk => compData += chunk);
            inputComp.on('end', () => {
              data = data.replace(`{{${fileProp.name}}}`, compData);
              outputHtml.write(data);
            });
            inputComp.on('error', error => console.log(error));
          }
        });
      }
    });
  });
  inputIndex.on('error', error => console.log(error));
}

getIndex();

function getAssets(assets, assetsFolderDes) {
  fs.rm(assetsFolderDes, { force: true, recursive: true }, err => {
    if (err) console.log(err);
    fs.mkdir(assetsFolderDes, { recursive: true }, err => {
      if (err) console.log(err);
    });
    fs.readdir(assets, {withFileTypes: true}, (err, files) => {
      if (err) {
        console.log(err);
      } else {
        files.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(assets, file.name), path.join(assetsFolderDes, file.name), err => {
              if (err) console.log(err);
            });
          } else if (file.isDirectory()) {
            getAssets(path.join(assets, file.name), path.join(assetsFolderDes, file.name));
          }
        });
      }
    });
  });
}

getAssets(assets, assetsFolderDes);
