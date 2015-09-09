# Titan: Stellar APIs
<!-- Titan is:

* An API-focused HTTP server and framework.
* A reverse proxy to manage and modify HTTP requests and responses.
* Modular using handlers for request and response pipelines.
* Extensible using a package system.

As an API server:

* Route requests to handlers.
* Separate resources into modules.

As a reverse proxy:

* Route requests to backend servers.
* Transform HTTP messages on the fly.
* Add OAuth 2.0 support to an existing API.
* Create a RESTful API façade over legacy systems.

-->

A stellar API framework built on top of Argo. Titan will provide any API management functionality needed by modern API developers.

1. CORS Management
2. Compression
3. Logging
4. API Resource Definition
5. Interoperable with Argo Packages

Grab this package off npm using the command.

```bash
$ npm install titan
```
## Hello World!

The basic Titan server looks like this.

```javascript
var titan = require('titan');

titan()
  .use(function(handle) {
    handle('response', function(env, next) {
      env.response.body = {'text': 'Hello World'};
      env.response.statusCode = 200;
      env.response.setHeader('Content-Type', 'application/json');
      next(env);  
    });  
  })
  .listen(3000);
```

## Documentation 

* [handleFunction](#handleFunction)
* [use(handleFunction)](#usehandle)
* [use(package)](#usepackage)
* [route](#route)
* Method filters
  * [get](#get)
  * [post](#post)
  * [put](#put)
  * [patch](#patch)
  * [del](#del)
  * [options](#options)
  * [trace](#trace)
* [map](#map)
* [allow](#allow)
* [compress](#compress)
* [logger](#logger)
* [add](#add)

 
<a name="handleFunction"/>
### handleFunction(type, [options], callback)

* `type`: `'request'` or `'response'`

* `options`: Mostly used for internal purposes.  Optional.

* `callback(env, next)`: A request or response callback. `env` is an environment context that is passed to every handler, and `next` is a reference to the next function in the pipeline.

When the handler is complete and wishes to pass to the next function in the pipeline, it must call `next(env)`.

<a name="usehandle"/>
### use(handleFunction)

`handleFunction` is used to set up request and response handlers.  

```javascript
titan()
  //For every request add 'X-Custom-Header' with value 'Yippee!'
  .use(function(handle) {
    handle('request', function(env, next) {
      env.request.headers['X-Custom-Header'] = 'Yippee!';
      next(env);
    });
  })
```
<a name="usepackage"/>
### use(package)

Alias for `include(package)`.

<a name="route"/>
### route(path, [options], handleFunction)

* `path`: a regular expression used to match HTTP Request URI path.

* `options`: an object with a `methods` property to filter HTTP methods (e.g., `{ methods: ['GET','POST'] }`).  Optional.

* `handleFunction`: Same as in `use`.

Example:

```javascript
titan()
  .route('^/greeting$', function(handle) {
    handle('request', function(env, next) {
      env.response.statusCode = 200;
      env.response.headers = { 'Content-Type': 'text/plain' };
      env.response.body = 'Hello World!';
 
      next(env);
    });
  })
```


### Method filters
<a name="get"/>
<a name="post"/>
<a name="put"/>
<a name="patch"/>
<a name="del"/>
<a name="options"/>
<a name="trace"/>

Method filter built on top of `route`. `del` corresponds to
the DELETE method.

Example:

```javascript
titan()
  .get('^/puppies$', function(handle) {
    handle('request', function(env, next) {
      env.response.body = JSON.stringify([{name: 'Sparky', breed: 'Fox Terrier' }]);
      next(env);
    });
  })
```
<a name="map"/>
### map(path, [options], titanSegmentFunction)

`map` is used to delegate control to sub-Argo instances based on a request URI path.

* `path`: a regular expression used to match the HTTP Request URI path.

* `options`: an object with a `methods` property to filter HTTP methods (e.g., `{ methods: ['GET','POST'] }`).  Optional.

* `titanSegmentFunction`: a function that is passed an instance of `argo` for additional setup.

Example:

```javascript
titan()
  .map('^/payments', function(server) {
    server
      .use(oauth)
      .target('http://backend_payment_server');
  })
```

<a name="allow"/>
### allow([options])

`allow` enables CORS support for your titan server.

NOTE: To enable CORS for any domain provide an asterisk (*) as the argument to this function.

* `options`: an object with:
  * a `methods` property to filter HTTP methods (e.g., `{ methods: ['GET','POST'] }`).
  * a `headers` property to filter when HTTP Headers are allowed to be included in the request.(e.g. `{headers: ['x-tenant-id']}`).
  * a `maxAge` property to indicate how long a preflight request can be cached. (e.g. `{maxAge: '43200'}`).
  * an `origins` property to filter which domains can access the resource (e.g. `{ origins: ['http://foo.example'] }`).  

Example:

```javascript
titan()
  .allow('*')
```

```javascript
titan()
  .allow({
    methods: ['DELETE', 'PUT', 'PATCH'],
    origins: ['http://foo.example'],
    maxAge: '432000',
    headers: ['x-tenant-id']  
  })
```

<a name="compress"/>
### compress()

`compress` enables gzip compression for your titan server.

Example:

```javascript
titan()
  .compress()
```

<a name="logger"/>
### logger()

`logger` turns on a Common Log Format logger for your titan server.

Example:

```javascript
titan()
  .logger()
```

<a name="add"/>
### add(resource, args)

`add` adds an additional argo-resource package to your titan server. See the [argo-resource](http://github.com/argo/argo-resource) repo for details on creating resources.

```javascript
var HelloResource = require('./hello_resource');

titan()
  .add(HelloResource);
```

<a name="load"/>
### load(pathToResources)

* `pathToResource`: String path to directory containing argo resource files. 

`load` loads a directory of argo-resource files without having to specifiy each one individually.  

```javascript
var HelloResource = require('./hello_resource');

titan()
  .load(path.join(__dirname, 'resources'));
```

## Issues and Contributing

Have and issue? Simply file it with github issues. This project has been stable for about a year, but issues do arise from time to time.

Want to contribute? Simply fork the project, make your changes, and file a pull request. We'll review within two to three days of receiving and provide feedback accordingly. 

## License
```
Copyright (c) 2014-2015 Apigee and Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
