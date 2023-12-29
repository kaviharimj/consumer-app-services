var con = require('./../config_consumer');
module.exports.list_complaint_details = function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var validation_status = 1;
  
    if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = ''; 

    if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } 
      
    if (validation_status) {
        var queryString_A = "select id,company_id from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {             
                var queryString_U = "select status from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";              
                  con.query(queryString_U, function (err_U, rows_U) { 
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            var queryString_VS ="SELECT id as complaint_id,vehicle_complaint_number, registration_number, vehicle_model_code, complaint_type, complaint_remarks, DATE_FORMAT(created_datetime, '%d-%m-%Y %H:%i') as date, status, (CASE WHEN consumer_feedback != '' THEN '1' ELSE '0' END)AS feedback_status,(CASE WHEN STATUS = 0 THEN 'Open' WHEN STATUS = 1 THEN 'In Review' WHEN STATUS = 2 THEN 'Closed' ELSE '' END )as status_val,(CASE WHEN STATUS = 0 THEN '#EE0000' WHEN STATUS = 1 THEN '#39B7CD' WHEN STATUS = 2 THEN '#629632' ELSE '' END )AS status_color_code FROM vehicle_complaint WHERE 1=1 AND user_id ='"+user_id+"' order by id desc";
                         // console.log(queryString_VS);
                            con.query(queryString_VS, function (err_VS, rows_VS) {
                                if (rows_VS.length > 0) {                              
                                    res_arr = { status: 1, message: 'Details Found', data: rows_VS };
                                    res.send(res_arr);      
                                }else{
                                    res_arr = { status: 0, message: "No Details Found" };
                                    res.send(res_arr);  
                                }                   
                        });
                        } else {
                            res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
						    res.send(res_arr);
                        }
                    } else {
                        res_arr = { status: 0, message: 'Invalid Username or Password Try again' };
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
