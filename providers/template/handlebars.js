'use strict';

var handlebars = require('handlebars');
var fs = require('fs');

var getTextTemplate = templateName => {
  return 'templates/' + templateName + '.text.hbs';
};

var getHTMLTemplate = templateName => {
  return 'templates/' + templateName + '.html.hbs';
};

/**
 * Provider main class
 */
function Provider(options) {
  if (!options) {
    options = {};
  }

  this.provider = 'hbs';
  this._getTextTemplate = options.getTextTemplate || getTextTemplate;
  this._getHTMLTemplate = options.getHTMLTemplate || getHTMLTemplate;
  this.handlebars = handlebars.create();

  if (options.helpers && options.helpers.length) {
    options.helpers.forEach(fnc => {
      this.handlebars.registerHelper(fnc.name, fnc);
    });
  }
}

Provider.prototype.compileTemplates = function(template, context) {
  var htmlTemplatePath = this._getHTMLTemplate(template);
  var textTemplatePath = null;

  if (this._getTextTemplate) {
    textTemplatePath = this._getTextTemplate(template);
  }

  var htmlTemplatePromise = new Promise((resolve, reject) => {
    fs.stat(htmlTemplatePath, err => {
      if (err) {
        return reject(err);
      }

      fs.readFile(htmlTemplatePath, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.toString());
      });
    });
  });

  var textTemplatePromise = new Promise((resolve, reject) => {
    if (!textTemplatePath) {
      return resolve(null);
    }

    fs.stat(textTemplatePath, err => {
      if (err) {
        return resolve(null);
      }

      fs.readFile(textTemplatePath, (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.toString());
      });
    });
  });

  return Promise.all([htmlTemplatePromise, textTemplatePromise])
    .then(templates => {
      return templates.map(tpl => {
        if (tpl === null) {
          return null;
        }

        return this.handlebars.compile(tpl);
      });
    })
    .then(tpls => {
      return tpls.map(tpl => {
        if (tpl === null) {
          return null;
        }

        return tpl(context);
      });
    });
};

module.exports = Provider;
