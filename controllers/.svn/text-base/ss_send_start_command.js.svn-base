var con = require('./../config_consumer');
var mqtt = require('mqtt');

module.exports.ss_send_start_command =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var imei = req.body.imei;
	
    var validation_status = 1;
	
	if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
	if (imei == undefined || imei == 'undefined') imei = '';
	
	if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if( imei == ''){
        res_arr = { status: 0, message: 'Imei Number Is empty' };
        res.send(res_arr);
        validation_status = 0;
    }
	
	if (validation_status) {
		 var queryString_A = "select id, company_id, branch_id, description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				 var queryString_U = "select name, mobile_number, email_id, status, wallet_amount from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
							if(rows_U[0].wallet_amount >= '250') {		//Allow to proceed if consumer has sufficient balance in his wallet
								var queryString_SS = "SELECT id, swapping_station_number, station_name, battery_mode_status FROM swapping_station WHERE 1=1 AND imei = '"+imei+"' limit 0,1";
								con.query(queryString_SS, function (err_SS, rows_SS) {
									if (rows_SS.length > 0) {
										//Check for maximum soc level battery to send its cabin id over MQTT
										var queryString_SSB = "SELECT cabin_id FROM ss_battery WHERE 1=1 AND company_id = '"+rows_A[0].company_id+"' AND branch_id = '"+rows_A[0].branch_id+"' AND imei = '"+imei+"' AND battery_soh >= '80' AND battery_temperature < '50' AND a1_mosfet_temperature < '50' AND battery_failure_value = '0-0-0' ORDER BY battery_soc DESC LIMIT 0,1";
											con.query(queryString_SSB, function (err_SSB, rows_SSB) {
											if (rows_SSB.length > 0) {
												var serverUrl = 'tcp://3.6.49.44:8883';
												var clientId = 'swp_start';
												var username = 'ebike_iot';
												var password = 'ebike_iot';
			
												var client = mqtt.connect(serverUrl, {
													username: username,
													password: password,
													clientId: clientId
												});
												
												command = '$TXN_START,'+rows_U[0].name+','+rows_SSB[0].cabin_id+'#';
												client.on('connect', () => {
													root_topic_val = '/bnc/12/1.0/'+imei+'/control';
													client.publish(root_topic_val,command,function (err) {
														if(!err) {
															var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"', raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'";
															con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
															/*if (err_InsLHA)
															console.log("error in insert into ss_battery_history_archive*");
															else
															console.log("1 record inserted into ss_battery_history_archive");*/
															});
															
															var queryString_InsLHC = "CALL sp_location_history_command('"+imei+"','"+command+"','','','','','','')";
															con.query(queryString_InsLHC, function (err_InsLHC, result_InsLHC) {
																/*if (err_InsLHC)
																	console.log("Error in insert into sp_location_history_command");
																else
																	console.log("Record inserted into sp_location_history_command");*/
															});
															res_arr = { status: 1, message: "Command Sent Successfully" };
															res.send(res_arr);
														} else{
															res_arr = { status: 0, message: "Could not able to send command. Try Again" };
															res.send(res_arr);
														}
													});
													client.end();
												}); //client.on connect ends
											} else {
												res_arr = { status: 0, message: 'No battery found with maximum SOC level. Try Later' };
												res.send(res_arr);
											}
											});
									} else {
										res_arr = { status: 0, message: 'Swapping Station Details Not Found. Try Again' };
										res.send(res_arr);
									}
								});
							} else {
								res_arr = { status: 0, message: 'You have insufficient amount. Kindly add amount to your wallet and proceed' };
                            	res.send(res_arr);
							}
						} else {
							res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                            res.send(res_arr);
						}
					} else {
						res_arr = { status: 0, message: 'Invalid Username  Try again'};
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