const forgetPasswordTemplate = ({name,otp}) =>{
    return `
    <h1>Hello, ${name}!</h1>
    <p>We've received a request to reset your password. Please use the following OTP to complete the process:</p>
    <h2>${otp}</h2>
    <p>This OTP will expire in 30 minutes.</p>
     <br/>
    <p>Thanks</p>
    `;
}