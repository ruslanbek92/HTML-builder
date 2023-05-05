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
     }
    )
    .catch(()=>{console.log('error')});
})
