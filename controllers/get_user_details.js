
var con = require('./../config_consumer');
module.exports.get_user_details=function(req,res){


    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;

    var validation_status=1;
    if(api_key === 'undefined') api_key='';
    if(user_id === 'undefined') user_id='';

    if(api_key=='') {
        res_arr = { status: 0, message: 'API key is empty' };
        res.send(res_arr);
        validation_status = 0;    
    }else if(user_id==''){
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;  
    }

    if(validation_status) {  
        
        var queryString_A = "select id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
        con.query(queryString_A,function(err_A,rows_A) {
        if(rows_A.length > 0) {
        ///////////////////////////////////////////////////////
            var queryString_U = "select customer_id,name,address,mobile_number,city,email_id, status from users where user_id = '"+user_id+"'";
              con.query(queryString_U,function(err_U,rows_U) {
				if(rows_U.length > 0) {
					if(rows_U[0].status==1) {
						res_arr = { status: 1, message: 'Customer Details', data:rows_U };								
					    res.send(res_arr);							
					} else{
						res_arr = { status: 0, message: 'Your account is inactive. Contact Dealer' };
						res.send(res_arr);
					}
				} else {
                    res_arr = { status: 0, message: 'User not exists. Contact Dealer' };
                    res.send(res_arr);
                }       
            });
    
                  ////////////////////////////////////////////////////
           }
           else{
            res_arr = { status: 0, message: 'API key not matching. Try again' };
            res.send(res_arr);
           }
       });
    }
  }
