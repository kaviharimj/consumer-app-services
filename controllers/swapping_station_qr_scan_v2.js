var con = require('./../config_consumer');
var geodist=require('geodist');

module.exports.swapping_station_qr_scan_v2 =
 function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var imei = req.body.imei;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
//console.log(user_id);
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


    var distance,dist;

 
    if (validation_status) {
         
        var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {
              var queryString_D = "select station_latitude, station_longitude from swapping_station where imei = '" +imei + "' AND company_id ='" + rows_A[0].company_id + "'";
              	con.query(queryString_D, function (err_D, rows_D) { //console.log(queryString_D);
                if(rows_D.length > 0) {
                    dist = geodist({lat: latitude, lon: longitude }, {lat: rows_D[0].station_latitude, lon: rows_D[0].station_longitude},{format: true, unit: 'meters'});
                    distance = splitStr(dist);
                   // console.log(distance);
           
                	//if (distance)   //Check whether user location is inside geolocation of swapping station premises to proceed. 20231216: old condition: (distance < 100) and changed New condition as per update :(distance < 30)
					if(distance < 30) {
						var queryString_U = "select name, mobile_number, email_id, status, wallet_amount, customer_id from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
						con.query(queryString_U, function (err_U, rows_U) {  //console.log(queryString_U);
						if (rows_U.length > 0) {
							if(rows_U[0].status == 1) {
								 
									
										if(rows_U[0].wallet_amount >= 52) {			//Check whether he is having sufficient balance in his wallet to proceed
												//Once QR code scanned, Insert into log table		
										const currentDate = new Date();
										const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
										const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;										
										var ss_log_number_v = formattedDate +formattedTime;

                                        res_arr = { status: 1, message: 'First Level Verification Done', ss_log_number: ss_log_number_v };
										res.send(res_arr);
																						
												
										} else {  //console.log("error");console.log(rows_U[0].wallet_amount);
											res_arr = { status: 0, message: "You have insufficient amount. Kindly add amount to your wallet and proceed" };
											res.send(res_arr);
										}
									
								
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