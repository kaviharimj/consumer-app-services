var con = require('./../config_consumer');
var geodist=require('geodist');
var mqtt = require('mqtt');

module.exports.get_cabin_details =
 function (req, res) {
    var res_arr,re_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var imei = req.body.imei;

    var validation_status = 1;

    if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';

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

    var subqry='';
    var max_soh_cabin,command;
    if(api_key !=''){
        subqry+=""; 
    }else{
        subqry+='';
    }
 
    if (validation_status) {

        var queryString_A = "select id,company_id,branch_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {

            if (rows_A.length > 0) {   

              var user_type='13';

              var queryString_D = "select station_name,station_latitude,station_longitude,charging_slot_rows,charging_slot_columns from swapping_station where imei = '" +imei + "'  AND company_id ='" + rows_A[0].company_id + "' and branch_id ='" + rows_A[0].branch_id + "' ";

              con.query(queryString_D, function (err_D, rows_D) { 
                if (rows_D.length > 0) {

                var queryString_U = "select name,mobile_number,email_id,status,wallet_amount from users where user_id = '" +user_id + "'  and user_type='"+user_type+"'   AND company_id ='" + rows_A[0].company_id + "'";

                con.query(queryString_U, function (err_U, rows_U) { 
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                                     
                            var queryString_CD ="SELECT swapping_station_number,battery_id_no,cabin_id,battery_soc,battery_soh,battery_temperature,(CASE WHEN battery_soh < '80' OR battery_temperature > '50' OR battery_failure_value != '0-0-0' OR a1_mosfet_temperature > '50'  OR (cabin_ac_state = '1' AND battery_charging_state = '0') THEN 1 ELSE 0 END) AS error_status FROM ss_battery  WHERE imei = '"+imei+"' AND company_id ='" + rows_A[0].company_id + "' and branch_id ='" + rows_A[0].branch_id + "' "+ subqry+ "  ORDER BY cabin_id ";
                         
                            con.query(queryString_CD, function (err_VS, rows_CD) {
                                if (rows_CD.length > 0) { 
                                    
                                            res_arr = { status: 1, message: 'Details Found',Rows : rows_D[0].charging_slot_rows , column : rows_D[0].charging_slot_columns, data: rows_CD};
                                            // max_soh_cabin = max_soc_fun(rows_CD);
                                                                                
                                     //////////////////////////////////// SS Command Send /////////////////////////////////////////////

                                    //  var serverUrl = 'tcp://3.6.49.44:8883';
                                    //  var clientId = 'Command-QT-BATT-JSON';
                                    //  var username = 'ebike_iot';
                                    //  var password = 'ebike_iot';
  
                                     
                                    //  var client = mqtt.connect(serverUrl, {
                                    //     username: username,
                                    //     password: password,
                                    //     clientId: clientId
                                    // });
                                            // command = '$TXN_START,'+rows_U[0].name+','+'1'+'#';
                                            // client.on('connect', () => {
                                            //     // root_topic_val = '/bnc/12/1.0/'+'352913090334309'+'/control';
                                            //     root_topic_val = '/bnc/12/1.0/'+imei+'/control';

                                            //     client.publish(root_topic_val,command,function (err) {
                                            //         if(!err) {
                                            //             var queryString_InsLHA = "insert into ss_battery_history_event SET imei = '"+imei+"', created_datetime = NOW()";
                                            //             con.query(queryString_InsLHA, function (err_InsLHA, result_InsLHA) {
                                            //                 /*if (err_InsLHA)
                                            //                     console.log("Error in insert into SS_LOG");
                                            //                 else
                                            //                     console.log("Record inserted into SS_LOG");*/
                                            //             });
                                            //         }
                                            //     });
                                            //     client.end();
                                            // }); //client.on connect ends
                                            
                                            /////////////////////////////////////////////////////////////////////
                                            res.send(res_arr);
                                 }

                                else {
                                    res_arr = { status: 0, message: "No Details Found" };
                                    res.send(res_arr);
                                }
                        });   //  Cabin list
                      
                        } else {
                            res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                            res.send(res_arr);
                        }
                    } else {
                        res_arr = { status: 0, message: 'Invalid Username  Try again'};
                        res.send(res_arr);
                    }
                });

                ///////////
              }
              else {
                res_arr = { status: 0, message: 'Check Your IMEI. Try again' };
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

// function splitStr(distance) {
//     let distance_arrary = distance.split(" ");
//     return distance_arrary['0'];
// }

// function max_soc_fun(arr) {
//     let max_array = [];
//     for (let i = 0; i < arr.length; i++) {
//             max_array[i] = arr[i].battery_soc;
//     }
//     const max = Math.max(...max_array);
//     const cabin_no = max_array.indexOf(max)+parseInt('1');

//     return cabin_no;
// }

////////////////////////////////////////////////