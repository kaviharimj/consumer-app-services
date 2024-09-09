var con = require('./../config_consumer');
var request = require("request");
const express = require('express'); 
const Razorpay = require('razorpay');  
const crypto = require('crypto'); 

module.exports.consumer_wallet_create_order = function(req, res) {      

    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var amount = req.body.amount;
    var currency = req.body.currency;
    var notes = req.body.notes;
    //var public_key = req.body.public_key;
    //var secret_key = req.body.secret_key;

    var payment_integration_country_code = req.body.payment_integration_country_code;
    var payment_integration_country_name = req.body.payment_integration_country_name;
    var payment_integration_dialing_code = req.body.payment_integration_dialing_code;

    var validation_status = 1; 
    var receipt; 

    if(api_key == undefined || api_key === 'undefined') api_key = '';
    if(user_id == undefined || user_id === 'undefined') user_id = '';
    if(amount == undefined || amount === 'undefined') amount = '';   
    if(currency == undefined || currency === 'undefined') currency = '';
    if(notes == undefined || notes === 'undefined') notes = '';
    if(payment_integration_country_code == undefined || payment_integration_country_code === 'undefined') payment_integration_country_code = '';   
    if(payment_integration_country_name == undefined || payment_integration_country_name === 'undefined') payment_integration_country_name = '';   
    if(payment_integration_dialing_code == undefined || payment_integration_dialing_code === 'undefined') payment_integration_dialing_code = '';   

    if(user_id == '') {
        res_arr = { status: 0, message: 'User Id is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;    
    } else if(amount == '') {
        res_arr = { status: 0, message: 'Amount is empty or wrong' };
        res.send(res_arr);
        validation_status = 0; 
    } else if(currency == '') {
        res_arr = { status: 0, message: 'Currency is empty or wrong' };
        res.send(res_arr);
        validation_status = 0; 
    } else if(payment_integration_dialing_code == '') {
        res_arr = { status: 0, message: 'Payment Integration Dialing Code is empty or wrong' };
        res.send(res_arr);
        validation_status = 0; 
    } else if(payment_integration_country_code == '') {
        res_arr = { status: 0, message: 'Payment Integration Country Code is empty or wrong' };
        res.send(res_arr);
        validation_status = 0; 
    } else if(payment_integration_country_name == '') {
        res_arr = { status: 0, message: 'Payment Integration Country Name is empty or wrong' };
        res.send(res_arr);
        validation_status = 0; 
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;										
    receipt = formattedDate + formattedTime;

    if(validation_status) {
        var queryString_A = "SELECT id, company_id FROM api_key WHERE api_key = '"+api_key+"' AND api_status = '1'";
        con.query(queryString_A, function(err_A, rows_A) {
            if(rows_A.length > 0) {
                var queryString_U = "SELECT company_id, branch_id, distributor_id,dealer_id, retailer_id, name, status,country_id FROM users WHERE user_id = '"+user_id+"' and company_id = '"+rows_A[0].company_id+"'";
                con.query(queryString_U, function(err_U, rows_U) {
                    if(rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                        var queryString_U_v2 = "SELECT C.public_key, C.private_key, C.secret_key FROM  country C WHERE C.country_id = '"+rows_U[0].country_id+"' ";                
                        con.query(queryString_U_v2, function(err_U_v2, rows_U_v2) {                                      
                            if(rows_U_v2.length > 0) {
                                var public_key = rows_U_v2[0].public_key;
                                var secret_key = rows_U_v2[0].secret_key;       
                         
                                const razorpayInstance = new Razorpay({  
                                    key_id: public_key,   
                                    key_secret: secret_key 
                                }); 
              
                                razorpayInstance.orders.create({amount, currency, receipt, notes}, (err, order) => { 
                                    if(!err) {       
                                        var upd_amount = (order.amount) / 100;         
                                        console.log(upd_amount);    
                                        const responseDataString = JSON.stringify(order);       
                                        var queryString_ins = "INSERT INTO consumer_wallet_transaction SET company_id='"+rows_U[0].company_id+"', branch_id='"+rows_U[0].branch_id+"', distributor_id='"+rows_U[0].distributor_id+"',dealer_id='"+rows_U[0].dealer_id+"', retailer_id='"+rows_U[0].retailer_id+"', razorpay_order_id='"+order.id+"', entity='"+order.entity+"', amount='"+upd_amount+"', amount_paid='"+order.amount_paid+"', amount_due='"+order.amount_due+"', currency='"+order.currency+"', receipt='"+order.receipt+"', offer_id='"+order.offer_id+"', attempts='"+order.attempts+"', description='"+order.notes['description']+"', razor_pay_created_at='"+order.created_at+"', created_by='"+user_id+"', created_by_name='"+rows_U[0].name+"', payment_integration_country_code='"+payment_integration_country_code+"', payment_integration_country_name='"+payment_integration_country_name+"', payment_integration_dialing_code='"+payment_integration_dialing_code+"', raw_data='"+responseDataString+"', created_datetime=NOW()";
                                     console.log(queryString_ins);
                                        con.query(queryString_ins, function(err_OC_INS, rows_INS) {  
                                            if(rows_INS.insertId > 0) {
                                                const order2 = {
                                                    razorpay_order_id: order.id,
                                                    amount: order.amount,
                                                    currency: order.currency,
                                                    created_by_name: rows_U[0].name                      
                                                };
                                                res_arr = { status: 1, message: 'Inserted successfully', data: order2 };
                                                res.send(res_arr);     
                                            }
                                        });                    
                                    } else {
                                        res_arr = { status: 0, message: 'Failed', data: err };
                                        res.send(res_arr);    
                                    }
                                });   
                            } else {
                                res_arr = { status: 0, message: 'Public key details not found' };
                                res.send(res_arr);
                            }
                        }); 
                    }else {
                        res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                        res.send(res_arr);
                    }             
                    } else {
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
