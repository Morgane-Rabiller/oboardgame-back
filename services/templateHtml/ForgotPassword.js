require('dotenv').config();


const createHtmlForgotPassword = (user, link) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <link href='https://fonts.googleapis.com/css?family=Raleway' rel='stylesheet'>
        <style>
            .h1 {
                color: #D0D0D0;
                font-family: "Raleway", sans-serif; 
                margin: 0;
            }
            .h2 {
                color: black;
            }
            .h3 {
                color: black;
            }
            .h4 {
                color: black;
            }
            .h5 {
                color: black;
            }
            .p {
                color: black;
            }
        </style>
    </head>
        <body style="font-family: Raleway", sans-serif; background-color: #fff; margin: 0; padding: 0;">
            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff;">
                <tr>
                <td align="center" style="padding: 20px;">
                    <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #dbb6f3; border-radius: 10px;">
                    <tr>
                        <td>
            
                        <!-- En-tête avec logo et nom -->
                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #2d2d2d; border-radius: 10px 10px 0 0;">
                            <tr>
                            <td style="padding: 20px; display: flex; align-items: center;">
                                <img src="cid:logo" width="65" height="65" alt="Logo O'Oboardgame" style="margin-right: 10px;" />
                                <h1 style="font-size: 1.5rem; color: #D0D0D0; font-family: 'Raleway', sans-serif; margin: 0;">O'Boardgame</h1>
                            </td>
                            <td align="right" style="color: #D0D0D0; padding: 20px;">
                                <h3>Bonjour ${user} !</h3>
                            </td>
                            </tr>
                        </table>
            
                        <!-- Contenu du corps de l'e-mail -->
                        <table width="100%" cellspacing="0" cellpadding="20" border="0">
                            <tr style="background-color: #fff; width: 100%;">
                                <td colspan="3">
                                    <h4>Tu as fait une demande de renouvellement de mot de passe ?</h4>
                                    <p> Si ce n'est pas toi, merci d'ignorer ce mail.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="background-color: #fff; width: 10%;"></td>
                                <td>
                                    <a href="${link}" style="margin: 0;">Clique ici pour changer ton mot de passe</a>
                                </td>
                                <td style="background-color: #fff; width: 10%;"></td>
                            </tr>
                            <tr style="background-color: #fff; width: 100%;">
                                <td colspan="3">
                                    <p style="margin: 0;"></p>
                                </td>
                            </tr>
                        </table>
            
                        <!-- Pied de page avec liens -->
                        <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #2d2d2d; border-radius: 0 0 10px 10px;">
                            <tr>
                            <td align="left" style="padding: 10px 20px;">
                                <p style="color: #D0D0D0; font-size: 10px;">L'équipe O'Boardgame</p>
                            </td>
                            <td align="right" style="padding: 10px 20px;">
                                <a href="mailto:${process.env.EMAIL}" style="color: #D0D0D0; text-decoration: none; font-size: 14px;">Contacter l'administrateur</a>
                            </td>
                            </tr>
                        </table>
            
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
        </body>
    </html>
    `;
    return htmlContent;
}
module.exports = createHtmlForgotPassword;