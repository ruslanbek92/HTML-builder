const fs = require('fs');
const path = require('path');

const readable = fs.createReadStream('./06-build-page/template.html');
let templStr = ''

readable.on('data',(data) => {
  templStr += data.toString();
});

fs.readdir('./06-build-page/components', {withFileTypes: true}, (err, files)=>{
    if (err) console.error(err);
   const arr = [];
   async function readFiles(files) {
     for (let i = 0; i < files.length; i++) {
        const obj = {};
        obj.name = files[i].name.slice(0, files[i].name.lastIndexOf('.'));
        obj.content = (await  fs.promises.readFile(`./06-build-page/components/${files[i].name}`)).toString();
        arr.push(obj);
    }

   }
    readFiles(files)
     .then(()=>{
      for (let i = 0; i < arr.length; i++) {
        templStr = templStr.replace(`{{${arr[i].name}}}`, arr[i].content);
       }

       fs.promises.mkdir('./06-build-page/project-dist', {recursive:true})
       .then(() => {
        fs.writeFile('./06-build-page/project-dist/index.html', templStr, ()=>{'writing finished!'});
        }

       ).catch(()=>{console.log('error in creating a directory!')});
       
// merge styles       
       fs.readdir('./06-build-page/styles',{withFileTypes:true}, (err, files)=>{
        if (err) return console.error(err); 
        files = files.filter((el) => (el.isFile() && path.extname(el.name)==='.css'));
        const arr = [];
    
        async function readFile(files) {
        for (let i = 0; i < files.length; i++) {
       
        let data = await  fs.promises.readFile(`./06-build-page/styles/${files[i].name}`);
        arr.push(data.toString());
        
        }
    }
        readFile(files)
        .then(() => {
            async function writeFile(array) {
                for (let i = 0; i < array.length; i++) {
                    await fs.promises.appendFile('./06-build-page/project-dist/style.css',array[i]);
                    }
               }
            fs.access('./06-build-page/project-dist/style.css', (err) => {
                if(!err) {
                    fs.unlink(`./06-build-page/project-dist/style.css`, ()=>{
                      writeFile(arr).then(console.log());
                    })
                } 
    
                writeFile(arr);
               
            })
           
        
        });   
        
    
        
    });
//  copy assets
    fs.mkdir('./06-build-page/project-dist/assets', {recursive:true}, (err)=>{
        if(err)return console.error(err.message);
        fs.promises.readdir('./06-build-page/project-dist/assets', {withFileTypes:true}).then((files)=>{
            async function delFilesAndDirs(arr){
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].isFile()) {
                    await fs.promises.unlink(`./06-build-page/project-dist/assets/${arr[i].name}`);
                    } else {
                     await fs.promises.rmdir(`./06-build-page/project-dist/assets/${arr[i].name}`, {recursive:true})   
                    }  
                }
            }

            delFilesAndDirs(files)
            .then(()=>{
                 async function copyRecursively(src, dest) {
                    fs.promises.readdir(src, {withFileTypes:true})
                    .then(async (files) =>{
                        console.log('files', files);
                        for (let i = 0; i < files.length; i++) {
                            if (files[i].isFile()) {
                                console.log('is file ');
                                 await fs.promises.copyFile(`${src}/${files[i].name}`, `${dest}/${files[i].name}`)
                                .then(() => {
                                    console.log('file copied!', `${dest}/${files[i].name}`)
                                    return;
                                });
                                
                            } else {
                             await  fs.promises.mkdir(`${dest}/${files[i].name}`)
                              .then(async ()=>{
                                console.log('dir  created !', `${dest}/${files[i].name}`)
                               await copyRecursively(`${src}/${files[i].name}`, `${dest}/${files[i].name}`);
                              });  
                            }
                            
                        }
                    });
                }
               copyRecursively(`./06-build-page/assets`, './06-build-page/project-dist/assets');
            });
        }
        )
        .catch(()=>{console.log('error')});
    })
     });

    
});
