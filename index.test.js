var argv = require('argv');
var Mailer = require('./index');
var TemplateProvider = require('./providers/template/handlebars');

argv.option({
  name: 'to',
  short: 'T',
  type: 'string',
  description: 'To mail (receiver)'
});

argv.option({
  name: 'from',
  short: 'F',
  type: 'string',
  description: 'From mail (sender)'
});

argv.option({
  name: 'login',
  short: 'L',
  type: 'string',
  description: 'Login of your account'
});

argv.option({
  name: 'password',
  short: 'P',
  type: 'string',
  description: 'Password of your account'
});

argv.option({
  name: 'host',
  short: 'H',
  type: 'string',
  description: 'Host of your SMTP server'
});

argv.option({
  name: 'secure',
  short: 's',
  type: 'boolean',
  description: 'Secure connection? Default: true'
});

argv.option({
  name: 'port',
  short: 'p',
  type: 'int',
  description: 'Port. Default: 465'
});

argv.option({
  name: 'subject',
  short: 'S',
  type: 'String',
  description: 'Subject mail. Default: Test'
});

var args = argv.run();
var opts = args.options;

var needExit = false;

if (!opts.host) {
  needExit = true;
  console.error('--host or -H is required argument');
}

if (!opts.login) {
  needExit = true;
  console.error('--login or -L is required argument');
}

if (!opts.password) {
  needExit = true;
  console.error('--password or -P is required argument');
}

if (!opts.to) {
  needExit = true;
  console.error('--to or -T is required argument');
}

if (!opts.from) {
  needExit = true;
  console.error('--from or -F is required argument');
}

if (needExit) {
  process.exit();
}

var templatePath = 'template';

var options = {
  getHTMLtemplate(templateName) {
    return `${templatePath}/${templateName}.html.hbs`;
  },
  helpers: [
    function testHelper() {
      return 'This is TEST!!!!!!1111111111';
    }
  ]
};

var mailer = new Mailer(new TemplateProvider(options), {
  host: opts.host,
  secure: opts.secure || true,
  port: opts.port || 465,
  auth: {
    user: opts.login,
    pass: opts.password
  }
});

argv.run();

mailer.send({
  from: opts.from,
  to: opts.to,
  subject: opts.subject || 'test'
}, 'test', {test: 'FOO'}).then(out => {
  console.log('FINE', out);
}).catch(err => {
  console.log('ERROR', err);
});

