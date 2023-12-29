var con = require('./../config_consumer');
module.exports.list_service_details = function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
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
    } 
      


    if (validation_status) {
        var queryString_A = "select id,company_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {             
                var queryString_U = "select status from users where user_id = '" +user_id + "'  AND company_id ='" + rows_A[0].company_id + "'";
             //   console.log(queryString_U);
                con.query(queryString_U, function (err_U, rows_U) { 
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            var queryString_VS ="SELECT IFNULL(VS.vehicle_service_number,'') AS vehicle_service_number,IFNULL(VS.registration_number,'') AS registration_number,VS.vehicle_model_code,DATE_FORMAT(VS.service_planned_date,'%d-%m-%Y') as service_planned_date,DATE_FORMAT(VS.service_planned_time,'%H:%i') as service_planned_time,VS.service_planned_dealer_id,D.billing_city,DATE_FORMAT(VS.service_planned_datetime, '%d-%m-%Y %H:%i') AS Date,CONCAT(UCASE(LEFT(D.dealer_name, 1)),SUBSTRING(LOWER(D.dealer_name),2)) AS dealer_name,'Awaiting' as Status,'#629632' as status_color_code  FROM vehicle_service VS,dealer D WHERE 1=1 AND VS.service_planned_dealer_id = D.dealer_id AND VS.user_id = '"+user_id+"' order by VS.id desc ";
                      //  console.log(queryString_VS);
                            con.query(queryString_VS, function (err_VS, rows_VS) {
                                if (rows_VS.length > 0) {
									res_arr = { status: 1, message: 'Details Found', data: rows_VS };
									res.send(res_arr);
								} else {
									res_arr = { status: 0, message: "No Details Found" };
                                    res.send(res_arr);
								}
                        });                          
                        } else {
                            res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
						    res.send(res_arr);
                        }
                    } else {
                        res_arr = { status: 0, message: 'Invalid Username or Password Try again' };
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
