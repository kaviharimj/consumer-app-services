var con = require('./../config_consumer');
var geodist=require('geodist');

module.exports.swapping_station_qr_scan =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var imei = req.body.imei;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    var validation_status = 1;

    if(api_key == undefined || api_key == "undefined") api_key = '';
    if(user_id == undefined || user_id == 'undefined') user_id = '';
	if(imei == undefined || imei == 'undefined') imei = '';
	if(latitude == undefined || latitude == 'undefined') latitude = '';
	if(longitude == undefined || longitude == 'undefined') longitude = '';

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
    } else if(latitude == ''){
        res_arr = { status: 0, message: 'Latitude is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if(longitude == ''){
        res_arr = { status: 0, message: 'Longitude is empty' };
        res.send(res_arr);
        validation_status = 0;
    }


    var distance,dist,max_soh_cabin;
    var subqry='';

    if(api_key !=''){
        subqry+=""; 
    }else{
        subqry+='';
    }
 
    if (validation_status) {
         
        var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {
              var queryString_D = "select id, company_id, branch_id, swapping_station_number, station_name, station_address, station_country_id, station_country_name, station_state_id, station_state_name, station_city_id, station_city_name, station_pincode, station_latitude, station_longitude, contact_person, contact_number, charging_slot_specification, charging_slot_rows, charging_slot_columns, total_charging_slots, swapping_station_type, imei from swapping_station where imei = '" +imei + "' AND company_id ='" + rows_A[0].company_id + "'";
              	con.query(queryString_D, function (err_D, rows_D) { //console.log(queryString_D);
                if(rows_D.length > 0) {
                    dist = geodist({lat: latitude, lon: longitude }, {lat: rows_D[0].station_latitude, lon: rows_D[0].station_longitude},{format: true, unit: 'meters'});
                    distance = splitStr(dist);
                    //console.log(distance);
                	//if (distance)   //Check whether user location is inside geolocation of swapping station premises to proceed. 20231216: old condition: (distance < 100)
					if(distance < 100) {
						var queryString_U = "select name, mobile_number, email_id, status, wallet_amount, customer_id from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
						con.query(queryString_U, function (err_U, rows_U) {  //console.log(queryString_U);
						if (rows_U.length > 0) {
							if(rows_U[0].status == 1) {
								var queryString_C = "select customer_id, customer_name, mobile_number, email_id, status from customer where customer_id = '" +rows_U[0].customer_id+ "' AND company_id ='" + rows_A[0].company_id + "'";
								con.query(queryString_C, function (err_C, rows_C) {  //console.log(queryString_C);
								if (rows_C.length > 0) {
									if(rows_C[0].status == 1) { //console.log(rows_U[0].wallet_amount);
										if(rows_U[0].wallet_amount >= 52) {			//Check whether he is having sufficient balance in his wallet to proceed
												//Once QR code scanned, Insert into log table		
										const currentDate = new Date();
										const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
										const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;										
										var ss_log_number_v = formattedDate +formattedTime;
																						
												var queryString_InsSSL = "INSERT INTO ss_log SET ss_log_number ='"+ss_log_number_v+"', company_id = '"+rows_D[0].company_id+"', branch_id = '"+rows_D[0].branch_id+"', swapping_station_id = '"+rows_D[0].id+"', swapping_station_number = '"+rows_D[0].swapping_station_number+"', station_name = '"+rows_D[0].station_name+"', station_address = '"+rows_D[0].station_address+"', station_country_id = '"+rows_D[0].station_country_id+"', station_country_name = '"+rows_D[0].station_country_name+"', station_state_id = '"+rows_D[0].station_state_id+"', station_state_name = '"+rows_D[0].station_state_name+"', station_city_id = '"+rows_D[0].station_city_id+"', station_city_name = '"+rows_D[0].station_city_name+"', station_pincode = '"+rows_D[0].station_pincode+"', station_latitude = '"+rows_D[0].station_latitude+"', station_longitude = '"+rows_D[0].station_longitude+"', contact_person = '"+rows_D[0].contact_person+"', contact_number = '"+rows_D[0].contact_number+"', charging_slot_specification = '"+rows_D[0].charging_slot_specification+"', charging_slot_rows = '"+rows_D[0].charging_slot_rows+"', charging_slot_columns = '"+rows_D[0].charging_slot_columns+"', total_charging_slots = '"+rows_D[0].total_charging_slots+"', swapping_station_type = '"+rows_D[0].swapping_station_type+"', imei = '"+rows_D[0].imei+"', battery_mode_user_id='"+user_id+ "', battery_mode_customer_id = '"+rows_C[0].customer_id+"', battery_mode_customer_name = '"+rows_C[0].customer_name+"', battery_mode_mobile_number = '"+rows_C[0].mobile_number+"', battery_mode_email_id = '"+rows_C[0].email_id+"', battery_mode_start_datetime = NOW(), created_datetime = NOW()";
												con.query(queryString_InsSSL, function (err_InsSSL, rows_InsSSL) {  //console.log(queryString_InsSSL);
													if(!err_InsSSL) {
														if(rows_InsSSL.insertId > 0) {
															//Reset the previous values
															var queryString_UpdSS = "UPDATE swapping_station SET battery_mode_status = 0, battery_mode_cabin_id_accp = '', battery_id_no_accp = '', battery_accp_soc = '', battery_accp_soh = '', battery_mode_cabin_id_hndo = '', battery_id_no_hndo = '', battery_hndo_soc = '', battery_hndo_soc_diff = '', battery_hndo_soh = '', battery_hndo_soh_diff = '', battery_mode_vehicle_id = '', battery_mode_registration_number = '', battery_mode_user_id='"+user_id+ "', battery_mode_customer_id = '', battery_mode_customer_name = '', battery_mode_mobile_number = '', battery_mode_email_id = '', battery_mode_start_datetime = '', battery_mode_end_datetime = '', battery_mode_total_time = '', ss_log_id = '"+rows_InsSSL.insertId+"' WHERE imei = '"+imei+"'";
															con.query(queryString_UpdSS, function (err_UpdSS, rows_UpdSS) { //console.log(queryString_UpdSS);
															if(!err_UpdSS) {
																res_arr = { status: 1, message: 'First Level Verification Done', ss_log_number: ss_log_number_v };
																res.send(res_arr);
															} else {
																res_arr = { status: 0, message: 'Error received while updating data. Try Again' };
																res.send(res_arr);
															}
															});
														} else {
															res_arr = { status: 0, message: 'Could not able to maintain a log. Try Again' };
															res.send(res_arr);	
														}
													} else {
														res_arr = { status: 0, message: 'Error received while maintain a log. Try Again' };
														res.send(res_arr);
													}
												});		
										} else {  //console.log("error");console.log(rows_U[0].wallet_amount);
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
			 } else {	// distance
                res_arr = { status: 0, message: "You are not inside the Swapping Station Premises" };
                 res.send(res_arr);
             }
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

///////////////////////////////////////////////////

function splitStr(distance) {
    let distance_arrary = distance.split(" ");
    return distance_arrary['0'];
}

////////////////////////////////////////////////