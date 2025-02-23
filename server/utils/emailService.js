const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendCredentialsEmail = async (email, username, password, jobDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your CampusHire Job Holder Account Credentials',
    html: `
      <h2>Welcome to CampusHire!</h2>
      <p>Your job holder account has been verified and created. Here are your login credentials:</p>
      
      <p><strong>Username:</strong> ${username}</p>
      <p><strong>Password:</strong> ${password}</p>
      
      <p>Job Details Verified:</p>
      <ul>
        <li>Company: ${jobDetails.companyName}</li>
        <li>Role: ${jobDetails.role}</li>
        <li>Year of Joining: ${jobDetails.yearOfJoining}</li>
      </ul>
      
      <p>Please login at: ${process.env.FRONTEND_URL}/login</p>
      
      <p>For security reasons, please change your password after your first login.</p>
      
      <p>Best regards,<br>CampusHire Team</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendCredentialsEmail
}; 