var con = require('./../config_consumer');
module.exports.get_apk_version = function(req,res){
    var res_arr;
    var api_key = req.headers.api_key;
    var apk_name = req.body.apk_name;

    var validation_status=1;

    if(api_key === 'undefined') api_key='';
    if(apk_name === 'undefined') apk_name='';

    if(api_key=='') {
        res_arr = { status: 0, message: 'API key is empty' };
        res.send(res_arr);
        validation_status = 0;    
    }else if(apk_name==''){
        res_arr = { status: '0', message: 'APK name is empty' };
        res.send(res_arr);
        validation_status = 0;  
    }

    if(validation_status) {
        var queryString_A = "select id from api_key where api_key = '"+api_key+"' AND api_status = '1'";
        con.query(queryString_A,function(err_A,rows_A) {
            if(rows_A.length > 0) {
            var queryString_AV = "select apk_version_android,apk_version_ios, apk_status from apk_version where apk_name = '"+apk_name+"' ORDER BY id DESC limit 0,1";
              con.query(queryString_AV,function(err_AV,rows_AV) {
				if(rows_AV.length > 0) {
					if(rows_AV[0].apk_status==1) {
						res_arr = { status: 1, message: 'Details Found', data: rows_AV };
						res.send(res_arr);	
					} else{
						res_arr = { status: 0, message: 'Status is inactive. Contact Super Admin' };
						res.send(res_arr);
					}
				} else {
                    res_arr = { status: 0, message: 'No record found. Contact Super Admin' };
                    res.send(res_arr);
                }       
            });
           }
           else{
				res_arr = { status: 0, message: 'API key not matching. Try again' };
				res.send(res_arr);
           }
       });
    }
}
