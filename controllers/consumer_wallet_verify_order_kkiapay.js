var con = require('./../config_consumer');
const kkiapay = require("kkiapay-nodejs-sdk");
const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
// const app = express();
// app.use(bodyParser.json());


module.exports.consumer_wallet_verify_order_kkiapay=function(req,res){   
// Initialize kkiapay instance  dev


//live
// const kkiapay_instance = kkiapay({
//   privatekey: "pk_5a4f4679011c41a7d2c74db75efeb01d2ae6f14adace3de28c07a52efff13b92",
//   publickey: "7eecca5aaa9ce6018053031f77ab2f6c6610bfa6",
//   secretkey: "sk_e8e92eac8a2da886f7c67810dbcdbea5d2a0cc40d34a3c7f5b9d05fd3851f59c"
//   //sandbox: true
// });
var res_arr;
var api_key = req.headers.api_key;
var user_id = req.body.user_id;
var transactionId = req.body.transactionId;

var payment_integration_country_code = req.body.payment_integration_country_code;
var payment_integration_country_name = req.body.payment_integration_country_name;
var payment_integration_dialing_code = req.body.payment_integration_dialing_code;
var payment_integration_type = req.body.payment_integration_type;
var payment_integration_mode   = req.body.payment_integration_mode;




var validation_status = 1;  

if(api_key==undefined ||  api_key === 'undefined' ) api_key='';
if(user_id==undefined || user_id === 'undefined') user_id='';
if(transactionId==undefined || transactionId === 'undefined') transactionId='';   

if(payment_integration_country_code==undefined || payment_integration_country_code === 'undefined') payment_integration_country_code='';   
if(payment_integration_country_name==undefined || payment_integration_country_name === 'undefined') payment_integration_country_name='';   
if(payment_integration_dialing_code==undefined || payment_integration_dialing_code === 'undefined') payment_integration_dialing_code='';   
if(payment_integration_type==undefined || payment_integration_type === 'undefined') payment_integration_type='';   
if(payment_integration_mode==undefined || payment_integration_mode === 'undefined') payment_integration_mode='';   

// if(public_key==undefined || public_key === 'undefined') public_key='';   
// if(private_key==undefined || private_key === 'undefined') private_key='';   
// if(secret_key==undefined || secret_key === 'undefined') secret_key='';   


if(user_id=='') {
  res_arr = { status: 0, message: 'User Id is empty or wrong' };
  res.send(res_arr);
  validation_status = 0;    
}else if(transactionId==''){
  res_arr = { status: 0, message: 'TransactionId  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}else if(payment_integration_country_code==''){
  res_arr = { status: 0, message: 'Payment Integration Country Code  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}else if(payment_integration_country_name==''){
  res_arr = { status: 0, message: 'Payment Integration country Name  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}else if(payment_integration_dialing_code==''){
  res_arr = { status: 0, message: 'Payment Integration Dialing Code  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}
else if(payment_integration_type !='2'){
  res_arr = { status: 0, message: 'Payment Integration type  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}else if(payment_integration_mode ==''){
  res_arr = { status: 0, message: 'Payment Integration Mode  is empty or wrong' };
  res.send(res_arr);
  validation_status = 0; 
}
// else if(public_key ==''){
//   res_arr = { status: 0, message: 'Public key is empty or wrong' };
//   res.send(res_arr);
//   validation_status = 0; 
// }else if(private_key ==''){
//   res_arr = { status: 0, message: 'Private key is empty or wrong' };
//   res.send(res_arr);
//   validation_status = 0; 
// }else if(secret_key ==''){
//   res_arr = { status: 0, message: 'Secret key is empty or wrong' };
//   res.send(res_arr);
//   validation_status = 0; 
// }
var s_mode='';

if(payment_integration_mode =='1'){//developer mode
  s_mode=true;
}else if(payment_integration_mode =='2'){ //live mode
   s_mode=false;
}





var k_status='';

if(validation_status){
  var queryString_A = "SELECT id,company_id FROM api_key WHERE api_key = '"+api_key+"' AND api_status = '1'";
  //console.log(queryString_A);
  con.query(queryString_A,function(err_A,rows_A){
      if(rows_A.length > 0){
         var queryString_U = "SELECT company_id,branch_id,name,status,wallet_amount,country_id FROM users WHERE user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
         //  console.log(queryString_U);
		 con.query(queryString_U,function(err_U,rows_U) {
            if(rows_U.length > 0) {
              if(rows_U[0].status == 1){
              var queryString_U_v2 = "SELECT C.public_key,C.private_key,C.secret_key FROM country C WHERE C.country_id = '"+rows_U[0].country_id+"' ";                
                // console.log(queryString_U_v2);  
                 con.query(queryString_U_v2,function(err_U_v2,rows_U_v2) {                                      
                     if(rows_U_v2.length > 0) {
                      var public_key   = rows_U_v2[0].public_key;
                      var private_key   = rows_U_v2[0].private_key;
                      var secret_key   = rows_U_v2[0].secret_key;
                   
              const kkiapay_instance = kkiapay({
                privatekey: private_key,
                publickey: public_key,
                secretkey: secret_key,    
                sandbox: s_mode
              });

              kkiapay_instance.verify(transactionId)
              .then((response) => {
             //   console.log("Verification response:", response);
                const responseDataString = JSON.stringify(response);
                if(response.status='SUCCESS'){
                  k_status=2;
                }else{// if any error 
                  k_status=1;
                }

                var queryString_ins = "INSERT INTO consumer_wallet_transaction SET amount='"+response.amount+"', currency='CFA', transaction_id='"+transactionId+"',company_id='"+rows_U[0].company_id+"',branch_id='"+rows_U[0].branch_id+"',created_by='"+user_id+"',created_by_name='"+rows_U[0].name+"',raw_data='"+responseDataString+"',payment_integration_country_code='"+payment_integration_country_code+"',payment_integration_country_name='"+payment_integration_country_name+"',payment_integration_dialing_code='"+payment_integration_dialing_code+"', status="+k_status+",created_datetime=NOW()";
               con.query(queryString_ins,function(err_OC_INS,rows_INS) {  
              //  console.log(queryString_ins);
              //  res_arr = { status: 1, message: 'Verified data',data: response };
            
              if(response.status='SUCCESS'){ 
                var New_wallet_amount= parseInt(rows_U[0].wallet_amount)  +  parseInt(response.amount);
                var queryString_ins_v1 = "Update users SET  wallet_amount='"+New_wallet_amount+"'  where user_id ='" +user_id+" ' ";
                con.query(queryString_ins_v1,function(err_OC_INS_v1,rows_INS_v1) {   
                  res_arr = { status: 1, message: 'Success' };
                  res.send(res_arr);                   
                });  
              }else{
                res_arr = { status: 1, message: 'Success' };
                res.send(res_arr);    
              }
              });                 
              })
              .catch((error) => {
             //   console.error("Error verifying payment:", error);
               // res.status(500).json({ status: 0, message: 'Error verifying data', error: error.message });
               res_arr = { status: 0, message: 'Error verifying data',error:error.message};
               res.send(res_arr);
              });
            }else{
              res_arr = { status: 0, message: 'Public key details not found' };
              res.send(res_arr);
            }
          });
            }else {
              res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
              res.send(res_arr);
          } 
          }else {
              res_arr = { status: 0, message: 'User not exists' };
              res.send(res_arr);
            }  
           });
          } else {
              res_arr = { status: 0, message: 'API key not matching. Try again' };
              res.send(res_arr);
          }    
      });
    }
  }