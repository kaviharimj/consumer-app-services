const express = require('express'); 
//const Razorpay = require('razorpay'); 
//const kkiapay = require('kkiapay/nodejs-sdk');
const kkiapay   = require('kkiapay/nodejs-sdk');

// Initialize kkiapay instance with your credentials
const kkiapayInstance = new kkiapay({
    privatekey: "tpk_37f03af04a4a11eea1a1eff49c7a398c",
    publickey: "37f013e04a4a11eea1a1eff49c7a398c",
    secretkey: "tsk_37f03af14a4a11eea1a1eff49c7a398c",
    sandbox: true // Set to false for production
});

// Create a payment order
kkiapayInstance.createOrder({
    amount: 1000, // Amount in cents
    currency: "USD",
    description: "Test Payment Order",
    redirect_url: "https://yourwebsite.com/payment/redirect", // URL to redirect after payment
    callback_url: "https://yourwebsite.com/payment/callback" // URL to receive payment status callback
})
.then(order => {
    console.log("Payment Order created:", order);
    // Redirect user to the payment gateway with order details
    // For example:
    // res.redirect(order.payment_url);
})
.catch(error => {
    console.error("Error creating Payment Order:", error);
});

const app = express(); 
const PORT = process.env.PORT || '5000'; 
 

app.listen(PORT, ()=>{ 
	console.log("Server is Listening on Port ", PORT); 
}); 
