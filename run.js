var dotenv          = require('dotenv');
dotenv.load();

var colors          = require('colors');
var mkdirp          = require('mkdirp');
var fs              = require('fs');

var importUsers     = require('./import_users');
var checkJobStatus  = require('./check_job_status');
var checkJobErrors  = require('./check_job_errors.js');
var winston         = require('winston');

mkdirp.sync('./diagnose')

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({filename: './diagnose/logs.log', flags: 'a'})
    ]
});

function pollingStatus(jobID) {
  checkJobStatus.status(jobID, function(error, resp){
    if (error){
      console.log('error', JSON.stringify(error, null, 2).red);
      logger.error(JSON.stringify(error));
      process.exit();
    }

    if (resp.status === "completed") {
        logger.info(JSON.stringify(resp));
        checkImportErrors(jobID);
    } else {
        setTimeout(pollingStatus, process.env.JOB_POLLING_INTERVAL_IN_SEC * 1000, jobID);
    }
  });
}

function checkImportErrors(jobID){
  checkJobErrors.status(jobID,function(error, resp){
    if (error){
      console.log('error', JSON.stringify(error, null, 2).red);
      logger.error(error);
      process.exit();
    }
    logger.info("===== check import errors ======");
    logger.info(JSON.stringify(resp));


  })
}

if (process.argv.length !== 3)
{
  logger.error("Pass full path to user object");
  process.exit();
}

var fileName = process.argv[2];
console.log(fileName);
importUsers.import(fileName, function (error, jobID){
  if (error){
    console.log('error', JSON.stringify(error, null, 2).red);
    logger.error(JSON.stringify(error));
    process.exit();
  }
  logger.info("File name: " + fileName);
  logger.info("JobID: " + jobID);
  logger.info("=======================")
  pollingStatus(jobID);
});

