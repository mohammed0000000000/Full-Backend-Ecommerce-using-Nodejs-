
const verifyEmailTemplate = ({name, url}) => {
    return `
    <h1>Welcome to our E-Commerce Website, ${name}!</h1>
    <p>Please verify your email by clicking the following link:</p>
    <a href="${url}">Verify Email</a>
    <p>If you didn't request this verification, please ignore this email.</p>
    `;
}

export default verifyEmailTemplate;