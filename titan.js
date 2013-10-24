var fs = require('fs');
var path = require('path');
var argo = require('argo');
var formatter = require('argo-formatter');
var gzip = require('argo-gzip');
var logger = require('argo-clf');
var router = require('argo-url-router');
var resource = require('argo-resource');
var url = require('./middleware/url');

var Titan = function(options) {
  options = options || {};

  this.directory = options.directory || path.dirname(require.main.filename);

  this.directories = options.directories || {};
  this.directories.resources = this.directories.resource
      || path.join(this.directory, 'resources');

  this.argo = argo();
  this.formatter = null;

  this.manual = false;

  this.argo
    .use(gzip)
    .use(router)
    .use(logger)
    .use(url);
};

['use', 'route', 'map', 'build', 'get', 'post',
 'put', 'patch', 'delete', 'options', 'trace'].forEach(function(f) {
  Titan.prototype[f] = function() {
    var args = Array.prototype.slice.call(arguments);
    this.argo[f].apply(this.argo, args);
    return this;
  };
});

Titan.prototype.build = function() {
  this._wire();
  var args = Array.prototype.slice.call(arguments);
  this.argo.build.apply(this.argo, args);
  return this;
};

Titan.prototype.listen = function() {
  this._wire();
  var args = Array.prototype.slice.call(arguments);
  this.argo.listen.apply(this.argo, args);
  return this;
};

Titan.prototype.add = function() {
  var args = Array.prototype.slice.call(arguments);
  this.argo.use(resource.apply(null, args));

  this.manual = true;

  return this;
};

Titan.prototype.format = function(options) {
  if (!options.directory) {
    options.directory = path.join(path.dirname(require.main.filename), '/formats');
  }

  this.formatter = formatter(options);
  this.argo.use(this.formatter);
  return this;
};

Titan.prototype._wire = function() {
  var dir = this.directories.resources;

  if (!this.manual) {
    var files = fs.readdirSync(dir);
    var self = this;

    files.filter(function(file) {
      return file[0] !== '.';
    }).forEach(function(file) {
      var res = require(path.join(self.directories.resources, file));
      self.argo.use(resource(res));
    });
  }
};

module.exports = function(options) {
  var titan = new Titan(options);
  return titan;
};
