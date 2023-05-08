const fs = require('fs');

fs.readdir('./03-files-in-folder/secret-folder',{withFileTypes:true}, (err, files) => {
  if(err) throw err; 
  const arr = [];
  files = files.filter(el => el.isFile());
  files.forEach(el =>{
    let obj = {};
    obj.fileName=el.name.slice(0, el.name.lastIndexOf('.'));
    obj.extension=el.name.slice(el.name.lastIndexOf('.')+1);
    arr.push(obj);
  });

  for (let i = 0; i < files.length; i++) {
    fs.stat(`./03-files-in-folder/secret-folder/${files[i].name}`,(err, stats)=>{
      arr[i].size = stats.size;
      console.log(`${arr[i].fileName}-${arr[i].extension}-${arr[i].size}`);
    }); 
  }
} );