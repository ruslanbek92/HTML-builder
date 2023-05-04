const fs = require('fs');
const { stdin, stdout } = require('process');

fs.open('./02-write-file/text.txt', 'w',  (err)=>{
if(err) throw err;
stdout.write(' plase enter text:');
});

stdin.on('data', (data)=>{
   if(data.toString().trim() === 'exit'){
    stdout.write('Bye!')
    process.exit()
   }
    fs.appendFile('./02-write-file/text.txt', data.toString(), ()=>{console.log('text  is written!')});
})

process.on('SIGINT', () => {
    stdout.write('Bye!')
    process.exit();
});