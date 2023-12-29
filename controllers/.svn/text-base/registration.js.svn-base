var con = require('./../config_consumer');
var sha512 = require('js-sha512');
var request = require("request");
module.exports.registration=function(req,res){
   
    var res_arr;
    var api_key = req.headers.api_key;
    var mobile = req.body.mobile_number;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var get_otp = req.body.get_otp;
    var validation_status = 1;  

    if(api_key === 'undefined') api_key='';
    if(mobile === 'undefined') mobile='';
    if(email === 'undefined') email='';
    if(password === 'undefined') password='';
    if(confirm_password === 'undefined') confirm_password='';
    if(get_otp === 'undefined') get_otp='';
    
if(api_key=='') {
	res_arr = { status: 0, message: 'API key is empty or wrong' };
	res.send(res_arr);
	validation_status = 0;    
}else if(mobile==''){
    res_arr = { status: '0', message:'Mobile No is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(email==''){
    res_arr = { status: '0', message:'Email is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(password==''){
    res_arr = { status: '0', message:'Password is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(confirm_password==''){
    res_arr = { status: '0', message:'Confirm Password is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(get_otp==''){
    res_arr = { status: '0', message:'OTP is empty' };
    res.send(res_arr);
    validation_status = 0;  
}
 

    if(validation_status) {   		
        var queryString_A = "select id,company_id,branch_id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
		con.query(queryString_A,function(err_A,rows_A) {
			if(rows_A.length > 0) {    														//case 1. check  api key 
                var p_proj=password;
                var hash = sha512(password);    
                var enc_password = hash.toString('hex');  
                if(password == confirm_password) {  										//case 2. check password and confirm password
                    var queryString_UT = "SELECT id FROM user_type WHERE user_role = 'Customer' AND status='1'";      // get usertype
                    con.query(queryString_UT,function(err_UT,rows_UT) { 
                    var user_type=rows_UT[0].id; 
                    var queryString_SelU = "SELECT uname FROM users WHERE uname = '"+mobile+"' AND user_type='"+user_type+"' AND company_id = '"+rows_A[0].company_id+"' AND branch_id ='"+rows_A[0].branch_id+"' ";
                    con.query(queryString_SelU,function(err_SelU,rows_SelU) {  
                        if(rows_SelU.length == '0') {										//case 3. If mobile number not exists, then proceed
                            var queryString_C = "SELECT company_id,branch_id,dealer_id,customer_id,customer_name,mobile_number,billing_address,billing_city,billing_state,billing_pincode,phone_number,email_id,customer_type,otp,status FROM customer WHERE mobile_number = '"+mobile+"' AND company_id = '"+rows_A[0].company_id+"' AND branch_id ='"+rows_A[0].branch_id+"'";
                            con.query(queryString_C,function(err_C,rows_C) {  
							if(rows_C.length > 0) { 										// case 4. check if customer exists
								if(rows_C[0].customer_type=='2') {							// case 5: Check if customer is confirmed customer [After invoice only he will becore conofirmed customer [in DMS]]
									if(rows_C[0].status=='1') {
									if(get_otp == rows_C[0].otp) { // case 4. verify otp
											var company_id=rows_C[0].company_id;
											var branch_id=rows_C[0].branch_id;
											var dealer_id=rows_C[0].dealer_id;
											var customer_id=rows_C[0].customer_id;
											var uname=mobile;
											var name=rows_C[0].customer_name;
											var address=rows_C[0].billing_address;
											var city=rows_C[0].billing_city;
											var pincode=rows_C[0].billing_pincode;
											var state_id=rows_C[0].billing_state;
											var phone_number=rows_C[0].phone_number;
											var mobile_number=mobile; 
											var email_id=rows_C[0].email_id; 
											var status='1'; 
											var created_by=0;
											var queryString_InsUser="INSERT INTO users SET company_id = '"+company_id+"',branch_id='"+branch_id+"',dealer_id='"+dealer_id+"',customer_id='"+customer_id+"',user_type='"+user_type+"',uname='"+uname+"',password='"+enc_password+"',name='"+name+"',address='"+address+"',city='"+city+"',pincode='"+pincode+"',state_id='"+state_id+"',phone_number='"+phone_number+"',mobile_number='"+mobile_number+"',email_id='"+email_id+"',status='"+status+"',created_datetime=NOW(),p_proj='"+p_proj+"'";
											con.query(queryString_InsUser,function(err_InsUser,rows_Ins_User) {
												res_arr = { status: 1, message: 'Registration done successfully'};
												res.send(res_arr);  
											});
									} else{
										res_arr = { status: 0, message: 'OTP Mismatch. Try Again' }; 
										res.send(res_arr);
									}
								} else {
									res_arr = { status: 0, message: 'Your customer account is inactive. Please contact your Dealer' };
									res.send(res_arr);
								}
							} else {
								res_arr = { status: 0, message: 'You are not a confirmed customer. Contact Dealer' };
								res.send(res_arr);
							}
						} else {
                            res_arr = { status: 0, message: 'Mobile number not exists. Contact Dealer' };
                            res.send(res_arr);
                        }                        
                        });  
                        } else{
                            res_arr = { status: 0, message: 'Mobile Number Already Exist. Try Again' };
				            res.send(res_arr);
                        }
                     });  
                    });
                    }else{
                        res_arr = { status: 0, message: 'Password Mismatch' };
                        res.send(res_arr);
                    } 
                }else {
				res_arr = { status: 0, message: 'API key not matching. Try again' };
				res.send(res_arr);
			}       
        });
	}
}