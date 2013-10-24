var fs = require('fs');
var path = require('path');
var argo = require('argo');
var formatter = require('argo-formatter');
var gzip = require('argo-gzip');
var logger = require('argo-clf');
var router = require('argo-url-router');
var resource = require('argo-resource');

var url = require('./middleware/url');

var ContainerResourceFactory = require('./container_resource_factory');
var DirectoryResourceFactory = require('./directory_resource_factory');
var ManualResourceFactory = require('./manual_resource_factory');

var Titan = function(options) {
  options = options || {};

  this.argo = argo();
  this.formatter = null;

  this.resourceFactory =
    new DirectoryResourceFactory(options.resourceDirectory);

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
  if (!(this.resourceFactory instanceof ManualResourceFactory)) {
    this.resourceFactory = new ManualResourceFactory();
  }

  var args = Array.prototype.slice.call(arguments);
  this.resourceFactory.register.apply(this.resourceFactory, args);

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

Titan.prototype.setResourceFactory = function(factory) {
  this.resourceFactory = factory;
  return this;
};

Titan.prototype._wire = function() {
  var self = this;
  this.resourceFactory.resolve().forEach(function(res) {
    self.argo.use(res);
  });
};

var titan = module.exports = function(options) {
  var titan = new Titan(options);
  return titan;
};

titan.DirectoryResourceFactory = DirectoryResourceFactory;
titan.ContainerResourceFactory = ContainerResourceFactory;
