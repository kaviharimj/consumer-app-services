var con = require('./../config_consumer');
var mqtt = require('mqtt');
module.exports.get_payment_access2 =
function (req, res) {
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
				var queryString_U = "select name,mobile_number,email_id,status,wallet_amount from users where user_id = '" +user_id + "'  AND company_id ='" + rows_A[0].company_id + "'";
				con.query(queryString_U, function (err_U, rows_U) { 
					if (rows_U.length > 0) {
						if(rows_U[0].status == 1) {
							if(rows_U[0].wallet_amount >= '250') {		//Proceed if he have sufficient amount in wallet
							   command = '$PAY_DONE#';
							   client.on('connect', () => {
								root_topic_val = '/bnc/12/1.0/'+imei+'/control';
								client.publish(root_topic_val,command,function (error_pay) {
									if(!error_pay) {
										var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"', raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'" ;
										con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
											if (err_InsLHA)
											{
												// console.log("Error in insert into SS_LOG");
											}
											else
											{
												// console.log("Record inserted into SS_LOG");
											}
										});
										res_arr = { status: 1, message: 'Payment Success'};
										res.send(res_arr);
									} else {
										res_arr = { status: 0, message: 'Could not able to process request. Try again'};
										res.send(res_arr);
									}
								});
								client.end();
							 });
						} else {										//Deny if he don't have sufficient amount in wallet
							   command = '$PAY_FAIL#';
							   client.on('connect', () => {
								root_topic_val = '/bnc/12/1.0/'+imei+'/control';
								client.publish(root_topic_val,command,function (error_pay) {
									if(!error_pay) {
										var queryString_InsLHA = "insert into ss_battery_history_archive SET imei = '"+imei+"',raw_data = '"+command+"', created_datetime = NOW(), raw_data_type = 'Command'" ;
										con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
											if (err_InsLHA)
											{
												// console.log("Error in insert into SS_LOG");
											}
											else
											{
												// console.log("Record inserted into SS_LOG");
											}
										});
										res_arr = { status: 1, message: 'You have insufficient amount in your wallet. Kindly add amount and try again'};
										res.send(res_arr);
									} else {
										res_arr = { status: 0, message: 'Could not able to process request. Try again'};
										res.send(res_arr);
									}
								});
								client.end();
							 });
						}
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