var con = require('./../config_consumer');
var sha512 = require('js-sha512');
module.exports.login=function(req,res){
   
    var res_arr;
    var api_key = req.headers.api_key;
    var uname = req.body.uname;
    var password = req.body.password;   
    var fcm_token= req.body.fcm_token;   
    var validation_status = 1;  

    if(api_key === 'undefined') api_key='';
    if(uname === 'undefined') uname='';
    if(password === 'undefined') password='';
    if(fcm_token === 'undefined') fcm_token='';
    
        
    if(api_key=='') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;    
    }else if(uname==''){
        res_arr = { status: '0', message: 'Username is empty' };
        res.send(res_arr);
        validation_status = 0;  
    }else if(password==''){
        res_arr = { status: '0', message: 'Password is empty' };
        res.send(res_arr);
        validation_status = 0;   
    }else if(fcm_token==''){
        res_arr = { status: '0', message: 'FCM token is empty' };
        res.send(res_arr);
        validation_status = 0;   
    }
  

    if(validation_status) {   		
            var queryString_A = "select id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
      
            con.query(queryString_A,function(err_A,rows_A) {
                if(rows_A.length > 0) {
                    var hash = sha512(password);
                    var password1 = hash.toString('hex'); 
                    
                    var queryString_UT = "SELECT id FROM user_type WHERE user_role = 'Customer' AND status='1'";      // get usertype          
                    con.query(queryString_UT,function(err_UT,rows_UT) { 
                    var user_type=rows_UT[0].id; 

                    var queryString_U = "select user_id,company_id,branch_id,dealer_id,customer_id,name,email_id,mobile_number,status from users where uname = '"+uname+"' AND password = '"+password1+"' AND user_type ='"+user_type+"'";                
                    con.query(queryString_U,function(err_U,rows_U) {                                      
                        if(rows_U.length > 0) {
                            if(rows_U[0].status == '1') {                             
                                    var queryString_U_V1 = "UPDATE users SET fcm_token='"+fcm_token+"'  where user_id= '"+rows_U[0].user_id+"' AND company_id= '"+rows_U[0].company_id+"'";
                                    con.query(queryString_U_V1,function(err_U_V1,rows_U_V1) {    
                                      //  res_arr = { status: 1, message: 'Updated Successful', data:rows_U_V1 };
                                      //  res.send(res_arr);
                                    });                            
                                res_arr = { status: 1, message: 'Login Successful', data:rows_U };
                                res.send(res_arr);
                            }else if(rows_U[0].status == '2'){   
                                res_arr = { status: 0, message: 'Your Account is Deleted.Contact Admin'};
                                res.send(res_arr);
                            }else{
                                res_arr = { status: 1, message: 'Your account is inactive. Please contact your Dealer' };
                                res.send(res_arr);
                            }
                        } else {
                                res_arr = { status: 0, message: 'Invalid Username or Password Try again' };
                                res.send(res_arr);
                        }
                
                    }); 
                    });  
                } else {
                    res_arr = { status: 0, message: 'API key not matching. Try again' };
                    res.send(res_arr);
                }       
            });
        }
}
