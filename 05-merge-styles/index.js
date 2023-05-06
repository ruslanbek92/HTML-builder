const fs = require('fs');
const path = require('path');



fs.readdir('./05-merge-styles/styles',{withFileTypes:true}, (err, files)=>{
    if (err) return console.error(err); 
    files = files.filter((el) => (el.isFile() && path.extname(el.name)==='.css'));
    const arr = [];

    async function readFile(files) {
    for (let i = 0; i < files.length; i++) {
   
    let data = await  fs.promises.readFile(`./05-merge-styles/styles/${files[i].name}`);
    arr.push(data.toString());
    
    }
}
    readFile(files)
    .then(() => {
        async function writeFile(array) {
            for (let i = 0; i < array.length; i++) {
                await fs.promises.appendFile('./05-merge-styles/project-dist/bundle.css',array[i]);
                }
           }
        fs.access('./05-merge-styles/project-dist/bundle.css', (err)=>{
            if(!err) {
                fs.unlink(`./05-merge-styles/project-dist/bundle.css`, ()=>{
                  writeFile(arr).then(console.log());
                })
            } 

            writeFile(arr);
           
        })
       
    
    });   
    

    
});