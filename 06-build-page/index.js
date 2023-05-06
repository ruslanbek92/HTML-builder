const fs = require('fs');
const path = require('path');

const readable = fs.createReadStream('./06-build-page/template.html');
let templStr = ''

readable.on('data',(data) => {
  templStr += data.toString(); 
});

readable.on('end', ()=> {

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

       fs.promises.mkdir('./06-build-page/project-dist')
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
        fs.promises.readdir('./06-build-page/project-dist/assets').then(
         (files) => {
            const deleteFiles= async (dir)=>{
                for (let i = 0; i < files.length; i++) {
                 await fs.promises.unlink(`${dir}/${files[i]}`);
                }
            }
               deleteFiles('./06-build-page/project-dist/assets')
               .then(() => {
                fs.promises.readdir(`./06-build-page/assets`)
                .then((files)=>{
                async function copyFiles(){
                    for(let i = 0; i < files.length; i++) {
                        await fs.promises.copyFile(`./06-build-page/assets/${files[i]}`,`./06-build-page/project-dist/assets/${files[i]}`); 
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
       

     });

    
});