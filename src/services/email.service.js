const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger";
  const text = `Hi ${name}, your account has been created successfully.`;
  const html = `<h3>Welcome ${name}!</h3>
    <p>Your account has been created successfully.</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful";
  const text = `
Hi ${name},
Your transaction is successful.
Amount: ${amount}
To: ${toAccount}
`;
  const html = `
  <h3>Transaction Successful</h3>
  <p>Hi ${name},</p>
  <p>Amount: <b>${amount}</b></p>
  <p>To Account: <b>${toAccount}</b></p>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(
  userEmail,
  name,
  account,
  toAccount,
) {
  const subject = "Transaction Failed";
  const text = `
Hi ${name},
Transaction failed.
From: ${account}
To: ${toAccount}
`;
  const html = `
  <h3>Transaction Failed</h3>
  <p>Hi ${name},</p>
  <p>From: <b>${account}</b></p>
  <p>To: <b>${toAccount}</b></p>
  `;
  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
