var con = require('./../config_consumer');
module.exports.update_consumer_feedback= function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var complaint_id = req.body.complaint_id;
    var consumer_feedback = req.body.consumer_feedback;
    var consumer_star_rating = req.body.consumer_star_rating;

    var validation_status = 1;  

    if(api_key==undefined || api_key=="undefined" ) api_key='';
    if(user_id==undefined || user_id=='undefined') user_id='';
    if (complaint_id == undefined || complaint_id == 'undefined') complaint_id = '';
    if(consumer_feedback==undefined || consumer_feedback=='undefined') consumer_feedback='';
    if(consumer_star_rating==undefined || consumer_star_rating=='undefined') consumer_star_rating='';
    
if(api_key=='') {
	res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
	res.send(res_arr);
	validation_status = 0;    
}else if(user_id==''){
    res_arr = { status: '0', message: 'User Id  is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(complaint_id==''){
    res_arr = { status: '0', message: 'Complaint Id is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if(consumer_feedback==''){
    res_arr = { status: '0', message: 'Feedback is empty' };
    res.send(res_arr);
    validation_status = 0;  
}else if (consumer_star_rating == '') {
    res_arr = { status: '0', message: 'Star Rating is empty' };
    res.send(res_arr);
    validation_status = 0;
}

if (validation_status) {
    var queryString_A = "select id,company_id from api_key where api_key = '" + api_key + "' AND api_status = '1'";
    con.query(queryString_A, function (err_A, rows_A) {
        if (rows_A.length > 0) {             
            var queryString_U = "select U.status  from users U where U.user_id = '" + user_id + "'  AND U.user_type='13'   AND U.company_id ='" + rows_A[0].company_id + "'";
            con.query(queryString_U, function (err_U, rows_U) { 
                if (rows_U.length > 0) {
                    if(rows_U[0].status == 1){
                        var queryString_VC2= "select * from vehicle_complaint  where id='"+complaint_id+"'  "; 
                        con.query(queryString_VC2, function (err_VD2, rows_VC2) {                     
                      if (rows_VC2.length > 0) {
                        if(rows_VC2[0].status == 2){// if 2 means complaint closed
                            var queryString_VC= "UPDATE vehicle_complaint SET consumer_feedback='"+consumer_feedback+"', consumer_star_rating='"+consumer_star_rating+"', consumer_feedback_datetime=NOW() where id='"+complaint_id +"' ";
                            con.query(queryString_VC, function (err_VC, rows_VC) {
                                res_arr = { status: 1, message: 'Feedback Added Sucessfully.' };
                                 res.send(res_arr);
                                
                            });
                        } else{
                            res_arr = { status: 0, message: 'Sorry ..Complaint Not Closed.' };
                             res.send(res_arr);
                        }
                    }else{
                        res_arr = { status: 0, message: 'Sorry ..No Complaint not available in Database' };
                        res.send(res_arr);
                    }
                    });                          
                    } else {
                        res_arr = { status: 0, message: 'Your account is inactive. Contact Admin' };
                        res.send(res_arr);
                    }
                } else {
                    res_arr = { status: 0, message: 'Invalid Username. Try again' };
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
