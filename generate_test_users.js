var dotenv          = require('dotenv');
dotenv.load();

var mkdirp     = require('mkdirp');
var fs         = require('fs');
var getDirName = require('path').dirname;

var userCount  = process.env.USER_CNT_FOR_AN_IMPORT_FILE || 1000;
var fileCount  = process.env.IMPORT_FILE_CNT || 10;

console.log("user count: " + userCount);
console.log("file count: " + fileCount);

function writeFile(path, contents, cb) {
  mkdirp(getDirName(path), function (err) {
    if (err) return cb(err);
    fs.writeFileSync(path, contents, cb);
  });
}

for ( let file_id = 1; file_id <= fileCount; file_id++ ) {
  let users = [];
  var indexStart = userCount * file_id;
  var indexEnd = userCount * (file_id + 1);

  for (let index = indexStart; index < indexEnd; index++) {
    users.push({
    "email": `johnfoo-new-${index}@sample.com`,
    "email_verified": false,
    "app_metadata": { "webUserId": `${index}`, "customerData": { "partyId": `${index}`, "preferred": false } },
    "user_metadata": {
      "title": "",
      "firstName": `johnbaz-new-${index}`,
      "lastName": `johnbar-new-${index}`,
      "name": `johnfoo-new-${index}`,
      "optedOut": false,
      "newUser": false
    }
    });
  }   
  writeFile(`./test_users/users-${file_id}.json`, JSON.stringify(users, null, 2));
}  

