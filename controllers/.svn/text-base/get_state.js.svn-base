var con = require('./../config_consumer');
module.exports.get_state = function (req, res) {
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
                var queryString_U = "select user_id,user_type,uname,name,status,login_status,branch_id,company_id from users where user_id = '" + user_id + "'  AND company_id ='" + rows_A[0].company_id + "'";
                con.query(queryString_U, function (err_U, rows_U) {
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            var queryString_S= "select state_id,state_name,state_code from state where 1=1 and status=1 order by state_name ASC";
                            con.query(queryString_S, function (err_S, rows_S) {
                                res_arr = { status: 1, message: 'State Details', data: rows_S };
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
