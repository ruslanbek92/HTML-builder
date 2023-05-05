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
           deleteFiles('./04-copy-directory/copy-files')
           .then(() => {
            fs.promises.readdir(`./04-copy-directory/files`)
            .then((files)=>{
            async function copyFiles(){
                for(let i = 0; i < files.length; i++) {
                    await fs.promises.copyFile(`./04-copy-directory/files/${files[i]}`,`./04-copy-directory/copy-files/${files[i]}`); 
                }
            }
            copyFiles(); 
            })
            .catch(()=>{console.log('error in reading files')})
            
           }
           
           );
        
     }
    )
    .catch(()=>{console.log('error')});
})
