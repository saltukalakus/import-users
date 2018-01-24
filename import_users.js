var fs = require("fs");
var request = require("request");

module.exports.import =  function (file, cb) {
  const token = process.env.AUTH0_MANAGEMENT_TOKEN;

  var options = {
    method: 'POST',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/users-imports`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data',
      'authorization': 'Bearer ' + token
    },
    formData: {
      users: {
        value: fs.createReadStream(file),
        options: {
          contentType: null
        }
      },
      connection_id: `${process.env.AUTH0_CONNECTION}`,
      send_completion_email: 'false',
      upsert: 'false'
    }
  };
  
  request(options, function (error, response, body) {
    if (error){
      cb(error);
    }

    var body = JSON.parse(body)
    if (body.id) {
      cb(null, body.id);
    } else {
      cb("Job ID missing");
    }  
  });
}

