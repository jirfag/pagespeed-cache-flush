Pagespeed-cache-flush
=====================

This utility flushes [Nginx Page Speed] and [Nginx proxy] caches, when source files are changed.
The utility watches for all source files and flushes cache, if detects, that some file changed.

Usage
-----
For example, to watch for all [Django] files, use this command (quotes are important!):
```sh
$ nodejs watcher.js "./django/**/*.+(js|html|css|py)"
```
When some file from watched files set changes, utility says about it:
```sh
Detected change of file "./django/templates/common/features.html"
```
and flushes the cache.

[Nginx Page Speed]:https://github.com/pagespeed/ngx_pagespeed
[Nginx proxy]:http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache
[Django]:https://www.djangoproject.com/

License
----

GNU GPL v2
