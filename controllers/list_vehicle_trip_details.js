var con = require('./../config_consumer');
module.exports.list_vehicle_trip_details = function (req, res){
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var vehicle_trip_history_id=req.body.vehicle_trip_history_id;
    var from_date = req.body.from_date;
    var to_date = req.body.to_date;
    var validation_status = 1;
    var subquery ='';
    var trip_start_date;
    var trip_start_time;
    var trip_end_date;
    var trip_end_time;
    

    if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
    if (vehicle_trip_history_id == undefined || vehicle_trip_history_id == 'undefined') vehicle_trip_history_id = '';
    if(from_date == undefined || from_date == "undefined")from_date='';
    if(to_date== undefined || to_date == "undefined")to_date='';

    if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    }

    if(validation_status){
        var queryString_A = "select id,company_id from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A){
            if (rows_A.length > 0){
                var queryString_U = "select status,customer_id from users where user_id = '" +user_id + "' AND company_id ='" + rows_A[0].company_id + "'";
                con.query(queryString_U, function (err_U, rows_U){
                    //console.log(rows_U);
                    if (rows_U.length > 0){
                        if(rows_U[0].status == 1){
                            if(rows_U[0].customer_id > 0 ){
                                subquery = "customer_id ='"+rows_U[0].customer_id +"' AND company_id ='" + rows_A[0].company_id + "'";
                            }
                             if(vehicle_trip_history_id > 0){
                                subquery =" id='"+vehicle_trip_history_id+"' AND company_id ='" + rows_A[0].company_id + "'";
                            } 
                            else if(from_date !='' && to_date !=''){
                                subquery +="AND DATE(trip_start_datetime) >= '" +from_date+"' AND DATE(trip_start_datetime) <= '"+ to_date+"' ";
                            }
                            var queryString_V="Select id as vehicle_trip_history_id,vehicle_id,company_id,branch_id,customer_id,registration_number,DATE_FORMAT(vehicle_trip_history.trip_start_datetime,'%d-%m-%Y %H:%i')AS trip_start_datetime,DATE_FORMAT(vehicle_trip_history.trip_end_datetime,'%d-%m-%Y %H:%i')AS trip_end_datetime,trip_total_odometer,trip_total_time,round(motor_speed_rpm_max) as motor_speed_rpm_max,round(motor_speed_rpm_avg) as motor_speed_rpm_avg,trip_start_lat_message,trip_start_lon_message,trip_end_lat_message,trip_end_lon_message from vehicle_trip_history where 1=1 AND "+subquery+"  AND status='3' AND trip_total_odometer >= 1  ORDER BY id DESC";
                            con.query(queryString_V, function (err_V, rows_V){
                                if(rows_V.length > 0){
                                    rows_V.forEach(row => {
                                    var S_date=row.trip_start_datetime;
                                    const myArray = S_date.split(" ", );
                                    trip_start_date =myArray[0];
                                    trip_start_time= myArray[1];

                                    var E_date=row.trip_end_datetime;
                                    const myArray1=E_date.split(" ",);
                                    trip_end_date =myArray1[0];
                                    trip_end_time= myArray1[1];

                                    var totaltime=row.trip_total_time;
                                    var [hours, minutes] = totaltime.split(':').map(Number);
                                    var totalminutes = hours * 60 + minutes;

                                    row.trip_start_date=trip_start_date;
                                    row.trip_start_time=trip_start_time;
                                    row.trip_end_date=trip_end_date;
                                    row.trip_end_time=trip_end_time;
                                    row.trip_total_minutes=totalminutes;
                                    })
                                    res_arr = {status : 1, message: 'Trip History details', data: rows_V};
                                    res.send(res_arr);
                                }else{
                                    res_arr ={status : 0, message: 'Detail not found'};
                                    res.send(res_arr);
                                }
                            })                       
                        }else{
                            res_arr = { status: 0, message: 'Your account is inactive. Contact Dealer' };
                            res.send(res_arr);
                        }
                    }else{
                        res_arr = { status: 0, message: 'Invalid User. Try again'};
                        res.send(res_arr);
                    }
                })
            }else{
                res_arr = { status: 0, message: 'API key not matching. Try again' };
                res.send(res_arr);
            }
        })
    }
}