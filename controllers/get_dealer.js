var con = require('./../config_consumer');
module.exports.get_dealer = function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var state_id = req.body.state_id;
    var city_id = req.body.city_id;
    var validation_status = 1;
  
    if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
    if (state_id == undefined || state_id == 'undefined') state_id = '';
    if (city_id == undefined || city_id == 'undefined') city_id = '';


    if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (state_id == '') {
        res_arr = { status: '0', message: 'State Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (city_id == '') {
        res_arr = { status: '0', message: 'City Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } 
    if (validation_status) {
        var queryString_A = "select id,company_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {             
                var queryString_U = "select status from users where user_id = '" + user_id + "'  AND company_id ='" + rows_A[0].company_id + "'";
                con.query(queryString_U, function (err_U, rows_U) { 
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            var queryString_D= "select dealer_id,CONCAT(UCASE(LEFT(dealer_name, 1)),SUBSTRING(LOWER(dealer_name),2)) AS dealer_name,billing_address from dealer  where 1=1  AND billing_state='"+state_id+"' AND  billing_city_id='"+city_id+"' AND dealer_type='DEALER' AND status=1"; 
                            con.query(queryString_D, function (err_D, rows_D) {console.log(queryString_D);
                                res_arr = { status: 1, message: 'Dealer Details', data: rows_D };
                                res.send(res_arr);
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
