var con = require('./../config_consumer');
var sha512 = require('js-sha512');
module.exports.change_password_consumer= function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;  
    var current_password = req.body.current_password;   
    var new_password = req.body.new_password;   
    var confirm_password = req.body.confirm_password;   
    var validation_status = 1;  
  

    if(api_key==undefined || api_key=="undefined" ) api_key='';
    if(user_id==undefined || user_id=='undefined') user_id='';
    if(current_password==undefined || current_password=='undefined') current_password='';
    if(new_password==undefined || new_password=='undefined') new_password='';
    if(confirm_password==undefined || confirm_password=='undefined') confirm_password='';
    
if(api_key=='') {
	res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
	res.send(res_arr);
	validation_status = 0;    
}else if(user_id==''){
    res_arr = { status: '0', message: 'User Id  is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(current_password==''){
    res_arr = { status: '0', message: 'Current Password is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(new_password==''){
    res_arr = { status: '0', message: 'New Password is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(confirm_password==''){
    res_arr = { status: '0', message: 'Confirm Password is empty' };
    res.send(res_arr);
    validation_status = 0;  
}

if(validation_status) {   		
    var queryString_A = "select id,company_id from api_key where api_key = '"+api_key+"' AND api_status = '1'"; 
    con.query(queryString_A,function(err_A,rows_A) {
        if(rows_A.length > 0) {  
            var hash = sha512(current_password);    
            var current_password_enc = hash.toString('hex'); 
            var queryString_U = "select company_id,status from users where user_id = '"+user_id+"' AND password = '"+current_password_enc+"' AND company_id ='"+rows_A[0].company_id+"' AND user_type IN('13')";                
            con.query(queryString_U,function(err_U,rows_U) {        
                    if(rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            if(new_password != current_password ){                                                                 
                                if(new_password == confirm_password){                               
                                    var hash_enc = sha512(new_password);    
                                    var new_password_enc = hash_enc.toString('hex');                       
                                    var queryString_Upd_U = "UPDATE users SET password = '"+new_password_enc+"',p_proj = '"+new_password+"'  where user_id= '"+user_id+"' AND company_id= '"+rows_U[0].company_id+"' AND user_type IN('13') "; 
                                    con.query(queryString_Upd_U,function(err_Upd_U,rows_Upd_U) {   
                                        if(rows_Upd_U.affectedRows > 0) {
                                            res_arr = { status: 1, message: 'Password Updated Successfully'};
                                            res.send(res_arr);
                                        }else{
                                            res_arr = { status: 0, message: 'Faild.Try again'};
                                            res.send(res_arr);
                                        }
                                });                  
                                }else{
                                    res_arr = { status: 0, message: 'New Password and Confirm Password Mismatch'};
                                    res.send(res_arr);
                                } 
                            }else{
                                  res_arr = { status: 0, message: 'New Password and Old  Password are Same.Please Changeit...'};
                                  res.send(res_arr);
                            }  
                   
                    }else{
                        res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                        res.send(res_arr);
                    }   
                    }else {
                         res_arr = { status: 0, message: 'Current Password invalid. Try again' };
                         res.send(res_arr);
                 }
            });   
            
        }else {
            res_arr = { status: 0, message: 'API key not matching. Try again' };
            res.send(res_arr);
        }       
    });
}
}
