##Templated email
Easy development/support and using email templates.

##Supports for other template engines
###Base usage
```javascript
var Mailer = require('templated-mail');
var TemplateProvider = require('templated-mail/providers/template/handlebars');

var mailer = new Mailer(new TemplateProvider(), {
  host: 'smtp.example.com',
  secure: true,
  port: 465,
  auth: {
    user: 'login',
    pass: 'AwesomePassword'
  }
});

mailer
  .send({
    from: 'sender@example.com',
    to: 'receiver@example.com',
    subject: 'Very important'
  }, 'template_name', {foo: 'bar'})
  .then(function(out) {
    // action on success
    // `out` = response of server on your request
    // maybe `out` contains info by error or description some troubles which block sending or receiving message for receiver
  })
  .catch(function(err) {
    // ...
  });
```

###Setting helpers
```javascript
var options = {
  helpers: [Math.round] // helper with name `round`
};

var mailer = new Mailer(new TemplateProvider(options), {
  host: 'smtp.example.com',
  secure: true,
  port: 465,
  auth: {
    user: 'login',
    pass: 'AwesomePassword'
  }
});
```
Function name is name of helper. You can define by named function. If you use ECMAScript 5 or older version you can use some polyfill (or hook) for `Function.name` property or upgrade nodejs version :)

###Setting templates
You can redefine function (`setHTMLTemplateGetter` and `setTextTemplateGetter`) for determine location requested template. If function for `text template` is not defined it will be taken stringified `html template` (without tags).

By default template path is relative by project "template".

Usage example:
```javascript
/*
Structure of your paths for templates:
 /
 └─ home
  └─ user
   └─ templates
    └─ ${name}
     └─ ${lang}.html.hbs
 */

var templatePath = '/home/user/templates';
var options = {
  getHTMLtemplate(template) {
    return `${templatePath}/${template.name}/${template.lang}.html.hbs`;
  }
};

var mailer = new Mailer(new TemplateProvider(options), {
  host: 'smtp.example.com',
  secure: true,
  port: 465,
  auth: {
    user: 'login',
    pass: 'AwesomePassword'
  }
});
```

##Command for test
```bash
node index.test.js --host=smtp.example.com --login=me@example.com --password=AwesomePassword --to=test@example.com --from=me@example.com
# or short version
node index.test.js -H smtp.example.com -L me@example.com -P AwesomePassword -T test@example.com -F me@example.com
```
