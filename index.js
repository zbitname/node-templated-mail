var nodemailer = require('nodemailer');
var htmlToText = require('html-to-text');

/**
 * [Mailer description]
 * @param {Provider} templateProvider one of template provider from `providers/template/*`
 * @param {Object} transportOptions options for `nodemailer.createTransport`
 */
function Mailer(templateProvider, transportOptions) {
  this.transportOptions = transportOptions;
  this.templateProvider = templateProvider;
}

/**
 * Send email
 * @param  {Object} options:
 *          from - The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted '"Sender Name" <sender@server.com>', see Address Formatting for details
 *          to - Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
 *          cc - Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field
 *          bcc - Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field
 *          subject - The subject of the e-mail
 *          attachments - An array of attachment objects:
 *                  filename - filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as false, otherwise a filename is generated automatically
 *                  content - String, Buffer or a Stream contents for the attachment
 *                  path - path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments)
 *                  contentType - optional content type for the attachment, if not set will be derived from the filename property
 *                  contentDisposition - optional content disposition type for the attachment, defaults to 'attachment'
 *                  cid - optional content id for using inline images in HTML message source
 *                  encoding - If set and content is string, then encodes the content to a Buffer using the specified encoding. Example values: base64, hex, binary etc. Useful if you want to use binary attachments in a JSON formatted e-mail object.
 *                  headers - custom headers for the attachment node. Same usage as with message headers
 *                  raw - is an optional special value that overrides entire contents of current mime node including mime headers. Useful if you want to prepare node contents yourself
 * @param  {Mixed} template Template description
 * @param  {Object} context Variables for template
 * @return {Promise} Don't forget catch
 */
Mailer.prototype.send = function(options, template, context) {
  var opts = Object.assign(options);
  var transporter = nodemailer.createTransport(this.transportOptions);

  return this.templateProvider
    .compileTemplates(template, context)
    .then(templates => {
      if (templates[0] === null && templates[1] === null) {
        throw new Error('One of templates (text or html) must be not empty');
      }

      opts.html = templates[0] === null ? templates[1] : templates[0];
      opts.text = templates[1] === null ? htmlToText.fromString(templates[0]) : templates[1];

      return new Promise((resolve, reject) => {
        transporter.sendMail(opts, (err, info) => {
          if (err) {
            return reject(err);
          }

          return resolve(info);
        });
      });
    });
};

module.exports = Mailer;
