const HTML_CHANGE_PASSWORD = (recoverCode: string): string => `
<!doctype html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
		@import url('https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap');
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }

      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span,
      table.body a {
        font-size: 16px !important;
      }

      table.body .wrapper,
      table.body .article {
        padding: 10px !important;
      }

      table.body .content {
        padding: 0 !important;
      }

      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }

      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }

      table.body .btn table {
        width: 100% !important;
      }

      table.body .btn a {
        width: 100% !important;
      }

      table.body .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    @media all {
      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }

      .btn-primary table td:hover {
        background-color: #34495e !important;
      }

      .btn-primary a:hover {
        filter: brightness(0.8);
      }
    }
  </style>
</head>

<body
  style="background-color: ; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"
    style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: rgb(1,17,18); width: 100%;"
    width="100%" bgcolor="rgb(1,17,18)">
    <tr>
      <td style="font-family: 'Poppins', sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
      <td class="container"
        style="font-family: 'Poppins', sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;"
        width="580" valign="top">
        <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0"
            style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
            <tr>
              <td class="content-block"
                style="font-family: 'Poppins', sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; background-color: rgb(1, 17, 18); color: white; font-size: 12px; text-align: center;"
                valign="top" align="center">
                <p style="font-weight:bold;color:white;">Nyumi</p>
              </td>
            </tr>
          </table>
        </div>
        <div class="content"
          style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px; background-color:rgb(1, 17, 18);">

          <!-- START CENTERED WHITE CONTAINER -->
          <table role="presentation" class="main"
            style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: none; border-radius: 3px; width: 100%;"
            width="100%">

            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper"
                style="font-family: 'Poppins', sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;color:white; background-color: rgb(1, 17, 18)"
                valign="top">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0"
                  style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                  width="100%">
                  <tr>
                    <td style="font-family: 'Poppins', sans-serif; font-size: 14px; vertical-align: top;" valign="top"; color: white;>
                      <p
                        style="font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">
                        Bonjour,</p>
                      <p
                      style="font-weight:bold;color:white;">
                        Pour changer votre mot de passe, veuillez entrer le code de confirmation suivant dans l'application: ${recoverCode}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
          </table>
          <!-- END CENTERED WHITE CONTAINER -->

          <!-- START FOOTER -->
          <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0"
              style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
              width="100%">
              <tr>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->

        </div>
      </td>
      <td style="font-family: 'Poppins', sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
    </tr>
  </table>
</body>

</html>
`;
export default HTML_CHANGE_PASSWORD;
