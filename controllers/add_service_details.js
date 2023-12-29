var con = require('./../config_consumer');
module.exports.add_service_details = function (req, res) {
    var res_arr;
    var api_key = req.headers.api_key;
    var user_id = req.body.user_id;
    var vehicle_id = req.body.vehicle_id;
    var service_planned_date = req.body.service_planned_date;
    var service_planned_time = req.body.service_planned_time;
    var service_planned_state_id= req.body.service_planned_state_id;
    var service_planned_city_id= req.body.service_planned_city_id;
    var service_planned_dealer_id= req.body.service_planned_dealer_id;
    var service_planned_type= req.body.service_planned_type;
    var service_planned_remarks= req.body.service_planned_remarks;
    var validation_status = 1;
  
    if (api_key == undefined || api_key == "undefined") api_key = '';
    if (user_id == undefined || user_id == 'undefined') user_id = '';
    if (vehicle_id == undefined || vehicle_id == 'undefined') vehicle_id = '';
    if (service_planned_date == undefined || service_planned_date == 'undefined') service_planned_date = '';
    if (service_planned_time == undefined || service_planned_time == 'undefined') service_planned_time = '';
    if (service_planned_state_id == undefined || service_planned_state_id == 'undefined') service_planned_state_id = '';
    if (service_planned_city_id == undefined || service_planned_city_id == 'undefined') service_planned_city_id = '';
    if (service_planned_dealer_id == undefined || service_planned_dealer_id == 'undefined') service_planned_dealer_id = '';
    if (service_planned_type == undefined || service_planned_type == 'undefined') service_planned_type = '';
    if (service_planned_remarks == undefined || service_planned_remarks == 'undefined') service_planned_remarks = '';

    // for outlook
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	host: "smtp-mail.outlook.com", // hostname
	secureConnection: false, // TLS requires secureConnection to be false
	port: 587, // port for secure SMTP
	tls: {
	   ciphers:'SSLv3'
	},
	auth: {
		user: 'support@bncmotors.in',
		pass: 'Bnc@outlook'
	}
});

    if (api_key == '') {
        res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
        res.send(res_arr);
        validation_status = 0;
    } else if (user_id == '') {
        res_arr = { status: '0', message: 'User Id is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (vehicle_id == '') {
        res_arr = { status: '0', message: 'Select Vehicle' };
        res.send(res_arr);
        validation_status = 0;
    } else if (service_planned_date == '') {
        res_arr = { status: '0', message: 'Date is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (service_planned_time == '') {
        res_arr = { status: '0', message: 'Time is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (service_planned_state_id == '') {
        res_arr = { status: '0', message: 'State is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (service_planned_city_id == '') {
        res_arr = { status: '0', message: 'City is empty' };
        res.send(res_arr);
        validation_status = 0;
    } else if (service_planned_dealer_id == '') {
        res_arr = { status: '0', message: 'Service Center is empty' };
        res.send(res_arr);
        validation_status = 0;
    }else if (service_planned_remarks == '') {
        res_arr = { status: '0', message: 'Remarks is empty' };
        res.send(res_arr);
        validation_status = 0;
    } 
      


    if (validation_status) {
        var queryString_A = "select id,company_id,description from api_key where api_key = '" + api_key + "' AND api_status = '1'";
        con.query(queryString_A, function (err_A, rows_A) {
            if (rows_A.length > 0) {             
                var queryString_U = "select d.email_id as dealer_email,U.status,U.name,U.user_id,U.address,U.city,U.pincode,U.state_id,U.phone_number,U.mobile_number,U.email_id  from users U  join vehicle_details2 VD on VD.customer_id = U.customer_id  JOIN dealer d  ON d.dealer_id = VD.dealer_id   where U.user_id = '" + user_id + "'  AND U.company_id ='" + rows_A[0].company_id + "'";
                con.query(queryString_U, function (err_U, rows_U) { 
                    if (rows_U.length > 0) {
                        if(rows_U[0].status == 1){
                            var queryString_VD2= "select * from vehicle_details2  where vehicle_id='"+vehicle_id+"'  "; 
                            con.query(queryString_VD2, function (err_VD2, rows_VD2) { 
                            
                          

                            var queryString_D= "select auto_increment_service_suffix,dealer_prefix from dealer  where dealer_id='"+service_planned_dealer_id+"'  "; 
                            con.query(queryString_D, function (err_D, rows_D) { 
                               // cononsole.log(rows_D);
                                const today = new Date();
                                currentYear= today.getFullYear().toString().substring(2);
                                nextYear =Number(currentYear) +1; 

                                let suffix = rows_D[0].auto_increment_service_suffix + 1;
                                let suffix_result = suffix.toString().padStart(5, '0')                            
                                var date_form = currentYear+'-'+nextYear;
                                var service_id=rows_D[0].dealer_prefix+ '/' + 'S/'+ date_form +'/' +suffix_result;
                                // console.log(service_id);
                           
                            var queryString_VS= "INSERT into vehicle_service set company_id='"+rows_VD2[0].company_id+"',branch_id='"+rows_VD2[0].branch_id+"',distributor_id='"+rows_VD2[0].distributor_id+"',dealer_id='"+rows_VD2[0].dealer_id+"',retailer_id='"+rows_VD2[0].retailer_id+"',customer_id='"+rows_VD2[0].customer_id+"',vehicle_service_number='"+service_id+"',registration_number='"+rows_VD2[0].registration_number+"', user_id='"+rows_U[0].user_id+"',name='"+rows_U[0].name+"',address='"+rows_U[0].address+"',city='"+rows_U[0].city+"',pincode='"+rows_U[0].pincode+"',state_id='"+rows_U[0].state_id+"',phone_number='"+rows_U[0].phone_number+"',mobile_number='"+rows_U[0].mobile_number+"',email_id='"+rows_U[0].email_id+"', vehicle_id='"+rows_VD2[0].vehicle_id+"', vehicle_model_id='"+rows_VD2[0].vehicle_model_id+"' ,vehicle_model_name='"+rows_VD2[0].vehicle_model_name+"' ,vehicle_variant_id='"+rows_VD2[0].vehicle_variant_id+"' ,vehicle_variant_name='"+rows_VD2[0].vehicle_variant_name+"' ,vehicle_color_id='"+rows_VD2[0].vehicle_color_id+"' ,vehicle_color_name='"+rows_VD2[0].vehicle_color_name+"' ,vehicle_price_id='"+rows_VD2[0].vehicle_price_id+"' ,vehicle_model_code='"+rows_VD2[0].vehicle_model_code+"' ,chassis_number='"+rows_VD2[0].chassis_number+"' ,imei='"+rows_VD2[0].imei+"' ,service_planned_date='"+service_planned_date+"',service_planned_time='"+service_planned_time+"',service_planned_datetime=NOW(),service_planned_state_id='"+service_planned_state_id+"',service_planned_city_id='"+service_planned_city_id+"',service_planned_dealer_id='"+service_planned_dealer_id+"',service_planned_type='"+service_planned_type+"',service_planned_remarks='"+service_planned_remarks+"' ,created_by='"+user_id+"',created_by_name='"+rows_U[0].name+"',created_datetime=NOW() "; 
                            con.query(queryString_VS, function (err_VS, rows_VS) {
                                //console.log(queryString_VS);                          
                            

                               var queryString_D_V2 ="UPDATE dealer SET auto_increment_service_suffix = '"+suffix+"' where dealer_id='"+service_planned_dealer_id+"' ";
                               con.query(queryString_D_V2, function (err_D_V2, rows_D_V2) {    

                                //send mail
                                var mail_content='';

                                mail_content +='<table width="80%" align="left" border="0" align="center">';
                                mail_content +='<tr><td> </td><td> </td> </tr>';
                                mail_content +='<tr><td> </td><td> </td> </tr>';
                                mail_content +='<tr><td><b>Vehicle Service #:</b> </td><td> '+service_id+' </td> </tr>';
                                mail_content +='<tr><td><b>Service Planned Remarks:</b> </td><td> '+service_planned_remarks+' </td> </tr>';
                                mail_content +='<tr><td><b>Created By:</b> </td><td> '+rows_U[0].name+' </td> </tr>';                            
                                mail_content +='<tr><td><b>Registration # :</b> </td><td> '+rows_VD2[0].registration_number+'  </td> </tr>';
                                mail_content +='<tr><td><b>Chassis # :</b> </td><td>  '+rows_VD2[0].chassis_number+' </td> </tr>';
                                mail_content +='<tr><td><b>Vehicle Model :</b> </td><td>  '+rows_VD2[0].vehicle_model_name+' </td> </tr>';
                                mail_content +='<tr><td><b>Vehicle Variant :</b> </td><td>  '+rows_VD2[0].vehicle_variant_name+' </td> </tr>';
                                mail_content +='<tr><td><b>Vehicle Color :</b> </td><td>  '+rows_VD2[0].vehicle_color_name+'</td> </tr>';
                                mail_content +='<tr><td><b>Booking Name  :</b> </td><td> '+rows_U[0].name+' </td> </tr>';
                                mail_content +='<tr><td><b>Address :</b> </td><td> '+rows_U[0].address+' </td> </tr>';
                                mail_content +='<tr><td><b>Pincode :</b> </td><td> '+rows_U[0].pincode+' </td> </tr>';
                                mail_content +='<tr><td><b>Mobile # :</b> </td><td> '+rows_U[0].mobile_number+' </td> </tr>';
                                mail_content +='<tr><td><b>Email :</b> </td><td> '+rows_U[0].email_id+' </td> </tr>';
                                mail_content +='<tr><td> </td><td> </td> </tr>';
                                mail_content +='<tr><td> </td><td> </td> </tr>';
                                mail_content +='<tr><td colspan="2">Thank you for using our services. </td> </tr>';
                                mail_content +='</table>';
                                
                               console.log(rows_U[0].dealer_email);//to
                               console.log(rows_U[0].email_id);//cc
                               const mailOptions = {
                                from: 'support@bncmotors.in', // Sender address   																  
                                to: ''+rows_U[0].dealer_email+' ', // List of recipients
                               cc:'meyyanathan.r@bncmotors.in,kavitha.s@anav.bike,sathishkumar.a@anav.bike,priyadarshini.s@bncmotors.in,'+rows_U[0].email_id+'',//rows_U[0].email_id
                              // to:'kavitha.s@anav.bike',
                              subject: "Service "+service_id+" has been raised by "+rows_U[0].name+" ", // Subject line
                              html: 'Dear Sir/Madam, <br><br> Following are the details:<br><br>  '+mail_content+' ', // Plain text body
                           };
                                transporter.sendMail(mailOptions, function(err, info) {
                                    if (err) {
                                      res_arr = { status: 0, message: 'Could not send mail' };
                                      res.send(res_arr);
                                    } else {
                                         res_arr = { status: 1, message: 'Mail sent. Service Details added Successfully' };
                                          res.send(res_arr);
                                    }
                                });

                                //res_arr = { status: 1, message: 'Service Details added Successfully' };
                                //res.send(res_arr);
                               });                            
                            });
                            });  
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
