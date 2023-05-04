
const fs = require('fs');

fs.mkdir('./04-copy-directory/copy-files', {recursive:true}, (err)=>{
    if(err)return console.error(err.message);
    fs.promises.readdir('./04-copy-directory/copy-files').then(
     (files) => {
     
        const deleteFiles= async (dir)=>{
            for (let i = 0; i < files.length; i++) {
             await fs.promises.unlink(`${dir}/${files[i]}`);
            }
           }
           deleteFiles('./04-copy-directory/copy-files');

           fs.readdir('./04-copy-directory/files', (err, files)=>{
            if(err)console.error(err.message);
            files.forEach(el=> {
            fs.promises.copyFile(`./04-copy-directory/files/${el}`,`./04-copy-directory/copy-files/${el}`).then(()=>{console.log('file copied')}).catch(console.log('error in copying'));
                   })
           })
     }
    )
    .catch(()=>{console.log('error')});
})