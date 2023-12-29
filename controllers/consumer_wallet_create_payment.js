var con = require('./../config_consumer');
var request = require("request");
const express = require('express'); 
const Razorpay = require('razorpay');  
const crypto = require('crypto'); 
module.exports.consumer_wallet_create_payment=function(req,res){
   
    const razorpayInstance = new Razorpay({   
        key_id: 'rzp_test_L94yDrUwGGnCS5',   
        key_secret: 'bPLvadf1eijZoq5Q85MW818j' 
    }); 

  var res_arr;
  var api_key = req.headers.api_key;
  var user_id = req.body.user_id;
  var razorpay_payment_id = req.body.razorpay_payment_id;
	var razorpay_order_id = req.body.razorpay_order_id;
	var  razorpay_signature = req.body.razorpay_signature;
  var amount = req.body.amount;
  var validation_status = 1;  
  
  console.log(req.body);
  
  
  if(api_key==undefined ||  api_key === 'undefined' ) api_key='';
  if(user_id==undefined || user_id === 'undefined') user_id='';
  if(razorpay_payment_id==undefined || razorpay_payment_id === 'undefined') razorpay_payment_id='';   
  if(razorpay_order_id==undefined || razorpay_order_id === 'undefined') razorpay_order_id='';
  if(razorpay_signature==undefined || razorpay_signature === 'undefined') razorpay_signature='';
  if(amount==undefined || amount === 'undefined') amount='';

  if(user_id=='') {
		res_arr = { status: 0, message: 'User Id is empty or wrong' };
		res.send(res_arr);
		validation_status = 0;    
	}else if(razorpay_payment_id==''){
		res_arr = { status: 0, message: 'Razorpay Payment_id  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
	}else if(razorpay_order_id==''){
		res_arr = { status: 0, message: 'Razorpay Order id  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
	}else if(razorpay_signature==''){
		res_arr = { status: 0, message: 'Razorpay Signature  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
	}else if(amount==''){
		res_arr = { status: 0, message: 'Amount  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
	}

  if(validation_status){
    var queryString_A = "SELECT id,company_id FROM api_key WHERE api_key = '"+api_key+"' AND api_status = '1'";
    con.query(queryString_A,function(err_A,rows_A){
        if(rows_A.length > 0){
            var queryString_U = "SELECT company_id,branch_id,name,status,wallet_amount FROM users WHERE user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
            con.query(queryString_U,function(err_U,rows_U) {
              if(rows_U.length > 0) {                                                  
                     var queryString_ins = "Update consumer_wallet_transaction SET  razorpay_payment_id='"+razorpay_payment_id+"',razorpay_signature='"+razorpay_signature+"',status=2  where razorpay_order_id ='" +razorpay_order_id+" ' ";
                    con.query(queryString_ins,function(err_OC_INS,rows_INS) {   
                      var New_wallet_amount=parseFloat(rows_U[0].wallet_amount)+parseFloat(amount);
                      console.log(rows_U[0].wallet_amount);
                      console.log(amount);
                      var queryString_ins = "Update users SET  wallet_amount='"+New_wallet_amount+"'  where user_id ='" +user_id+" ' ";
                      con.query(queryString_ins,function(err_OC_INS,rows_INS) {   
                        res_arr = { status: 1, message: 'Success' };
                        res.send(res_arr);                   
                      });                      
                    });                  
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