var con = require('./../config_consumer');
module.exports.list_consumer_wallet_transaction = function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var dialling_code = req.body.dialling_code;
    var validation_status = 1;
  
    if (api_key == undefined || api_key == 'undefined') api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = ''; 
    if (dialling_code == undefined || dialling_code == 'undefined') dialling_code = ''; 

    if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } 


var sub_qry='';
if(dialling_code !=""){
    sub_qry +='AND payment_integration_dialing_code= '+dialling_code+'  ';
}else{
    sub_qry +="";
}
    if(validation_status){
              var queryString_A="select id,company_id from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if(rows_A.length>0){
                var queryString_U="select status from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
                con.query(queryString_U,function(err_U,rows_U){
                    if(rows_U.length>0){
                        if(rows_U[0].status == 1){    
							var query_string_W="SELECT IFNULL(receipt,'') AS receipt,CASE WHEN razorpay_payment_id IS NOT NULL AND razorpay_payment_id != '' THEN razorpay_payment_id  ELSE transaction_id END AS payment_id, currency,amount,created_by_name,DATE_FORMAT(created_datetime,'%d-%m-%y %H:%m:%i') AS created_datetime, payment_integration_country_code,payment_integration_country_name,payment_integration_dialing_code FROM consumer_wallet_transaction  WHERE 1=1 AND status='2' AND created_by='"+user_id+"' "+sub_qry+"  order by id desc ";
                               //   console.log(query_string_W);								  
                                con.query(query_string_W,function(err_W,rows_W){
                                if(rows_W.length>0){
									
									
                                res_arr = { status: 1, message: 'Wallet History Found', data: rows_W};
                                res.send(res_arr);  
                            }else{
                                res_arr={status:0,message: 'Wallet History Not Found'};
                                res.send(res_arr);
                            }})                            
                        }else{
                            res_arr={status:0,message: 'Your account is inactive. Contact Admin'};
                            res.send(res_arr);
                        }                       
                    }else{
                        res_arr={status:0,message:'Invalid Username or Password Try again'};
                        res.send(res_arr);
                    }
                });

            }else{
                res_arr={status:0,message:'API key not matching. Try again'};
                res.send(res_arr);
            }
        });
    }    
}