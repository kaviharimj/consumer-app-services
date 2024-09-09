var con = require('../config_consumer');
module.exports.list_ss_battery_soc=function(req,res){

    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var imei = req.body.imei;
    var soc_type = req.body.soc_type;
    var validation_status = 1; 
    var subQuery = ''; 

    if(api_key=='') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;    
    } else if(user_id==''){
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;  
    } else if(imei==''){
        res_arr = { status: '0', message: 'IMEI is empty' };
        res.send(res_arr);
        validation_status = 0;  
    } else if(soc_type==''){
        res_arr = { status: '0', message: 'SOC Type is empty' };
        res.send(res_arr);
        validation_status = 0;  
    }

    if(validation_status){
        var queryString_A = "select id,company_id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
        con.query(queryString_A,function(err_A,rows_A){
            if(rows_A.length > 0){
                var queryString_U = "select name, mobile_number, email_id, status, wallet_amount from users where user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
                con.query(queryString_U,function(err_U,rows_U){ 
                    if(rows_U.length > 0) {
                        if(rows_U[0].status == 1 ) {
                            if(soc_type==1){
                                subQuery = " AND battery_soc >='90' AND battery_soh >= '80' AND battery_temperature < '50' AND a1_mosfet_temperature < '50' AND battery_failure_value = '0-0-0' ";
                            } else if(soc_type==2){
                                subQuery = " AND battery_soc >= '50' AND battery_soc < '90' AND battery_soh >= '80' AND battery_temperature < '50' AND a1_mosfet_temperature < '50' AND battery_failure_value = '0-0-0' ";
                            } else if(soc_type==3){
                                subQuery = " AND battery_soc < '50' AND battery_soh >= '80' AND battery_temperature < '50' AND a1_mosfet_temperature < '50' AND battery_failure_value = '0-0-0'";
                            }
       
                             var queryString_SSB = "SELECT battery_soc FROM ss_battery WHERE 1=1 AND imei = '"+imei+"' "+subQuery+" ORDER BY battery_soc DESC";
                             con.query(queryString_SSB,function(err_SSB,rows_SSB) {
                               if(rows_SSB.length > 0) {
                                   res_arr = { status: 1, message: 'Details Found', data:rows_SSB };
                                   res.send(res_arr);
                               }else {
                                   res_arr = { status: 0, message: 'Details Not Found. Try again' };
                                   res.send(res_arr);
                               }   
                           });
                       } else {
                           res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                           res.send(res_arr);
                       }
                       } else {
                           res_arr = { status: 0, message: 'Invalid User. Try again' };
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
       