keystone = require('keystone')
var nodemailer = require('nodemailer');
var User = keystone.list('User');

exports.send = function(req, res) {
  data = (req.method == 'POST') ? req.body : req.query;
  console.log(data)
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'akiyar18@gmail.com',
        pass: 'Rickss12'
      }
    });

    var mailOptions = {
      from: 'akiyar18@gmail.com',
      to: data.email,
      subject: 'Push your data',
      text: 'Deviceid: '+ data.deviceid + '\n' +'Nodeid: ' + data.nodeid + '\n' + 'Authorization: ' + data.auth + '\n' + 'keyData: ' + data.keyData
    }; 

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    res.apiResponse({
      error: false,
      message: 'Successfully send message'
    });

}

