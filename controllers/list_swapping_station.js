var con = require('./../config_consumer'); //1.list available ss and high soc,low soc
module.exports.list_swapping_station =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var latitude = req.body.latitude;
    var longitude = req.body.longitude;
	
	if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
	if (latitude == undefined || latitude == 'undefined') latitude = '';
	if (longitude == undefined || longitude == 'undefined') longitude = '';
	
	var validation_status = 1;
	
	if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (latitude == '') {
        res_arr = { status: '0', message: 'Latitude is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (longitude == '') {
        res_arr = { status: '0', message: 'Longitude  is empty' };
        res.send(res_arr);
        validation_status = 0;
    }
	
	if (validation_status) {
		var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				 var queryString_U = "select name, mobile_number, email_id, status, wallet_amount from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
							var queryString_SS = "SELECT SS.id,SS.station_name,SS.imei,SS.station_address,SS.station_city_name,SS.station_state_name,SS.station_country_name,SS.station_pincode,SS.station_latitude,SS.station_longitude,SUM(CASE WHEN SSB.battery_soc >='90' AND SSB.battery_soh >= '80' AND SSB.battery_temperature < '50' AND SSB.a1_mosfet_temperature < '50' AND SSB.battery_failure_value = '0-0-0' THEN 1 ELSE 0 END) AS soc_high,SUM(CASE WHEN SSB.battery_soc >= '50' AND SSB.battery_soc < '90' AND SSB.battery_soh >= '80' AND SSB.battery_temperature < '50' AND SSB.a1_mosfet_temperature < '50' AND SSB.battery_failure_value = '0-0-0' THEN 1 ELSE 0 END) AS soc_mid,SUM(CASE WHEN SSB.battery_soc < '50' AND SSB.battery_soh >= '80' AND SSB.battery_temperature < '50' AND SSB.a1_mosfet_temperature < '50' AND SSB.battery_failure_value = '0-0-0' THEN 1 ELSE 0 END) AS soc_low,DATE_FORMAT(SSB.gps_datetime,'%d-%m-%Y %H:%m:%S')AS gps_datetime  FROM swapping_station SS LEFT JOIN ss_battery SSB ON SS.imei = SSB.imei WHERE SS.company_id = '"+rows_A[0].company_id+"' AND SS.branch_id = '"+rows_A[0].branch_id+"' AND SS.status = '1'  AND SSB.gps_datetime >= (DATE_SUB(NOW(), INTERVAL 30 MINUTE)) GROUP BY SS.imei";
							console.log(queryString_SS);
							con.query(queryString_SS, function (err_SS, rows_SS) {
								if (rows_SS.length > 0) {
									res_arr = { status: 1, message: 'Swapping Station Details Found', data: rows_SS };
                         	   		res.send(res_arr);
								}else{
									res_arr = { status: 0, message: 'Swapping Station Details not Found'};
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