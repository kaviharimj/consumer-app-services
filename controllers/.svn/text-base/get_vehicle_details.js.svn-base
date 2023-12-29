// FOR DASHBOARD SERVICE
var con = require('./../config_consumer');
module.exports.get_vehicle_details=function(req,res){


    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
	var vehicle_id=req.body.vehicle_id;
    // console.log(api_key);

    var validation_status=1;

    if(api_key === 'undefined') api_key='';
    if(user_id === 'undefined') user_id='';
	if(vehicle_id === 'undefined') vehicle_id='';

    if(api_key=='') {
        res_arr = { status: 0, message: 'API key is empty' };
        res.send(res_arr);
        validation_status = 0;    
    }else if(user_id==''){
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;  
    }

    if(validation_status) {  
        
        var queryString_A = "select id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
        con.query(queryString_A,function(err_A,rows_A) {
            if(rows_A.length > 0) {
        ///////////////////////////////////////////////////////
            var queryString_A = "select customer_id, status from users where user_id = '"+user_id+"'";
              con.query(queryString_A,function(err_A,rows_A) {
				if(rows_A.length > 0) {
					if(rows_A[0].status==1) {
						if(vehicle_id > 0)
							subqry="AND vehicle_id='"+vehicle_id+"' ";
						else
							subqry="limit 0,1";

						var queryString_VD = "SELECT imei,vehicle_model_code,vehicle_model_name,vehicle_color_name, IFNULL(registration_number,'Last data received') as registration_number, vehicle_color_id FROM vehicle_details2 WHERE customer_id = '"+rows_A[0].customer_id+"' " +subqry;      // to get IMEI
						con.query(queryString_VD,function(err_UT,rows_VD) { 							
							if(rows_VD.length > 0) {
							   var imei = rows_VD[0].imei; 
								var queryString_DD = "SELECT battery_state AS B_state,TIME_TO_SEC(TIMEDIFF(NOW(), gps_datetime)) AS timediff_val,battery_current,a3_full_charge_capacity as capacity,imei, gps_datetime, model_no, lat_message, IFNULL(prev_lat_message,'') AS prev_lat_message, lon_message, IFNULL(prev_lon_message,'') AS prev_lon_message, CASE WHEN dis2_mode0_status = 0 AND dis2_mode1_status =0  THEN 'Normal' WHEN dis2_mode0_status = 0 AND dis2_mode1_status =1  THEN 'Eco' WHEN dis2_mode0_status = 1 AND dis2_mode1_status =0 THEN 'Sport' ELSE 'Eco' END AS ride_mode, ride_status, motor_speed_rpm, odometer_reading, today_km, battery_id_no, battery_soc, ROUND(total_discharge_avg_watthr_per_km,2) AS battery_watt_hr, battery_temperature, (CASE WHEN battery_state = 1 THEN 'Charging' ELSE 'Discharging' END) AS battery_state_val, total_charge_count AS no_of_times_battery_charged,(CASE WHEN gps_datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) THEN '0' ELSE '1' END) AS gps_status_val,(CASE WHEN gps_datetime < DATE_SUB(NOW(), INTERVAL 10 MINUTE) THEN '#C4C4C4' ELSE '#FF0000' END) AS gps_status_color_code, (CASE WHEN gps_datetime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND battery_soc <= 10 THEN '#FF0000' WHEN gps_datetime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND battery_soc > 10 AND battery_soc <= 40 THEN '#FF9900' WHEN gps_datetime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND battery_soc > 40 AND battery_soc <= 80 THEN '#00FF00' WHEN gps_datetime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND battery_soc > 80 THEN '#009900' ELSE '#333333' END) AS soc_color_code FROM ddevice WHERE imei = '"+imei+"'";
                                con.query(queryString_DD,function(err_U,rows_DD) {
 								if(rows_DD.length > 0) {

									//Charging Time Calculation
									if(rows_DD[0].B_state == 1 && rows_DD[0].timediff_val < '600' ) {
										var battery_current_calc = rows_DD[0].capacity/100;
										var one_min_battery_current = rows_DD[0].battery_current/60 ;  
										var balance_soc = 100 -  rows_DD[0].battery_soc;  
										var bal_charge_time = balance_soc * battery_current_calc; 	
										var bal_time = Number(bal_charge_time / one_min_battery_current); 
										var hours =   Math.floor(parseInt(bal_time / 60 ).toFixed(2));      
										var min = Math.floor(bal_time - (hours * 60)); 
										var charging_hrs= 'ET: '+hours +' hr '+min + ' mins'; 
										//console.log(charging_hrs);

										rows_DD[0].remaining_charge_time = charging_hrs;
									} else{
										rows_DD[0].remaining_charge_time = 'Battery Power';
									}




									//get Image to show based on color
									var queryString_VC = "select upload_vehicle_image from vehicle_color where id = '"+rows_VD[0].vehicle_color_id+"'";
									con.query(queryString_VC,function(err_VC,rows_VC) {
										if(rows_VC.length > 0) {
											rows_DD['0']['model_code'] = rows_VD[0].vehicle_model_code;
											rows_DD['0']['model_name'] = rows_VD[0].vehicle_model_name;
											rows_DD['0']['color_name'] = rows_VD[0].vehicle_color_name;
											rows_DD['0']['registration_number'] = rows_VD[0].registration_number;
											if(rows_VC[0].upload_vehicle_image!='')
												rows_DD['0']['upload_vehicle_image'] = 'http://iot.boommotors.com/evehicle_secure/other_uploads/vehicle_color/'+rows_VC[0].upload_vehicle_image;
											else
												rows_DD['0']['upload_vehicle_image'] = '';
												
											res_arr = { status: 1, message: 'Vehicle Details', data:rows_DD };
											res.send(res_arr);
									} else {
										res_arr = { status: 0, message: 'Vehicle color image not fould. Contact Admin' };
										res.send(res_arr);
									}
									});
								} else {
									res_arr = { status: 0, message: 'IMEI not found. Try again' };
									res.send(res_arr);
								}
							}); 
							} else {
								res_arr = { status: 0, message: 'Vehicle details not found. Try again' };
								res.send(res_arr);
							}
							});  
					} else{
						res_arr = { status: 0, message: 'Your account is inactive. Contact Dealer' };
						res.send(res_arr);
					}
				} else {
                    res_arr = { status: 0, message: 'User not exists. Contact Dealer' };
                    res.send(res_arr);
                }       
            });
    
                  ////////////////////////////////////////////////////
           }
           else{
            res_arr = { status: 0, message: 'API key not matching. Try again' };
            res.send(res_arr);
           }
       });
    }
  }
