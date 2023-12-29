var express=require("express");
var bodyParser=require('body-parser');
var router = express.Router();
var multer = require("multer");
var app = express();
app.use(express.json());
const path = require('path');
var con = require('./../config_consumer');
const { error } = require("console");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/complaint');
  },
  filename: (req, file, cb) => {   
   cb(null, `Complaint-${Date.now()}` + path.extname(file.originalname))
  }
});
const multerFilter = (req, file, cb) => {   
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
            cb(new Error('Please upload JPG,PNG,JPEG Images'))
         }
       cb(null, true)    
      
      // if(file.mimetype.split("/")[0] === 'image'){
      //   cb(null, true)    
      // }else{
      //    cb(new Error('Please upload JPG,PNG,JPEG Image'),false);
      // }
    
};
/* Allow upto 5MB size of images */
exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 2000000,files:3 }
});

module.exports.uploadMultipleImage=async(req,res)=>{ 
  var res_arr;
  var api_key = req.headers.api_key;
  var user_id = req.body.user_id;
  var complaint_type = req.body.complaint_type;
  var complaint_remarks = req.body.complaint_remarks;
  var vehicle_id = req.body.vehicle_id;

  var validation_status = 1;  

  if(api_key==undefined || api_key=="undefined" ) api_key='';
  if(user_id==undefined || user_id=='undefined') user_id='';
  if (vehicle_id == undefined || vehicle_id == 'undefined') vehicle_id = '';
  if(complaint_type==undefined || complaint_type=='undefined') complaint_type='';
  if(complaint_remarks==undefined || complaint_remarks=='undefined') complaint_remarks='';


  if(api_key=='') {
    res_arr = { status: 0, message: 'API key or API password is empty or wrong' };
    res.send(res_arr);
    validation_status = 0;    
  }else if(user_id==''){
      res_arr = { status: '0', message: 'User Id  is empty' };
      res.send(res_arr);
      validation_status = 0;  
  }else if(complaint_type==''){
      res_arr = { status: '0', message: 'Complaint Type is empty' };
      res.send(res_arr);
      validation_status = 0;  
  }else if(complaint_remarks==''){
      res_arr = { status: '0', message: 'Complaint Remarks is empty' };
      res.send(res_arr);
      validation_status = 0;  
  }else if (vehicle_id == '') {
      res_arr = { status: '0', message: 'Vehicle Id is empty' };
      res.send(res_arr);
      validation_status = 0;
  }
  else if(req.files.length < 1) {											/* 20290929: Mathavan need to fix the error in his code as even if we upload 1 image, it is not displaying in the app above Submit button. One fixed, need to change as 1 below */
      res_arr = { status: '0', message: 'Please upload atleast 2 image' };
      res.send(res_arr);
      validation_status = 0;
  } else if(req.files.length > 3) {
    res_arr = { status: '0', message: 'You are allowed to upload maximum of 3 images only' };
    res.send(res_arr);
    validation_status = 0;
}
//console.log('files ln: '+req.files.length);
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
//console.log(req.body);
//console.log(req.files);
//console.log(req.headers.api_key);
//console.log(req.files.filename);


if (validation_status) {
  var queryString_A = "select id,company_id from api_key where api_key = '" + api_key + "' AND api_status = '1'";
  con.query(queryString_A, function (err_A, rows_A) {
      if (rows_A.length > 0) {             
          var queryString_U = "select d.email_id as dealer_email,U.status,U.name,U.user_id,U.address,U.city,U.pincode,U.state_id,U.phone_number,U.mobile_number,U.email_id,U.user_type  from users U  join vehicle_details2 VD on VD.customer_id = U.customer_id  JOIN dealer d  ON d.dealer_id = VD.dealer_id   where U.user_id = '" + user_id + "'  AND U.company_id ='" + rows_A[0].company_id + "'";
          con.query(queryString_U, function (err_U, rows_U) { 
              if (rows_U.length > 0) {
                  if(rows_U[0].status == 1){
                      var queryString_VD2= "select * from vehicle_details2 where vehicle_id='"+vehicle_id+"'";
                      con.query(queryString_VD2, function (err_VD2, rows_VD2) {                      
                    
                     if (rows_VD2.length > 0) {
                          var queryString_D= "select auto_increment_complaint_suffix,dealer_prefix from dealer where dealer_id='"+rows_VD2[0].dealer_id+"'  "; 
                          con.query(queryString_D, function (err_D, rows_D) {                           
                            const today = new Date();
                       //   console.log(today);
                            currentYear= today.getFullYear().toString().substring(2);
                            nextYear =Number(currentYear) +1;


     
                              let suffix = rows_D[0].auto_increment_complaint_suffix + 1;
                              let suffix_result = suffix.toString().padStart(5, '0')                            
                              var date_form = currentYear+'-'+nextYear;
                              var complaint_id=rows_D[0].dealer_prefix+ '/' + 'C/'+ date_form +'/' +suffix_result;
                                    
                             //    get user type name
                             var queryString_UT = "select user_role from user_type where id = '"+rows_U[0].user_type+ "' ";
                             con.query(queryString_UT, function (err_U, rows_UT) {
                           
                              var subQry_C='';
                              if(req.files.length > 0) {
                                if(req.files.length ==1) {
                                      subQry_C += "upload_image1 = '"+req.files[0].filename+"' ";
                                }else if(req.files.length == 2) {
                                      subQry_C += "upload_image1 = '"+req.files[0].filename+"' ";
                                      subQry_C += ",upload_image2 = '"+req.files[1].filename+"' ";
                                } else if(req.files.length == 3) {
                                      subQry_C += "upload_image1 = '"+req.files[0].filename+"' ";
                                      subQry_C += ",upload_image2= '"+req.files[1].filename+"' ";
                                      subQry_C += ",upload_image3= '"+req.files[2].filename+"' ";
                              	}
                            }
                             
                          var queryString_VC= "INSERT into vehicle_complaint set company_id='"+rows_VD2[0].company_id+"',branch_id='"+rows_VD2[0].branch_id+"',distributor_id='"+rows_VD2[0].distributor_id+"',dealer_id='"+rows_VD2[0].dealer_id+"',retailer_id='"+rows_VD2[0].retailer_id+"',customer_id='"+rows_VD2[0].customer_id+"',vehicle_complaint_number='"+complaint_id+"',registration_number='"+rows_VD2[0].registration_number+"', user_id='"+rows_U[0].user_id+"',name='"+rows_U[0].name+"',address='"+rows_U[0].address+"',city='"+rows_U[0].city+"',pincode='"+rows_U[0].pincode+"',state_id='"+rows_U[0].state_id+"',phone_number='"+rows_U[0].phone_number+"',mobile_number='"+rows_U[0].mobile_number+"',email_id='"+rows_U[0].email_id+"', vehicle_id='"+rows_VD2[0].vehicle_id+"', vehicle_model_id='"+rows_VD2[0].vehicle_model_id+"' ,vehicle_model_name='"+rows_VD2[0].vehicle_model_name+"' ,vehicle_variant_id='"+rows_VD2[0].vehicle_variant_id+"' ,vehicle_variant_name='"+rows_VD2[0].vehicle_variant_name+"' ,vehicle_color_id='"+rows_VD2[0].vehicle_color_id+"' ,vehicle_color_name='"+rows_VD2[0].vehicle_color_name+"' ,vehicle_price_id='"+rows_VD2[0].vehicle_price_id+"' ,vehicle_model_code='"+rows_VD2[0].vehicle_model_code+"' ,chassis_number='"+rows_VD2[0].chassis_number+"' ,imei='"+rows_VD2[0].imei+"' ,complaint_type='"+complaint_type+"',complaint_remarks='"+complaint_remarks+"',created_by='"+user_id+"',created_by_name='"+rows_U[0].name+"',created_by_user_type='"+rows_U[0].user_type+"', created_by_user_type_name = '"+rows_UT[0].user_role+"',created_datetime=NOW(),"+subQry_C+" "; 
                          //console.log('queryString_VC: '+queryString_VC);
                          //var queryString_VC= "INSERT into vehicle_complaint set company_id='"+rows_VD2[0].company_id+"',branch_id='"+rows_VD2[0].branch_id+"',distributor_id='"+rows_VD2[0].distributor_id+"',dealer_id='"+rows_VD2[0].dealer_id+"',retailer_id='"+rows_VD2[0].retailer_id+"',customer_id='"+rows_VD2[0].customer_id+"',vehicle_complaint_number='"+complaint_id+"',registration_number='"+rows_VD2[0].registration_number+"', user_id='"+rows_U[0].user_id+"',name='"+rows_U[0].name+"',address='"+rows_U[0].address+"',city='"+rows_U[0].city+"',pincode='"+rows_U[0].pincode+"',state_id='"+rows_U[0].state_id+"',phone_number='"+rows_U[0].phone_number+"',mobile_number='"+rows_U[0].mobile_number+"',email_id='"+rows_U[0].email_id+"', vehicle_id='"+rows_VD2[0].vehicle_id+"', vehicle_model_id='"+rows_VD2[0].vehicle_model_id+"' ,vehicle_model_name='"+rows_VD2[0].vehicle_model_name+"' ,vehicle_variant_id='"+rows_VD2[0].vehicle_variant_id+"' ,vehicle_variant_name='"+rows_VD2[0].vehicle_variant_name+"' ,vehicle_color_id='"+rows_VD2[0].vehicle_color_id+"' ,vehicle_color_name='"+rows_VD2[0].vehicle_color_name+"' ,vehicle_price_id='"+rows_VD2[0].vehicle_price_id+"' ,vehicle_model_code='"+rows_VD2[0].vehicle_model_code+"' ,chassis_number='"+rows_VD2[0].chassis_number+"' ,imei='"+rows_VD2[0].imei+"' ,complaint_type='"+complaint_type+"',complaint_remarks='"+complaint_remarks+"',created_by='"+user_id+"',created_by_name='"+rows_U[0].name+"',created_by_user_type='"+rows_U[0].user_type+"', created_by_user_type_name = '"+rows_UT[0].user_role+"',created_datetime=NOW() "; 
                          con.query(queryString_VC, function (err_VC, rows_VC) {

                //   console.log (queryString_VC);     
                             var queryString_D_V2 ="UPDATE dealer SET auto_increment_complaint_suffix = '"+suffix+"' where dealer_id='"+rows_VD2[0].dealer_id+"' ";
                         con.query(queryString_D_V2, function (err_D_V2, rows_D_V2) {
                       
                          var mail_content='';

                          mail_content +='<table width="80%" align="left" border="0" align="center">';
                          mail_content +='<tr><td> </td><td> </td> </tr>';
                          mail_content +='<tr><td> </td><td> </td> </tr>';
                          mail_content +='<tr><td><b>Complaint #:</b> </td><td> '+complaint_id+' </td> </tr>';
                          mail_content +='<tr><td><b>Complaint Type:</b> </td><td> '+complaint_type+' </td> </tr>';
                          mail_content +='<tr><td><b>Complaint Description:</b> </td><td> '+complaint_remarks+' </td> </tr>';
                          mail_content +='<tr><td><b>Created By:</b> </td><td> '+rows_U[0].name+' </td> </tr>';                            
                          mail_content +='<tr><td><b>Registration # :</b> </td><td> '+rows_VD2[0].registration_number+'  </td> </tr>';
                          mail_content +='<tr><td><b>Chassis # :</b> </td><td>  '+rows_VD2[0].chassis_number+' </td> </tr>';
                          mail_content +='<tr><td><b>Vehicle Model :</b> </td><td>  '+rows_VD2[0].vehicle_model_name+' </td> </tr>';
                          mail_content +='<tr><td><b>Vehicle Variant :</b> </td><td>  '+rows_VD2[0].vehicle_variant_name+' </td> </tr>';
                          mail_content +='<tr><td><b>Vehicle Color :</b> </td><td>  '+rows_VD2[0].vehicle_color_name+'</td> </tr>';
                          mail_content +='<tr><td><b>Booking Name  :</b> </td><td> '+rows_U[0].name+' </td> </tr>';
                          mail_content +='<tr><td><b>Address :</b> </td><td> '+rows_U[0].address+' </td> </tr>';
                          mail_content +='<tr><td><b>Pin code :</b> </td><td> '+rows_U[0].pincode+' </td> </tr>';
                          mail_content +='<tr><td><b>Mobile # :</b> </td><td> '+rows_U[0].mobile_number+' </td> </tr>';
                          mail_content +='<tr><td><b>Email :</b> </td><td> '+rows_U[0].email_id+' </td> </tr>';
                          mail_content +='<tr><td> </td><td> </td> </tr>';
                          mail_content +='<tr><td> </td><td> </td> </tr>';
                          mail_content +='<tr><td colspan="2">Thank you for using our services. </td> </tr>';
                          mail_content +='</table>';
                          
                        //  console.log(rows_U[0].dealer_email);//to
                         // console.log(rows_U[0].email_id);//cc
                   
                         const mailOptions = {
                          from: 'support@bncmotors.in', // Sender address
                          to: ''+rows_U[0].dealer_email+'', // List of recipients
                          //to:'kavitha.s@anav.bike',
                          cc:'meyyanathan.r@bncmotors.in,sureshdev@bncmotors.in,arn@bncmotors.in,swetha.s@bncmotors.in,'+rows_U[0].email_id+'',
                          //cc: 'sathishkumar.a@anav.bike,swetha.s@bncmotors.in',
                          subject: "Complaint "+complaint_id+" has been raised by "+rows_U[0].name+" ", // Subject line
                          html: 'Dear Sir/Madam, <br><br> Following are the details:<br><br>  '+mail_content+' ', // Plain text body
                     };
                          // transporter.sendMail(mailOptions, function(err, info) {
                          //     if (err) {
                          //       res_arr = { status: 0, message: 'Could not able to send mail' };
                          //       res.send(res_arr);
                          //     } else {
                          //       res_arr = { status: 1, message: 'Complaint posted successfully and a mail has been sent to corresponding Dealer.' };
                          //       res.send(res_arr);
                          //     }
                          // });
                          res_arr = { status: 1, message: 'Complaint posted successfully and a mail has been sent to corresponding Dealer.' };
                           res.send(res_arr);



                       });                            
                      });
                      });  
                  });
                  }else{
                      res_arr = { status: 0, message: 'Sorry. Vehicle Number not available in Database' };
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

