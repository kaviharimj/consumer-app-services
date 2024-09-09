var con = require('./../config_consumer');
var mqtt = require('mqtt');
module.exports.get_swapping_station_details_v2 =function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var imei = req.body.imei;
	
    var validation_status = 1;	
	if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
	if (imei == undefined || imei == 'undefined') imei = '';
	
	if (api_key == '') {
        res_arr = { status: 0, message: 'API key is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if( imei == ''){
        res_arr = { status: 0, message: 'IMEI is empty' };
        res.send(res_arr);
        validation_status = 0;
    }
	
	var serverUrl = 'tcp://3.109.104.12:1883';
    var clientId = 'Command-QT-BATT-JSON';
    var username = 'ebike_iot';
    var password = 'ebike_iot';
	
    var client = mqtt.connect(serverUrl, {
    username: username,
    password: password,
    clientId: clientId
    });
	
	if (validation_status) {
		 var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				 var queryString_U = "select name,mobile_number,email_id,status,wallet_amount from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
							var queryString_SS = "SELECT id, swapping_station_number, station_name, battery_mode_status, (CASE WHEN battery_mode_status = '1' THEN '1-Swapping Initiated' WHEN battery_mode_status = '4' THEN '1-Collect Your Battery' WHEN battery_mode_status = '6' THEN '1-Transaction Completed' WHEN battery_mode_status = '7' THEN '0-Invalid Battery Kept' WHEN battery_mode_status = '8' THEN '0-Failed To Open Empty Door' WHEN battery_mode_status = '9' THEN '0-Failed To Open Withdrawal Door' WHEN battery_mode_status = '10' THEN '0-Time Out 1' WHEN battery_mode_status = '20' THEN '0-Time Out 2' WHEN battery_mode_status = '21' THEN '0-Time Out 3' WHEN battery_mode_status = '14' THEN '0-lOW-SOC' WHEN battery_mode_status = '16' THEN '0-Sorry to proceed as batteries are available with low SOC. Collect your battery' WHEN battery_mode_status = '22' THEN '0-All Full' ELSE '' END) AS battery_mode_status_val, battery_id_no_accp FROM swapping_station WHERE 1=1 AND imei = '"+imei+"' limit 0,1";
							con.query(queryString_SS, function (err_SS, rows_SS) {
								if(rows_SS.length > 0) {
										//If Battery Handover Planned, then send Pay done/fail status. 20231217: Included x to avoid below case as Srihari sent PAYDONE in his code
										if(rows_U[0].wallet_amount >= '52') {
												res_arr = { status: 1, message: 'Sufficient amount found in wallet to proeed', data: rows_SS};
												res.send(res_arr);
										 }else{
                                            res_arr = { status: 0, message: 'Sufficient amount not found' };
                            		        res.send(res_arr);
                                         }	
							
								} else {
									res_arr = { status: 0, message: 'Swapping Stations detail not found' };
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