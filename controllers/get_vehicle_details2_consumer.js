// SERVICE FOR VEHICLE LIST , VEHICLE INFO, VEHICLE REGISTRATION NUMBER DROP DOWN FOR ALL
var con = require('./../config_consumer');
module.exports.get_vehicle_details2_consumer= function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var vehicle_id = req.body.vehicle_id;
    var validation_status = 1;  
  

    if(api_key==undefined || api_key=="undefined" ) api_key='';
    if(user_id==undefined || user_id=='undefined') user_id='';
    if(vehicle_id==undefined || vehicle_id=='undefined') vehicle_id='';

    
if(api_key=='') {
	res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
	res.send(res_arr);
	validation_status = 0;    
}else if(user_id==''){
    res_arr = { status: '0', message: 'User Id  is empty' };
    res.send(res_arr);
    validation_status = 0;  
}

var subquery='';
if(vehicle_id !=""){
    subquery +="AND VD.vehicle_id = '"+vehicle_id+"'";
}else{
    subquery +="";
}

    if(validation_status) {   		
        var queryString_A = "select id,company_id from api_key where api_key = '"+api_key+"' AND api_status = '1'"; 
		con.query(queryString_A,function(err_A,rows_A) {
			if(rows_A.length > 0) {
                var queryString_U = "select status,customer_id from users where user_id = '"+user_id+"' and company_id= '"+rows_A[0].company_id+"'";
                con.query(queryString_U,function(err_U,rows_U) {
                  if(rows_U.length > 0) {
                      if(rows_U[0].status==1) {
                         //var queryString_VD = "SELECT VD.vehicle_id,VD.vehicle_model_code,IFNULL(VD.registration_number,'') AS  registration_number,IFNULL(VD.vehicle_model_name,'') AS vehicle_model_name,IFNULL(VD.vehicle_variant_name,'') AS vehicle_variant_name,IFNULL(VD.vehicle_color_name,'') AS vehicle_color_name, VD.chassis_number,VD.imei,IFNULL(VD.hub_motor_serial_number,'') AS hub_motor_serial_number ,IFNULL(VD.wiring_harness_serial_number,'') AS wiring_harness_serial_number, IFNULL(VD.motor_controller_serial_number,'') AS motor_controller_serial_number,IFNULL(VD.dcdc_converter_serial_number,'') AS dcdc_converter_serial_number,IFNULL(VD.battery_serial_number,'') AS battery_serial_number, IFNULL(VD.charger_serial_number,'') AS charger_serial_number, IFNULL(VD.cluster_serial_number,'') AS cluster_serial_number, (CASE WHEN DD.gps_fix = 1 THEN 'Yes' ELSE 'No' END) AS gps_fix,  DD.gps_date,DD.lat_indicator,DD.lon_indicator,DD.mcu_internal_voltage,DD.mcu_temperature, DD.motor_speed_rpm,DD.motor_current,DD.motor_temperature, DD.odometer_reading,VD.odometer_reading AS odometer_reading_vd,DD.controller_voltage,DD.controller_temperature, DD.speed,DD.battery_soc,DD.battery_current,DD.battery_voltage,DD.battery_temperature,(CASE WHEN DD.battery_state = 1 THEN 'Charging' ELSE 'Discharging' END) AS battery_state ,DD.c3_reserved5,(DD.b1_cell1 / 1000 ) AS b1_cell1,(DD.b1_cell2 / 1000) AS b1_cell2,(DD.b1_cell3 / 1000) AS b1_cell3,(DD.b1_cell4 / 1000) AS b1_cell4,(DD.b2_cell5 / 1000) AS b2_cell5 ,(DD.b2_cell6 / 1000) AS b2_cell6,(DD.b2_cell7 / 1000) AS b2_cell7,(DD.b2_cell8 / 1000) AS b2_cell8,(DD.b3_cell9 / 1000 ) AS b3_cell9,(DD.b3_cell10 /1000) AS b3_cell10,(DD.b3_cell11 / 1000) AS b3_cell11,(DD.b3_cell12 / 1000)  AS b3_cell12, (DD.b4_cell13 / 1000 ) AS b4_cell13,(DD.b4_cell14 / 1000 ) AS b4_cell14,(DD.b4_cell15 / 1000) AS b4_cell15,(DD.b4_cell16 / 1000) AS b4_cell16,D.dealer_name,D.billing_city,D.email_id,VD.vehicle_color_id  FROM vehicle_details2 VD join ddevice DD  on VD.imei = DD.imei join dealer D on D.dealer_id=VD.dealer_id WHERE 1=1  AND VD.company_id= '"+rows_A[0].company_id+"' AND VD.customer_id="+rows_U[0].customer_id+"  "+subquery+"  ORDER BY VD.vehicle_id DESC";                                             
                
                         var queryString_VD = "SELECT VD.vehicle_id,VD.vehicle_model_code,IFNULL(VD.registration_number,'') AS  registration_number,IFNULL(VD.vehicle_model_name,'') AS vehicle_model_name,IFNULL(VD.vehicle_variant_name,'') AS vehicle_variant_name,IFNULL(VD.vehicle_color_name,'') AS vehicle_color_name, VD.chassis_number,VD.imei,IFNULL(VD.hub_motor_serial_number,'') AS hub_motor_serial_number ,IFNULL(VD.wiring_harness_serial_number,'') AS wiring_harness_serial_number, IFNULL(VD.motor_controller_serial_number,'') AS motor_controller_serial_number,IFNULL(VD.dcdc_converter_serial_number,'') AS dcdc_converter_serial_number,IFNULL(VD.battery_serial_number,'') AS battery_serial_number, IFNULL(VD.charger_serial_number,'') AS charger_serial_number, IFNULL(VD.cluster_serial_number,'') AS cluster_serial_number, (CASE WHEN DD.gps_fix = 1 THEN 'Yes' ELSE 'No' END) AS gps_fix,  DD.gps_date,DD.lat_indicator,DD.lon_indicator,DD.mcu_internal_voltage,DD.mcu_temperature, DD.motor_speed_rpm,DD.motor_current,DD.motor_temperature, DD.odometer_reading,VD.odometer_reading AS odometer_reading_vd,DD.controller_voltage,DD.controller_temperature, DD.speed,DD.battery_soc,DD.battery_current,DD.battery_voltage,DD.battery_temperature,(CASE WHEN DD.battery_state = 1 THEN 'Charging' ELSE 'Discharging' END) AS battery_state ,DD.c3_reserved5,(DD.b1_cell1 / 1000 ) AS b1_cell1,(DD.b1_cell2 / 1000) AS b1_cell2,(DD.b1_cell3 / 1000) AS b1_cell3,(DD.b1_cell4 / 1000) AS b1_cell4,(DD.b2_cell5 / 1000) AS b2_cell5 ,(DD.b2_cell6 / 1000) AS b2_cell6,(DD.b2_cell7 / 1000) AS b2_cell7,(DD.b2_cell8 / 1000) AS b2_cell8,(DD.b3_cell9 / 1000 ) AS b3_cell9,(DD.b3_cell10 /1000) AS b3_cell10,(DD.b3_cell11 / 1000) AS b3_cell11,(DD.b3_cell12 / 1000)  AS b3_cell12, (DD.b4_cell13 / 1000 ) AS b4_cell13,(DD.b4_cell14 / 1000 ) AS b4_cell14,(DD.b4_cell15 / 1000) AS b4_cell15,(DD.b4_cell16 / 1000) AS b4_cell16,CONCAT(UCASE(LEFT(D.dealer_name, 1)),SUBSTRING(LOWER(D.dealer_name),2)) AS dealer_name,D.billing_city,D.email_id,VD.vehicle_color_id,  I.to_name as customer_name,I.to_mobile_number as customer_mob_no,I.to_email_id as customer_email,I.customer_vehicle_booking_number, I.customer_vehicle_invoice_number, (CASE WHEN VD.delivered_datetime!='0000-00-00 00:00:00' THEN DATE_FORMAT(VD.delivered_datetime,'%d-%m-%Y %H:%i') ELSE '' END) as delivered_datetime, DATE_FORMAT(VD.customer_vehicle_invoice_datetime,'%d-%m-%Y %H:%i') customer_vehicle_invoice_datetime FROM vehicle_details2 VD join ddevice DD  on VD.imei = DD.imei join dealer D on D.dealer_id=VD.dealer_id   JOIN customer_vehicle_invoice I ON I.id=VD.customer_vehicle_invoice_id WHERE 1=1  AND VD.company_id= '"+rows_A[0].company_id+"' AND VD.customer_id="+rows_U[0].customer_id+"  "+subquery+"  ORDER BY VD.vehicle_id DESC";
                        //  console.log(queryString_VD);
                          con.query(queryString_VD,function(err_VD,rows_VD) {            
                                if(rows_VD.length > 0) {
                                    var queryString_VC = "select upload_vehicle_image from vehicle_color where id = '"+rows_VD[0].vehicle_color_id+"'";
									con.query(queryString_VC,function(err_VC,rows_VC) {
										if(rows_VC.length > 0) {
											if(rows_VC[0].upload_vehicle_image!='')
                                             rows_VD['0']['upload_vehicle_image'] = 'http://iot.boommotors.com/evehicle_secure/other_uploads/vehicle_color/'+rows_VC[0].upload_vehicle_image;
											else
                                             rows_VD['0']['upload_vehicle_image'] = '';
                                        }	
                                        res_arr = { status: 1, message: 'Vehicle Details', data:rows_VD };
                                        res.send(res_arr);
                                     
                                });                                 
                                }else {
                                        res_arr = { status: 0, message: 'Vehicle Details Not Found. Try again' };
                                        res.send(res_arr);
                                }                        
                            });     
                      } else{
						res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
						res.send(res_arr);
					}
				} else {
                    res_arr = { status: 0, message: 'User not exists.' };
                    res.send(res_arr);
                }       
            });                  
            }else {
				res_arr = { status: 0, message: 'API key not matching. Try again' };
				res.send(res_arr);
			}       
        });
	}
}
