var con = require('./../config_consumer');
var request = require("request");

module.exports.ss_send_start_command_v2 =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var imei = req.body.imei;

    var validation_status = 1;

    if(api_key == undefined || api_key == "undefined") api_key = '';
    if(user_id == undefined || user_id == 'undefined') user_id = '';
	if(imei == undefined || imei == 'undefined') imei = '';

    if (api_key == '') {
        res_arr = { status: 0, message: 'API key is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if(imei == ''){
        res_arr = { status: 0, message: 'IMEI is empty' };
        res.send(res_arr);
        validation_status = 0;
    }
 
    if (validation_status) {
        var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {
              var queryString_D = "select swapping_station_number,station_name,station_address,station_country_id,station_country_name,station_state_id,station_state_name,station_city_id,station_city_name,station_pincode,station_latitude,station_longitude,contact_person,contact_number, charging_slot_specification, charging_slot_rows, charging_slot_columns, total_charging_slots, swapping_station_type, imei,company_id,branch_id,id,distributor_id,dealer_id,retailer_id, battery_mode_status from swapping_station where imei = '" +imei + "' AND company_id ='" + rows_A[0].company_id + "'";
              	con.query(queryString_D, function (err_D, rows_D) { 
                if(rows_D.length > 0) {
					//if(rows_D[0].battery_mode_status == '0' || rows_D[0].battery_mode_status == '6') {
						var queryString_U = "select name, mobile_number, email_id, status, wallet_amount, customer_id from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
						con.query(queryString_U, function (err_U, rows_U) { 
							if (rows_U.length > 0) {
							if(rows_U[0].status == 1) {
								var queryString_C = "select customer_id, customer_name, mobile_number, email_id, status from customer where customer_id = '" +rows_U[0].customer_id+ "' AND company_id ='" + rows_A[0].company_id + "'";
								con.query(queryString_C, function (err_C, rows_C) { 
								if (rows_C.length > 0) {
									if(rows_C[0].status == 1) { 
										if(rows_U[0].wallet_amount >= 52) {		//Check whether he is having sufficient balance in his wallet to proceed
										const currentDate = new Date();
										const formattedDate = `${currentDate.getFullYear().toString().slice(-2)}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
										const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;										
										var ss_log_number = formattedDate +formattedTime;

                                      var command;
                                      command = '$TXN_START,'+rows_U[0].name+','+ss_log_number+'#';
										//command = '$TXN_START,'+rows_U[0].name+',240803094409#';
                                      let encoded_val = encodeURIComponent(command);
                                             
									var url ="http://localhost:9099/send_cmd?imei="+imei+"&root_topic=3&publish_topic=control&command="+encoded_val+"&created_by="+user_id+"&source=consumer_app";			
                                    request({
										url: url,
										json: true
										},function (error, response, body) {
											if(!error) { 
												setTimeout(() => {
												var queryString_DD = "SELECT imei,recent_fota_status, recent_fota_data_inserted_datetime FROM ddevice WHERE 1=1 AND imei = '"+imei+"' AND recent_fota_status LIKE '%"+command+"%' AND recent_fota_data_inserted_datetime >= DATE_SUB(NOW(), INTERVAL 1 MINUTE)";													
												con.query(queryString_DD, function (err_DD, rows_SelDD) {														
												if(!err_DD) {
													if (rows_SelDD.length > 0) {
													setTimeout(() => {
													var queryString_D_V2 = "select battery_mode_status from swapping_station where imei = '" +imei + "' AND company_id ='" + rows_A[0].company_id + "'";	
													con.query(queryString_D_V2, function (err_D_V2, rows_SelD_V2) {
													if(rows_SelD_V2[0].battery_mode_status == '1' ) {		//Proceed only if SWP_START data received
														var queryString_InsSSL = "INSERT INTO ss_log SET ss_log_number ='"+ss_log_number+"',distributor_id = '"+rows_D[0].distributor_id+"' ,dealer_id = '"+rows_D[0].dealer_id+"',retailer_id = '"+rows_D[0].retailer_id+"',company_id = '"+rows_D[0].company_id+"', branch_id = '"+rows_D[0].branch_id+"', swapping_station_id = '"+rows_D[0].id+"', swapping_station_number = '"+rows_D[0].swapping_station_number+"', station_name = '"+rows_D[0].station_name+"', station_address = '"+rows_D[0].station_address+"', station_country_id = '"+rows_D[0].station_country_id+"', station_country_name = '"+rows_D[0].station_country_name+"', station_state_id = '"+rows_D[0].station_state_id+"', station_state_name = '"+rows_D[0].station_state_name+"', station_city_id = '"+rows_D[0].station_city_id+"', station_city_name = '"+rows_D[0].station_city_name+"', station_pincode = '"+rows_D[0].station_pincode+"', station_latitude = '"+rows_D[0].station_latitude+"', station_longitude = '"+rows_D[0].station_longitude+"', contact_person = '"+rows_D[0].contact_person+"', contact_number = '"+rows_D[0].contact_number+"', charging_slot_specification = '"+rows_D[0].charging_slot_specification+"', charging_slot_rows = '"+rows_D[0].charging_slot_rows+"', charging_slot_columns = '"+rows_D[0].charging_slot_columns+"', total_charging_slots = '"+rows_D[0].total_charging_slots+"', swapping_station_type = '"+rows_D[0].swapping_station_type+"', imei = '"+rows_D[0].imei+"', battery_mode_user_id='"+user_id+ "', battery_mode_customer_id = '"+rows_C[0].customer_id+"', battery_mode_customer_name = '"+rows_C[0].customer_name+"', battery_mode_mobile_number = '"+rows_C[0].mobile_number+"', battery_mode_email_id = '"+rows_C[0].email_id+"', battery_mode_start_datetime = NOW(), created_datetime = NOW(), battery_mode_status = 1"; 
											con.query(queryString_InsSSL, function (err_InsSSL, rows_InsSSL) {								
												if(!err_InsSSL) {
													if(rows_InsSSL.insertId > 0) {
														var queryString_UpdSS = "UPDATE swapping_station SET battery_mode_cabin_id_accp = '', battery_id_no_accp = '', battery_accp_soc = '', battery_accp_soh = '', battery_mode_cabin_id_hndo = '', battery_id_no_hndo = '', battery_hndo_soc = '', battery_hndo_soc_diff = '', battery_hndo_soh = '', battery_hndo_soh_diff = '', battery_mode_vehicle_id = '', battery_mode_registration_number = '', battery_mode_user_id='"+user_id+ "', battery_mode_customer_id = '', battery_mode_customer_name = '', battery_mode_mobile_number = '', battery_mode_email_id = '', battery_mode_start_datetime = '', battery_mode_end_datetime = '', battery_mode_total_time = '', ss_log_id = '"+rows_InsSSL.insertId+"' WHERE imei = '"+imei+"'";
														con.query(queryString_UpdSS, function (err_UpdSS, rows_UpdSS) {
															res_arr = { status: 1, message: 'First Level Verification Done' , ss_log_number: ss_log_number };
															res.send(res_arr);	
														});
													} else {
														res_arr = { status: 0, message: 'Could not able to insert a log. Try Again' };
														res.send(res_arr);	
													}
												} else {
													res_arr = { status: 0, message: 'Error while inserting a log. Try Again' };
													res.send(res_arr);
												}
											});
											//first query ends
										} else {
											res_arr = { status: 0, message: 'Previous transaction is not completed yet. Please Wait' };
											res.send(res_arr);		
										}
										});
										//second query ends
										}, 3000);
												
										} else {
											res_arr = { status: 0, message: 'Transaction response not received from machine. Try Again' };
											res.send(res_arr);
										}
									} else {
										res_arr = { status: 0, message: 'Error while checking transaction response. Try Again' };
										res.send(res_arr);
									}

								});
								}, 3000);
								} else {
									res_arr = { status: 0, message: "Could not able to send transaction start command. Try Again" };
									res.send(res_arr);
								}
								});	
								} else {  
									res_arr = { status: 0, message: "You have insufficient amount. Kindly add amount to your wallet and proceed" };
									res.send(res_arr);
								}
								} else {
									res_arr = { status: 0, message: 'Your customer account is inactive. Contact Admin' };
									res.send(res_arr);
								}
								} else {
									res_arr = { status: 0, message: 'Invalid Customer. Contact Admin' };
									res.send(res_arr);
								}
								});
							} else {
								res_arr = { status: 0, message: 'Your user account is inactive. Contact Admin' };
								res.send(res_arr);
							}
						} else {
							res_arr = { status: 0, message: 'Invalid User. Contact Admin'};
							res.send(res_arr);
						}
					});
				/*} else {
					res_arr = { status: 0, message: 'Previous transaction is not yet completed. Please wait' };
					res.send(res_arr);
				}*/
          } else {
			res_arr = { status: 0, message: 'QR Code not matching with any of the Swapping Station. Try again' };
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