var fs = require("fs");
var request = require("request");

module.exports.status =  function (jobID, cb) {
  const token = process.env.AUTH0_MANAGEMENT_TOKEN;

  var options = {
    method: 'GET',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/jobs/${jobID}/errors`,
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'multipart/form-data',
      'authorization': 'Bearer ' + token
    }
  };
  
  request(options, function (error, response, body) {
    if (error){
      cb(error);
    }

    if (body) {
      cb(null, JSON.parse(body));
    } else {
      cb("Error, while getting status information");
    }  
  });
}