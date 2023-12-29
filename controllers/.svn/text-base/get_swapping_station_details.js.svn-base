var con = require('./../config_consumer');
var mqtt = require('mqtt');
module.exports.get_swapping_station_details =function (req, res) {
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
	
	var serverUrl = 'tcp://3.6.49.44:8883';
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
							var queryString_SS = "SELECT id, swapping_station_number, station_name, battery_mode_status, (CASE WHEN battery_mode_status = '1' THEN '1-Swapping Initiated' WHEN battery_mode_status = '2' THEN '1-Battery Accepted' WHEN battery_mode_status = '3' THEN '1-Processing' WHEN battery_mode_status = '4' THEN '1-Collect Your Battery' WHEN battery_mode_status = '5' THEN '1-Handover Ends' WHEN battery_mode_status = '6' THEN '1-Transaction Completed' WHEN battery_mode_status = '7' THEN '0-Invalid Battery Kept' WHEN battery_mode_status = '8' THEN '0-Failed To Open Empty Door' WHEN battery_mode_status = '9' THEN '0-Failed To Open Withdrawal Door' WHEN battery_mode_status = '10' THEN '0-Time Out' WHEN battery_mode_status = '11' THEN '0-Insufficient amount in your wallet' WHEN battery_mode_status = '12' THEN '0-Unauthorised Access' WHEN battery_mode_status = '13' THEN '1-Payment Processing' ELSE '' END) AS battery_mode_status_val, battery_id_no_accp FROM swapping_station WHERE 1=1 AND imei = '"+imei+"' limit 0,1";
							con.query(queryString_SS, function (err_SS, rows_SS) {
								if(rows_SS.length > 0) {
									if(rows_SS[0].battery_mode_status=='3') {		//If Battery Handover Planned, then send Pay done/fail status
										if(rows_U[0].wallet_amount >= '250') {
											//Proceed if he have sufficient amount in wallet
											//var queryString_VDC = "SELECT VD.vehicle_id,VD.company_id,VD.branch_id,VD.dealer_id,VD.retailer_id,VD.customer_id,VD.vehicle_model_id,VD.vehicle_model_name,VD.vehicle_variant_id,VD.vehicle_variant_name,VD.vehicle_color_id,VD.vehicle_color_name,VD.vehicle_price_id,VD.vehicle_model_code,VD.chassis_number,VD.imei,VD.registration_number,C.customer_id, C.customer_name, C.mobile_number, C.email_id FROM vehicle_details2 VD, customer C, users U  WHERE (VD.battery_serial_number = '"+rows_SS[0].battery_id_no_accp+"' OR VD.battery_serial_number2 = '"+rows_SS[0].battery_id_no_accp+"') AND VD.customer_id = C.customer_id AND C.customer_id = U.customer_id AND U.user_id = '"+user_id+"' LIMIT 0,1;";
											var queryString_VDC = "select * from vehicle_details2 where 1=1 limit 0,1";
											con.query(queryString_VDC, function (err_VDC, rows_VDC) {
												if(rows_VDC.length > 0) {			//Check if battery belongs to him or not and proceed PAY_DONE Command
												   command = '$PAY_DONE#';
												   client.on('connect', () => {
													root_topic_val = '/bnc/12/1.0/'+imei+'/control';
													client.publish(root_topic_val,command,function (error_pay) {
														if(!error_pay) {
															var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"', raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'" ;
															con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
																if (err_InsLHA)
																{
																	// console.log("Error in insert into ss_battery_history_archive");
																}
																else
																{
																	// console.log("Record inserted into ss_battery_history_archive");
																}
															});
															
															/* Update status in ss_battery */
															var queryString_UpdSS = "update swapping_station SET battery_mode_status = '13' where id = '"+rows_SS[0].id+"'";
															con.query(queryString_UpdSS, function (err_UpdSS, result_UpdSS) {
															if(err_UpdSS) {
																
															}
															});
															
															res_arr = { status: 1, message: 'Payment Success', data: rows_SS};
															res.send(res_arr);
														} else {
															res_arr = { status: 0, message: 'Could not able to process request. Try again', data: rows_SS};
															res.send(res_arr);
														}
													});
													client.end();
												 });
												} else {							//If battery not belongs to him, then send command to device to open previous cabin to get back his battery
													command = '$INVL_USR#';
												   	client.on('connect', () => {
													root_topic_val = '/bnc/12/1.0/'+imei+'/control';
													client.publish(root_topic_val,command,function (error_pay) {
														if(!error_pay) {
															var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"', raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'" ;
															con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
																if (err_InsLHA)
																{
																	// console.log("Error in insert into ss_battery_history_archive");
																}
																else
																{
																	// console.log("Record inserted into ss_battery_history_archive");
																}
															});
															
															/* Update status in ss_battery */
															var queryString_UpdSS = "update swapping_station SET battery_mode_status = '12' where id = '"+rows_SS[0].id+"'";
															con.query(queryString_UpdSS, function (err_UpdSS, result_UpdSS) {
															if(err_UpdSS) {
																
															}
															});
															res_arr = { status: 0, message: 'This battery not belongs to you. Try again', data: rows_SS };
															res.send(res_arr);
														} else {
															res_arr = { status: 0, message: 'Could not able to process request. Try again', data: rows_SS};
															res.send(res_arr);
														}
													});
													client.end();
												 });	
												}
											});
										} else {									//Deny if he don't have sufficient amount in wallet
										   command = '$PAY_FAIL#';
										   client.on('connect', () => {
											root_topic_val = '/bnc/12/1.0/'+imei+'/control';
											client.publish(root_topic_val,command,function (error_pay) {
												if(!error_pay) {
													var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"',raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'" ;
													con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
														if (err_InsLHA)
														{
															// console.log("Error in insert into ss_battery_history_archive");
														}
														else
														{
															// console.log("Record inserted into ss_battery_history_archive");
														}
													});
													
													/* Update status in ss_battery */
													var queryString_UpdSS = "update swapping_station SET battery_mode_status = '11' where id = '"+rows_SS[0].id+"'";
													con.query(queryString_UpdSS, function (err_UpdSS, result_UpdSS) {
													if(err_UpdSS) {
														
													}
													});
													
													res_arr = { status: 0, message: 'You have insufficient amount in your wallet. Kindly add amount and try again', data: rows_SS};
													res.send(res_arr);
												} else {
													res_arr = { status: 0, message: 'Could not able to process request. Try again', data: rows_SS};
													res.send(res_arr);
												}
											});
											client.end();
										 });
								}
								} else {
									res_arr = { status: 1, message: 'Details Found', data: rows_SS };
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