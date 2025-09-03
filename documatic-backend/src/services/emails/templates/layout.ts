const colors = {
  light: {
    background: '#f8f9fb',
    card: '#ffffff',
    text: '#070620',
    textMuted: '#808093',
    primary: '#4f39f6',
    primaryHover: '#6B59F8',
    secondary: '#4f39f6',
    secondaryHover: '#6B59F8',
    border: '#e5e5e5',
  },
  dark: {
    background: '#18191b',
    card: '#212225',
    text: '#dbdbdb',
    textMuted: '#5a6169',
    primary: '#4f39f6',
    primaryHover: '#6B59F8',
    secondary: '#4f39f6',
    secondaryHover: '#6B59F8',
    border: '#323238',
  },
};

/**
 * Replace color variables in content with their actual values
 * Supports both $colors.light.x and $colors.dark.x syntax
 * Uses a more precise regex pattern to avoid partial matches
 */
const replaceColorVariables = (content: string): string => {
  let processedContent = content;

  // Process each color mode (light/dark)
  Object.entries(colors).forEach(([mode, colorSet]) => {
    // Create a single regex pattern for all color keys in this mode
    const colorKeys = Object.keys(colorSet).join('|');
    const regex = new RegExp(`\\$colors\\.${mode}\\.(${colorKeys})\\b`, 'g');

    // Replace all matches with their corresponding color values
    processedContent = processedContent.replace(
      regex,
      (match, key: keyof typeof colorSet) => {
        return colorSet[key];
      },
    );
  });

  return processedContent;
};

/**
 * Type for email template content
 */
export type EmailTemplate = {
  content: string;
  peak: string;
};

/**
 * Master email template layout
 * All email templates will be wrapped with this layout
 */
export const emailLayout = (
  template: EmailTemplate | string,
  forceDarkMode = false,
): string => {
  // Process color variables in content
  const content = typeof template === 'string' ? template : template.content;
  const peak = typeof template === 'string' ? '' : template.peak;
  const processedContent = replaceColorVariables(content);

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" class="${forceDarkMode ? 'force-dark-mode' : ''}">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: Arial, sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
    <title>DocuMatic Email</title>
    <style>
      :root {
        color-scheme: light dark;
        supported-color-schemes: light dark;
      }

      /* Light mode (default) styles */
      body {
        margin: 0;
        width: 100%;
        padding: 0;
        word-break: break-word;
        -webkit-font-smoothing: antialiased;
        background-color: ${colors.light.background};
        color: ${colors.light.text};
      }

      /* Dark mode styles - only apply when system is in dark mode */
      @media (prefers-color-scheme: dark) {
        body {
          background-color: ${colors.dark.background} !important;
          color: ${colors.dark.text} !important;
        }
        img.logo-light { display: none !important; }
        img.logo-dark { display: block !important; }
        .dark-mode-bg { background-color: ${colors.dark.background}; }
        .dark-mode-card { background-color: ${colors.dark.card}; }
        .dark-mode-text-base { color: ${colors.dark.text}; }
        .dark-mode-text-muted { color: ${colors.dark.textMuted}; }
        .dark-mode-border { border-color: ${colors.dark.border}; }
        hr.dark-mode-border { border-color: ${colors.dark.border}; }
      }

      /* Force dark mode styles when flag is true */
      html.force-dark-mode .logo-light { display: none !important; }
      html.force-dark-mode .logo-dark { display: block !important; }
      html.force-dark-mode .dark-mode-bg { background-color: ${colors.dark.background} !important; }
      html.force-dark-mode .dark-mode-card { background-color: ${colors.dark.card} !important; }
      html.force-dark-mode .dark-mode-text-base { color: ${colors.dark.text} !important; }
      html.force-dark-mode .dark-mode-text-muted { color: ${colors.dark.textMuted} !important; }
      html.force-dark-mode .dark-mode-border { border-color: ${colors.dark.border} !important; }

      /* Responsive styles */
      .hover-bg-blue-600:hover { background-color: ${colors.light.primaryHover} !important; }
      .hover-underline:hover { text-decoration: underline !important; }
      @media (max-width: 600px) {
        .sm-w-full { width: 100% !important; }
        .sm-py-32 { padding-top: 32px !important; padding-bottom: 32px !important; }
        .sm-px-24 { padding-left: 24px !important; padding-right: 24px !important; }
        .sm-leading-32 { line-height: 32px !important; }
      }
    </style>
  </head>

  <body class="dark-mode-bg" style="background-color: ${colors.light.background};">
    <div style="display: none;">
      ${peak} &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &zwnj;
      &#160;&#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
      &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &zwnj;
      &#160;&#847; &#847; &#847; &#847; &#847;
    </div>

    <div class="dark-mode-bg" style="background-color: ${colors.light.background};" role="article" aria-roledescription="email" aria-label="DocuMatic Email" lang="en">
      <table class="sm-w-full" align="center" style="width: 600px;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding: 38px 0;">
            <a href="https://documatic.com">
              <img src="https://cdn.documatic.xyz/documatic-logo-on-light.png" alt="DocuMatic logo" class="logo-light" width="120" style="max-width: 100%; vertical-align: middle; line-height: 100%; border: 0; display: block;">
<img src="https://cdn.documatic.xyz/documatic-logo-on-dark.png" alt="DocuMatic Logo" class="logo-dark" width="120" style="max-width: 100%; vertical-align: middle; line-height: 100%; border: 0; display: none;">
            </a>
          </td>
        </tr>
      </table>

      <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; border-radius: 12px;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" class="dark-mode-bg" style="background-color: ${colors.light.background};">
            <table class="sm-w-full" style="width: 600px;" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" class="sm-px-24">
                  <table style="margin-bottom: 28px; width: 100%; border-radius: 12px;" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="dark-mode-card dark-mode-text-base sm-px-24" style="background-color: ${colors.light.card}; padding: 24px 48px; text-align: left; font-size: 16px; line-height: 24px; color: ${colors.light.text}; border-radius: 8px;">
                        ${processedContent}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table style="width: 100%; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td class="dark-mode-text-muted" style="text-align: center; font-size: 12px; color: ${colors.light.textMuted};">
            <p style="margin: 0; margin-bottom: 4px;">This email was sent automatically by DocuMatic CMMS. Do not reply to this message.</p>
            <p style="margin: 0;">
              <a href="https://documatic.com" class="hover-underline" style="color: ${colors.light.primary}; text-decoration: none;">DocuMatic</a> &bull;
<a href="https://documatic.com/support" class="hover-underline" style="color: ${colors.light.primary}; text-decoration: none;">Support</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
};
