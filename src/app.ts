import express, { Application } from 'express';
import cors from 'cors';
const sns = require("aws-sdk/clients/sns");

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
    const params = {
      Message: message,
      MessageStructure: 'string',
      PhoneNumber: PhoneNumber
    };

    const snsClient = new sns({
      region: region,
      Credential : {accessKeyId: "<key>", secretAccessKey: "<privkey>" }
    });

    snsClient.publish(params, (err:any,data:string) => {
      if(err) console.log(err)
      console.log(data)
      res.status(200).send(data);
    });
  
  })
