var con = require('./../config_consumer');
var sha512 = require('js-sha512');
var request = require("request");
module.exports.registration_check=function(req,res){
   
    var res_arr;
    var api_key = req.headers.api_key;
    var mobile_number = req.body.mobile_number;
    var validation_status = 1;  

    if(api_key === 'undefined') api_key='';
    if(mobile_number === 'undefined') mobile_number='';

    
if(api_key=='') {
	res_arr = { status: 0, message: 'API key is empty or wrong' };
	res.send(res_arr);
	validation_status = 0;    
}else if(mobile_number==''){
    res_arr = { status: '0', message:'Mobile No is empty' };
    res.send(res_arr);
    validation_status = 0;  
}

    if(validation_status) {   		
        var queryString_A = "select id,company_id,branch_id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
		con.query(queryString_A,function(err_A,rows_A) { 
			if(rows_A.length > 0) {  // case 1.check api key 
                var queryString_UT = "SELECT id FROM user_type WHERE user_role = 'Customer' AND status='1'";      // get usertype
                con.query(queryString_UT,function(err_UT,rows_UT) { 
                var user_type=rows_UT[0].id; 

                var queryString_SelU = "SELECT  uname FROM users WHERE uname = '"+mobile_number+"' AND user_type='"+user_type+"' AND company_id = '"+rows_A[0].company_id+"' AND branch_id ='"+rows_A[0].branch_id+"' ";
                con.query(queryString_SelU,function(err_SelU,rows_SelU) {           
                if(rows_SelU.length == '0') { // check if customer alredy exist in user table 
                var queryString_C = "SELECT customer_id,customer_name,customer_type,status FROM customer WHERE mobile_number = '"+mobile_number+"' AND company_id = '"+rows_A[0].company_id+"' AND branch_id ='"+rows_A[0].branch_id+"' order by customer_type DESC LIMIT 0,1";             
                con.query(queryString_C,function(err_C,rows_C) {                     
        
                    if(rows_C.length > 0) { //case 2.check if mobile no already exist 
                        if(rows_C[0].status=='1'){ // case 3. check if customer status is active  or inactive
                            if(rows_C[0].customer_type=='2'){ // case 4. check if customer type is confirmed customer or not
                                var apiKey = 'NTI2NTU5NmMzMDcxNmEzNTU2NzczMTcyMzU2YjZiNDQ=';                        
                                var mobile = mobile_number ;
                                var tid="1207162252254909632";
                                var otp = Math.floor(1000 + Math.random() * 9000);
                                var message="Dear User, "+otp+" is the secret OTP for verifying your mobile number on BNC Motors. Valid for 90 Seconds. Please do not share this OTP."                          
                                var url  = "https://api.textlocal.in/send/?apiKey="+apiKey+"&numbers="+mobile+"&sender=BNCEEV&message="+message+"";    
                                request({
                                url: url,
                                json: true
                                },function (error, response, body) {										
                                    if (!error && response.statusCode === 200) {
                                        res_arr = { status: 1, message: 'OTP Sent Successfully',otp : otp};
                                        if(res_arr.status == "1"){ // case 5. if otp send successfully means add otp into customer table
                                            var queryString_UpdC="UPDATE customer SET otp ='"+otp+"',otp_validity_datetime=NOW() where company_id = '"+rows_A[0].company_id+"' AND branch_id='"+rows_A[0].branch_id+"' AND customer_id='"+rows_C[0].customer_id+"'";
                                            con.query(queryString_UpdC,function(err_InsUser,rows_UpdC) { 
                                                res_arr = { status: '1', message: 'otp  updated in customer table' };
                                            });
                                        }                                  
                                        res.send(res_arr);
                                    } else {
                                        res_arr = { status: '0', message: 'Could not able to send SMS. Try again' };
                                        res.send(res_arr);
                                    }
                                });
                            }else{
                                res_arr = { status: 0, message: 'You are not a confirmed customer. Please contact your Dealer' };
                                res.send(res_arr);
                            }                       
                        }else{
                            res_arr = { status: 0, message: 'Your account is inactive. Please contact your Dealer' };
                            res.send(res_arr);
                        }
                    }else {
                            res_arr = { status: 0, message: 'Mobile number not exists. Please contact your Dealer' };
                            res.send(res_arr);
                    }
                 }); 
                }else{
                    res_arr = { status: 0, message: 'Mobile Number Already Exist. Try Again' };
                    res.send(res_arr);

                } 
            });
        });

            }else {
				res_arr = { status: 0, message: 'API key not matching. Try again' };
				res.send(res_arr);
			}       
        });
	}
}
