var con = require('./../config_consumer');

module.exports.list_ss_log =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var ss_log_number = req.body.ss_log_number;
	
	if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
	if (ss_log_number == undefined || ss_log_number == 'undefined') ss_log_number = '';
	
	var validation_status = 1;
	
	if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } 
var subquery='';
if(ss_log_number !=''){
    subquery="AND ss_log_number = '"+ ss_log_number+"'";
}else{
    subquery='';
}
	

	if (validation_status) {
		var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
       // console.log(queryString_A);
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				 var queryString_U = "select  status from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
			//console.log(queryString_U);
                 con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
						var queryString_SS = "SELECT ss_log_number,swapping_station_number,station_name,station_address,station_city_name,station_state_name,battery_mode_customer_name,battery_mode_mobile_number,	battery_mode_email_id,battery_mode_cabin_id_hndo,battery_id_no_accp,battery_accp_soc,battery_accp_soh,battery_id_no_hndo,battery_hndo_soc,battery_hndo_soc_diff,battery_hndo_soh,battery_hndo_soh_diff,imei,battery_mode_cabin_id_accp,DATE_FORMAT(battery_mode_start_datetime,'%d-%m-%Y %H:%i:%s') AS battery_mode_start_datetime, DATE_FORMAT(battery_mode_end_datetime,'%d-%m-%Y %H:%m:%s')AS battery_mode_end_datetime,TIME(battery_mode_start_datetime) AS start_time, TIME(battery_mode_end_datetime) AS end_time, battery_mode_total_time,total_amount,convenience_amount,grand_total_amount,(CASE WHEN battery_mode_status =4 THEN 'Completed' ELSE 'Cancelled' END)AS battery_mode_status_val,(CASE WHEN battery_mode_status =4 THEN '#629632' ELSE '#a94442' END)AS battery_mode_status_color_val  FROM ss_log  WHERE company_id = '"+rows_A[0].company_id+"' AND branch_id = '"+rows_A[0].branch_id+"' AND status = '1' "+subquery+"  AND battery_mode_user_id = '"+user_id+"' order by battery_mode_start_datetime desc ";
						//console.log(queryString_SS);
                            con.query(queryString_SS, function (err_SS, rows_SS) {
								if (rows_SS.length > 0) {
									res_arr = { status: 1, message: 'Swapping History Found ', data: rows_SS };
                         	   		res.send(res_arr);
								}else{
                                    res_arr = { status: 0, message: 'Swapping History Not Found' };
                                    res.send(res_arr);
                                }
							});
						} else {
							res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                            res.send(res_arr);
						}
					} else {
						res_arr = { status: 0, message: 'Invalid User. Try again'};
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