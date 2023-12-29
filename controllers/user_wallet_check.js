var con = require('./../config_consumer');
var geodist=require('geodist');

module.exports.user_wallet_check =
 function (req, res) {
    var res_arr,re_arr,billing_soc,billing_soc_amt,service_fees,total_amount;
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
                            
                            //////=========================== MAIN =================================================/////// 

                        //  var queryString_RES = "SELECT imei,battery_mode,battery_soc as hndo_soc,(SELECT battery_soc FROM ss_battery_history_event_info WHERE  imei = '"+imei+"' AND battery_mode = 'ACCP' ORDER BY gps_datetime DESC LIMIT 0,1) AS accp_soc FROM ss_battery_history_event_info  WHERE imei = '"+imei+"' AND battery_mode = 'HNDO'  ORDER BY gps_datetime desc limit 0,1";

                         var queryString_RES = "SELECT imei,battery_mode,battery_soc as hndo_soc,(SELECT battery_soc FROM ss_battery_history_event_info WHERE  imei = '"+imei+"' AND battery_mode = 'ACCP' ORDER BY gps_datetime DESC LIMIT 0,1) AS accp_soc FROM ss_battery_history_event_info  WHERE imei = '"+imei+"' AND battery_mode = 'HNDO'  ORDER BY gps_datetime desc limit 0,1";

                            con.query(queryString_RES, function (err_VS, rows_RES) {
                                if (rows_RES.length > 0) {   

                                    if(rows_RES[0].battery_mode == 'HNDO')  
                                     {
                                    res_arr = { status: 1, message: 'Details Found', data: rows_RES};
                                    billing_soc =  rows_RES['0'].hndo_soc - rows_RES['0'].accp_soc;
                                       
                                       billing_soc_amt = billing_soc * 1;
                                       service_fees = 20;
                                       total_amount = billing_soc_amt + service_fees;

                                       rows_RES['0']['billing_soc_amt'] = billing_soc_amt;
                                       rows_RES['0']['service_fees']    = service_fees;
                                       rows_RES['0']['total_amount']    = total_amount;
                                       rows_RES['0']['wallet_amount']   = rows_U['0'].wallet_amount;
                                     } 
                                    res_arr = { status: 1, message: 'Details Found', data: rows_RES};
                                    res.send(res_arr);
                                 }
                                else {
                                    res_arr = { status: 0, message: "No Details Found" };
                                    res.send(res_arr);
                                }
                        });   //  Cabin list

                              //////============================================================================/////// 

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
