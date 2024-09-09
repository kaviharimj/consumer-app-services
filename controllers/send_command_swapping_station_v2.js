var con = require('../config_consumer');
var request = require("request");
//var mqtt = require('mqtt');

module.exports.send_command_swapping_station_v2 =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var command_name = req.body.command_name;
	var imei=req.body.imei;
    var publish_topic = req.body.publish_topic;
    var validation_status = 1;
	
	if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
	if (command_name == undefined || command_name == 'undefined') command_name = '';
	if (imei == undefined || imei == 'undefined') imei = '';
    if (publish_topic == undefined || publish_topic == 'undefined') publish_topic = '';

	
	if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if(command_name == ''){
        res_arr = { status: 0, message: 'Command Is empty' };
        res.send(res_arr);
        validation_status = 0;
    }else if(imei == ''){
        res_arr = { status: 0, message: 'IMEI Is empty' };
        res.send(res_arr);
        validation_status = 0;
    }else if(publish_topic == ''){
        res_arr = { status: 0, message: 'Publish Topic Is empty' };
        res.send(res_arr);
        validation_status = 0;
    }
	
	if (validation_status) {
		 var queryString_A = "select id, company_id, branch_id, description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
			 if (rows_A.length > 0) {
				var queryString_U = "select name,mobile_number,email_id,status from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) {
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
							var queryString_SS = "SELECT * FROM swapping_station WHERE 1=1 AND imei = '"+imei+"' limit 0,1";
							con.query(queryString_SS, function (err_SS, rows_SS) {
								if (rows_SS.length > 0) {
                                    
                                    console.log('Process Initiated');
                                    let encoded_val = encodeURIComponent(command_name); 
									var url ="http://localhost:9099/send_cmd?imei="+imei+"&root_topic=3&publish_topic="+publish_topic+"&command="+encoded_val+"&created_by="+user_id+"&source=consumer_app";			
                                    request({
										url: url,
										json: true
										},function (error, response, body) {
														if(!error) {

                                                            if(command_name=='$PD_LOW_SOC#'){
                                                                    var BM_Status = '23';
                                                                }else if(command_name=='$DN_LOW_SOC#'){
                                                                    var BM_Status = '24';
                                                                }
                                                                    console.log(BM_Status);
                                                                var queryString_upd = "UPDATE swapping_station SET battery_mode_status = '"+BM_Status+"' WHERE id = '"+rows_SS[0].id+"'";
                                                                con.query(queryString_upd, function (err_upd, result_upd) {
                                                                    if (err_upd)
                                                                        console.log("Error in ss update");
                                                                    else
                                                                        console.log("Record updated into swapping_station");
                                                                });
														
														
															res_arr = { status: 1, message: "Command Sent Successfully" };
															res.send(res_arr);
															
														} else{
															res_arr = { status: 0, message: "Could not able to send command. Try Again" };
															res.send(res_arr);
														}
													
												}); 
											}else{
												res_arr = { status: 0, message: 'Swapping Station Details Not Found. Try Again' };
												res.send(res_arr);
											}
										});
										
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
