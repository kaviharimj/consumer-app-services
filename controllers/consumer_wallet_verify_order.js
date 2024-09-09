var con = require('./../config_consumer');
var request = require("request");
const express = require('express'); 
const Razorpay = require('razorpay');  
const crypto = require('crypto'); 
module.exports.consumer_wallet_verify_order=function(req,res){   
    const razorpayInstance = new Razorpay({   
        key_id: 'rzp_test_L94yDrUwGGnCS5',   
        key_secret: 'bPLvadf1eijZoq5Q85MW818j' 
    }); 

var res_arr;
var api_key = req.headers.api_key;
//   var razorpay_signature = req.headers.razorpay_signature;
const razorpay_signature = req.headers['x-razorpay-signature'];     
var user_id = req.body.user_id;
var razorpay_payment_id = req.body.razorpay_payment_id;
var razorpay_order_id = req.body.razorpay_order_id;
var validation_status = 1;  
console.log(req.body);


if(api_key==undefined ||  api_key === 'undefined' ) api_key='';
if(user_id==undefined || user_id === 'undefined') user_id='';
if(razorpay_payment_id==undefined || razorpay_payment_id === 'undefined') razorpay_payment_id='';   
if(razorpay_order_id==undefined || razorpay_order_id === 'undefined') razorpay_order_id='';
if(razorpay_signature==undefined || razorpay_signature === 'undefined') razorpay_signature='';
    
if(user_id=='') {
    res_arr = { status: 0, message: 'User Id is empty or wrong' };
    res.send(res_arr);
    validation_status = 0;    
}else if(razorpay_payment_id==''){
    res_arr = { status: 0, message: 'Razorpay Payment Id  is empty or wrong' };
    res.send(res_arr);
    validation_status = 0; 
}else if(razorpay_order_id==''){
    res_arr = { status: 0, message: 'Razorpay Order Id  is empty or wrong' };
    res.send(res_arr);
    validation_status = 0; 
}else if(razorpay_signature==''){
    res_arr = { status: 0, message: 'Razorpay Signature  is empty or wrong' };
    res.send(res_arr);
    validation_status = 0; 
}

  if(validation_status){
    var queryString_A = "SELECT id,company_id FROM api_key WHERE api_key = '"+api_key+"' AND api_status = '1'";
    con.query(queryString_A,function(err_A,rows_A){
        if(rows_A.length > 0){
            var queryString_U = "SELECT company_id,branch_id,name,status FROM users WHERE user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
            con.query(queryString_U,function(err_U,rows_U) {
              if(rows_U.length > 0) {    
                if(rows_U[0].status == 1){ 
               var  key_secret = 'bPLvadf1eijZoq5Q85MW818j';                                             
                let hmac = crypto.createHmac('sha256', key_secret);     
                hmac.update(razorpay_order_id + "|" + razorpay_payment_id); 	
                const generated_signature = hmac.digest('hex');    
                if(razorpay_signature===generated_signature){ 
                    res_arr = { status: 1, message: 'Payment has been verified' };
                    res.send(res_arr);
                }else{
                    res_arr = { status: 0, message: 'Payment verification failed' };
                    res.send(res_arr);
                }
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
