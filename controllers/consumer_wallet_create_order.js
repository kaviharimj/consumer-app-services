var con = require('./../config_consumer');
var request = require("request");
const express = require('express'); 
const Razorpay = require('razorpay');  
const crypto = require('crypto'); 
module.exports.consumer_wallet_create_order=function(req,res){   
    const razorpayInstance = new Razorpay({   
        key_id: 'rzp_test_L94yDrUwGGnCS5',   
        key_secret: 'bPLvadf1eijZoq5Q85MW818j' 
    }); 

var res_arr;
var api_key = req.headers.api_key;
var user_id = req.body.user_id;
var amount = req.body.amount;
var currency = req.body.currency;
var receipt = req.body.receipt;
var notes = req.body.notes;
var validation_status = 1;  
console.log(req.body);


if(api_key==undefined ||  api_key === 'undefined' ) api_key='';
if(user_id==undefined || user_id === 'undefined') user_id='';
if(amount==undefined || amount === 'undefined') amount='';   
if(currency==undefined || currency === 'undefined') currency='';
if(receipt==undefined || receipt === 'undefined') receipt='';
if(notes==undefined || notes === 'undefined') notes='';
     
if(user_id=='') {
		res_arr = { status: 0, message: 'User Id is empty or wrong' };
		res.send(res_arr);
		validation_status = 0;    
}else if(amount==''){
		res_arr = { status: 0, message: 'Amount  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
}else if(currency==''){
		res_arr = { status: 0, message: 'Currency  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
}else if(receipt==''){
		res_arr = { status: 0, message: 'Receipt  is empty or wrong' };
		res.send(res_arr);
		validation_status = 0; 
}
  // else if(notes==''){
	// 	res_arr = { status: 0, message: 'notes  is empty or wrong' };
	// 	res.send(res_arr);
	// 	validation_status = 0; 
	// }

  if(validation_status){
    var queryString_A = "SELECT id,company_id FROM api_key WHERE api_key = '"+api_key+"' AND api_status = '1'";
    con.query(queryString_A,function(err_A,rows_A){
        if(rows_A.length > 0){
            var queryString_U = "SELECT company_id,branch_id,name,status FROM users WHERE user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
            con.query(queryString_U,function(err_U,rows_U) {
              if(rows_U.length > 0) {
                razorpayInstance.orders.create({amount, currency, receipt, notes}, 		
                    (err, order)=>{ 
                    if(!err) {                          
                     var queryString_ins = "INSERT INTO consumer_wallet_transaction SET  company_id='"+rows_U[0].company_id+"',branch_id='"+rows_U[0].branch_id+"',razorpay_order_id='"+order.id+"', entity='"+order.entity+"',amount='"+order.amount+"', amount_paid='"+order.amount_paid+"',amount_due='"+order.amount_due+"',currency='"+order.currency+"',receipt='"+order.receipt+"',offer_id='"+order.offer_id+"', attempts='"+order.attempts+"', description='"+order.notes['description']+"',razor_pay_created_at='"+order.created_at+ "', created_by='"+user_id+"',created_by_name='"+rows_U[0].name+"',created_datetime=NOW()";
                    console.log(queryString_ins);
                    con.query(queryString_ins,function(err_OC_INS,rows_INS) {  
                    if(rows_INS.insertId > 0) {
                        var queryString_C = "SELECT razorpay_order_id,entity,amount,amount_paid,amount_due,currency,receipt,offer_id,attempts,description,razor_pay_created_at,status,created_by_name,created_datetime FROM consumer_wallet_transaction WHERE id = '"+rows_INS.insertId+"' ";
                        con.query(queryString_C,function(err_C,rows_C) {                     
                        console.log(queryString_C);
                        res_arr = { status: 1, message: 'Inserted successfully',data:rows_C };
                        res.send(res_arr); 
                        });     
                      }
                    });                    
                    }else{
                      res_arr = { status: 0, message: 'Failed',data: err};
                      res.send(res_arr);    
                    }
                    }                 
                )                 
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
