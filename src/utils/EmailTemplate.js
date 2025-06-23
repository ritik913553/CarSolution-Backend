export const Reset_Password_Email_Template = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Vizztal Car Solution</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        body {
            font-family: 'Poppins', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .email-header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 30px 20px;
            text-align: center;
        }

        .logo {
            max-width: 180px;
            margin-bottom: 15px;
        }

        .email-title {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }

        .email-body {
            padding: 30px;
            text-align: center;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            text-align: left;
        }

        .reset-instructions {
            margin-bottom: 25px;
            text-align: left;
        }

        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .expiry-note {
            color: #6b7280;
            font-size: 14px;
            margin: 25px 0;
        }

        .support-note {
            text-align: left;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .email-footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

        .footer-links {
            margin: 10px 0;
        }

        .footer-links a {
            color: #2563eb;
            text-decoration: none;
            margin: 0 10px;
        }

        .copyright {
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://vizztalcarsolution.com/logo.png" alt="Vizztal Car Solution" class="logo">
            <h1 class="email-title">Reset Your Password</h1>
        </div>
        <div class="email-body">
            <p class="greeting">Hi {user_name},</p>

            <p class="reset-instructions">We received a request to reset your Vizztal Car Solution account password. Click the button below to reset it:</p>

            <a href="{reset_link}" class="reset-button">Reset Password</a>

            <p class="expiry-note">This link will expire in 24 minutes. If you didn't request a password reset, you can safely ignore this email.</p>

            <p class="support-note">If you're having trouble with the button above, copy and paste this link into your browser:<br>
                <a href="{reset_link}" style="color: #2563eb; word-break: break-all;">{reset_link}</a>
            </p>

            <p style="text-align: left;">Thanks,<br>The Vizztal Car Solution Team</p>
        </div>
        <div class="email-footer">
            <div class="footer-links">
                <a href="https://vizztalcarsolution.com">Our Website</a>
                <a href="https://vizztalcarsolution.com/contact">Contact Us</a>
                <a href="https://vizztalcarsolution.com/privacy">Privacy Policy</a>
            </div>
            <p class="copyright">
                &copy; 2025 Vizztal Car Solution. All rights reserved.<br>
                123 Fashion Avenue, Suite 500, New York, NY 10001
            </p>
        </div>
    </div>
</body>

</html>

`;

export const Verification_Email_Template = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Vizztal Car Solution</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        
        body {
            font-family: 'Poppins', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .email-header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 30px 20px;
            text-align: center;
        }

        .logo {
            max-width: 180px;
            margin-bottom: 15px;
        }

        .email-title {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }

        .email-body {
            padding: 30px;
            text-align: center;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            text-align: left;
        }

        .verification-instructions {
            margin-bottom: 25px;
            text-align: left;
        }

        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .expiry-note {
            color: #6b7280;
            font-size: 14px;
            margin: 25px 0;
        }

        .alternative-link {
            text-align: left;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }

        .email-footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }

        .footer-links {
            margin: 10px 0;
        }

        .footer-links a {
            color: #10b981;
            text-decoration: none;
            margin: 0 10px;
        }

        .copyright {
            margin-top: 15px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://vizztalcarsolution.com/logo.png" alt="Vizztal Car Solution" class="logo">
            <h1 class="email-title">Verify Your Email Address</h1>
        </div>
        <div class="email-body">
            <p class="greeting">Welcome to Vizztal Car Solution, {user_name}!</p>
            
            <p class="verification-instructions">Thank you for creating an account with us. To complete your registration and access our services, please verify your email address by clicking the button below:</p>
            
            <a href="{verification_link}" class="verify-button">Verify Email Address</a>
            
            <p class="expiry-note">This verification link will expire in 24 hours. If you didn't create an account with Vizztal Car Solution, please ignore this email.</p>
            
            <p class="alternative-link">If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="{verification_link}" style="color: #10b981; word-break: break-all;">{verification_link}</a></p>
            
            <p style="text-align: left;">Thanks!<br>The Vizztal Car Solution Team</p>
        </div>
        <div class="email-footer">
            <div class="footer-links">
                <a href="https://vizztalcarsolution.com">Our Website</a>
                <a href="https://vizztalcarsolution.com/contact">Help Center</a>
                <a href="https://vizztalcarsolution.com/faq">FAQs</a>
            </div>
            <p class="copyright">&copy; 2025 Vizztal Car Solution. All rights reserved.<br>
            123 Fashion Avenue, Suite 500, New York, NY 10001</p>
        </div>
    </div>
</body>

</html>
`;