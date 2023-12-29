var express=require("express");
var bodyParser=require('body-parser');
var router = express.Router();
var multer = require("multer");

var app = express();
app.use(express.json());
//app.use(multer().array()); 
const path = require('path');



var login                  = require('./controllers/login');
var registration_check     = require('./controllers/registration_check'); // send otp for consumer  registration
var registration           = require('./controllers/registration'); //Add registered data into user table
var get_vehicle_details    = require('./controllers/get_vehicle_details');//get vehicle details  for DASHBOARD SERVICE
var get_user_details    = require('./controllers/get_user_details');// for showing profile information
var get_apk_version = require('./controllers/get_apk_version');
var get_state  = require('./controllers/get_state'); // for state dropdown in add service page
var get_city  = require('./controllers/get_city'); //for city dropdown in add service page
var get_dealer  = require('./controllers/get_dealer'); //for dealer dropdown in add service page
var get_vehicle_details2_consumer  = require('./controllers/get_vehicle_details2_consumer'); //for vehicle no dropdown in add service page
var add_service_details  = require('./controllers/add_service_details'); // add service deails to vehicle_servvice table
var list_service_details  = require('./controllers/list_service_details'); // after add vehicle_service, list out the service details
var add_complaint_consumer  = require('./controllers/add_complaint_consumer'); //for vehicle no dropdown in add service page
var list_complaint_details  = require('./controllers/list_complaint_details'); // list the complaint
var change_password_consumer  = require('./controllers/change_password_consumer'); // change password
//var test_mail  = require('./controllers/test_mail'); // test_mail
var update_consumer_feedback  = require('./controllers/update_consumer_feedback'); // test_mail
var user_account_delete  = require('./controllers/user_account_delete'); // test_mail

///////////////Swapping Station //////////////////////

var list_swapping_station  = require('./controllers/list_swapping_station'); // ss List
var get_cabin_details      = require('./controllers/get_cabin_details'); // Cabin list
var swapping_station_qr_scan      = require('./controllers/swapping_station_qr_scan'); // Qr scan 
var ss_send_start_command   = require('./controllers/ss_send_start_command'); // Send Start Command 
var get_transaction_response      = require('./controllers/get_transaction_response'); // transaction data 
var get_transaction_response_event_info      = require('./controllers/get_transaction_response_event_info'); // transaction data 
var user_wallet_check   = require('./controllers/user_wallet_check'); // wallet check  
var get_payment_access   = require('./controllers/get_payment_access'); // wallet check 
var get_payment_access2   = require('./controllers/get_payment_access2'); // wallet check 
var get_swapping_station_details   = require('./controllers/get_swapping_station_details');  
var list_ss_log   = require('./controllers/list_ss_log');  
var get_user_wallet_details=require('./controllers/get_user_wallet_details');  
var consumer_wallet_create_order= require('./controllers/consumer_wallet_create_order');
var consumer_wallet_create_payment= require('./controllers/consumer_wallet_create_payment');
var consumer_wallet_verify_order= require('./controllers/consumer_wallet_verify_order');

////////////////////////////////////////////////////

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json(), function (req, res, next) {
    app.post('/login',login.login);     
    app.post('/registration_check',registration_check.registration_check); 
    app.post('/registration',registration.registration); 
    app.post('/get_vehicle_details',get_vehicle_details.get_vehicle_details); // for DASHBOARD SERVICE
  	app.post('/get_user_details',get_user_details.get_user_details);
  	app.post('/get_apk_version',get_apk_version.get_apk_version);     
    app.post('/get_state',get_state.get_state); 
    app.post('/get_city',get_city.get_city); 
    app.post('/get_dealer',get_dealer.get_dealer); 
    app.post('/get_vehicle_details2_consumer',get_vehicle_details2_consumer.get_vehicle_details2_consumer); 
    app.post('/add_service_details',add_service_details.add_service_details); 
    app.post('/list_service_details',list_service_details.list_service_details); 
   // app.post('/add_complaint_consumer',add_complaint_consumer.add_complaint_consumer); 
    app.post('/list_complaint_details',list_complaint_details.list_complaint_details); 
    app.post('/change_password_consumer',change_password_consumer.change_password_consumer); 
  //  app.post('/test_mail',test_mail.test_mail); 
    app.post('/update_consumer_feedback',update_consumer_feedback.update_consumer_feedback); 
    app.post('/user_account_delete',user_account_delete.user_account_delete); 

    
    ///////////////Swapping Station //////////////////////

    app.post('/list_swapping_station',list_swapping_station.list_swapping_station); 
    app.post('/get_cabin_details',get_cabin_details.get_cabin_details); 
    app.post('/swapping_station_qr_scan',swapping_station_qr_scan.swapping_station_qr_scan); 
    app.post('/ss_send_start_command',ss_send_start_command.ss_send_start_command); 
    app.post('/get_transaction_response',get_transaction_response.get_transaction_response); 
    app.post('/get_transaction_response_event_info',get_transaction_response_event_info.get_transaction_response_event_info); 
    app.post('/user_wallet_check',user_wallet_check.user_wallet_check); 
    app.post('/get_payment_access',get_payment_access.get_payment_access); 
	app.post('/get_payment_access2',get_payment_access2.get_payment_access2);
    app.post('/get_swapping_station_details',get_swapping_station_details.get_swapping_station_details); 
    app.post('/list_ss_log',list_ss_log.list_ss_log); 
    app.post('/get_user_wallet_details',get_user_wallet_details.get_user_wallet_details); 
    app.post('/consumer_wallet_create_order',consumer_wallet_create_order.consumer_wallet_create_order); 
    app.post('/consumer_wallet_create_payment',consumer_wallet_create_payment.consumer_wallet_create_payment); 
    app.post('/consumer_wallet_verify_order',consumer_wallet_verify_order.consumer_wallet_verify_order); 

    

    ///////////////////////////////////////////////////

  // app.post('/add_complaint_consumer', add_complaint_consumer.upload.array('files', 3),add_complaint_consumer.uploadMultipleImage);

  
//   const multerErrorHandling = (err, req, res, next) => {
//     if (err instanceof multer.MulterError) {
//       res.status(400).send("Multer error: " + err.message);
//     } else {
//       next();
//     }
//     };
  app.post('/add_complaint_consumer', add_complaint_consumer.upload.array('files',3),add_complaint_consumer.uploadMultipleImage,(req, res) => {
    res.send(req.files)
  },(error, req, res, next) => {
       
        if(error instanceof multer.MulterError){
            if(error.code === "LIMIT_FILE_SIZE" ){
              return res.json({
                  status:"0",
                  message:"file Size too Large.Only Allowed file size 1mb",
              });
            }
            if(error.code === "LIMIT_FILE_COUNT" ){
              return res.json({
                  status:"0",
                  message:"Maximum 3 images only upload",
              });
          }            
          }
          res.status(400).send({status: '0', message:error.message })
    })  

//   (error, req, res, next) => {
//     res.status(400).send({status: '0', message:error.message })
// }


    res.header('Access-Control-Allow-Origin', '*');
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Content-Type, api_key');
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'POST');
	res.header('Access-Control-Allow-Credentials', true);
    next();     // Pass to next layer of middleware
});
app.listen(9104);