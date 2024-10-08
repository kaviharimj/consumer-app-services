var con = require('./../config_consumer');
module.exports.get_swapping_station_max_soc =function (req, res) {
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
	

	
	if (validation_status) {
		 var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				 var queryString_U = "select name,mobile_number,email_id,status,wallet_amount from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
                            var queryString_SS = "SELECT IFNULL(MAX(battery_soc), '') AS max_battery_soc FROM ss_battery WHERE 1=1 AND imei = '"+imei+"'";
							con.query(queryString_SS, function (err_SS, rows_SS) {
								if(rows_SS.length > 0) {
                                    res_arr = { status: 1, message: 'Details Found', data: rows_SS};
                                    res.send(res_arr);				
							
								} else {
									res_arr = { status: 0, message: 'Details Not Found' };
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