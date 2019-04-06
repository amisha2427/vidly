const bcrypt = require('bcrypt');

var password = '123abc!';

async function run(){
const salt = await bcrypt.genSalt(10);
const hashed = await bcrypt.hash(password,salt);
console.log(salt);
console.log(hashed);
}

run();