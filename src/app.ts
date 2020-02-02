import express, { Application } from 'express';
import cors from 'cors';
import * as aws from 'aws-sdk'
aws.config.update({accessKeyId: "<key>", secretAccessKey: "<privkey>" })
class App {
    public application: Application;
    constructor() {
      this.application = express();
    }
  }

  const app = new App().application;

  app.use(cors());
  app.all('/*', function(req, res, next) {
  
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });

  app.listen(3000,() => {
    console.info('✅ Start amazonSNS SMS example server✅');
  })

  app.post('/',async function(req, res){
    const message:string = req.query.message;
    const PhoneNumber:string = req.query.phonenumber;
    const region:string = req.query.region;
    if(!message){
      console.log("no message")
    }
    if(!PhoneNumber){
      console.log("no phonenumber")
    }
    if(!region){
      console.log("no region")
    }
    aws.config.update({region: region});
    const params = {
      attributes: {
        'DefaultSMSType': 'Transactional'
      },
      Message: message,
      MessageStructure: 'string',
      PhoneNumber: PhoneNumber
    };
    const publishTextPromise = new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    publishTextPromise.then(
      function(data) {
        console.log("MessageID is " + data.MessageId);
        res.status(200).send(data);
      }).catch(
        function(err) {
        console.error(err, err.stack);
        res.status(500).send(err);
      });
  
  })
