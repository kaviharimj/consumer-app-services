var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.11.86',
    user     : 'root',
    password : '',
    database : 'db_ebike',
 // multipleStatements: true
});
// var connection = mysql.createConnection({
//     host     : '3.110.86.132',
//     user     : 'anav',
//     password : 'booma@2022',
//     database : 'db_ebike',
//  // multipleStatements: true
// });
connection.connect(function(err){
if(!err) {
    console.log("Database connected");
} else {
    console.log("Database not connected");
}
});
module.exports = connection;