const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: ({
    recipient_email,
    link,
    subject,
    receiver,
    message,
    redirect = true,
    buttonText = "Verify Your Account",
  }) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });

      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: `${subject}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FORGOT PASSWORD</title>
</head>
<body>
<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2; background-image: url('https://images.unsplash.com/photo-1484910292437-025e5d13ce87?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;">
  <div style="margin: 50px auto; height: 100%; width: 70%; padding: 20px; background-color: rgba(255, 255, 255, 0.8); border-radius:10px">
    <div style="border-bottom: 1px solid #eee; padding-bottom: 20px;">
      <a href="" style="font-size: 1.4em; color: #187BCD; text-decoration: none; font-weight: 600;">TRAVELINK</a>
    </div>
    <div style="color: #000; padding-bottom: 20px;">
      <p style="font-size: 1.1em;">Hi, ${receiver}</p>
      <p>${message}</p>
      ${
        redirect
          ? `<a href=${link} target="_blank" style="background: #187BCD; margin: 0 auto; width: max-content; padding: 5px 10px; color: #fff; border-radius: 4px; text-decoration: none;">${buttonText}</a>`
          : ``
      }
    </div>
  </div>
</div>
</body>
</html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  },
};
