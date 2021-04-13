const express = require("express");
const router = express.Router();
const checksum_lib = require('./checksum');
const https = require('https');

router.post("/genTxnToken", async (request, res) => {
    console.log(request.body);

    var paytmParams = {};
  
    var MID = request.body.mid;
    var orderId = request.body.orderId;
  
    var amount = parseFloat(String(request.body.amount));
    var custId = request.body.custId;
    var key_secret = request.body.key_secret;
    var callbackUrl = request.body.callbackUrl;
    var mode = request.body.mode;
    var website = request.body.website;
    var testing = String(request.body.testing);
    console.log(callbackUrl);
    console.log(mode);
  
    /* query parameters */
    paytmParams.body = {
        "requestType": "Payment",
        "mid": MID,
        "websiteName": website == undefined ? "DEFAULT" : website,
        "orderId": orderId,
        "callbackUrl": callbackUrl,
        "txnAmount": {
            "value": amount,
            "currency": "INR",
        },
        "userInfo": {
            "custId": custId,
        },
  
    };
    
  
    console.log(JSON.stringify(paytmParams));
    checksum_lib.genchecksumbystring(JSON.stringify(paytmParams.body), key_secret, (err, checksum) => {
  
        if (err) {
            return;
        }
        paytmParams.head = {
            "signature": checksum
        };
  
        var post_data = JSON.stringify(paytmParams);
  
        var options = {
            hostname: testing == "0" ? 'securegw-stage.paytm.in' : 'securegw.paytm.in',
            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid=' + MID + '&orderId=' + orderId,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };
  
        // Set up the request
        var response = "";
        var post_req = https.request(options, (post_res) => {
            post_res.on('data', (chunk) => {
                response += chunk;
            });
  
            post_res.on('end', () => {
                console.log(orderId);
                console.log(MID);
                console.log('Response: ', response);
                response = JSON.parse(response);
                res.send(response.body.txnToken);
                return 0;
            });
        });
  
        // post the data
        post_req.write(post_data);
        post_req.end();
    });
});

module.exports = router;