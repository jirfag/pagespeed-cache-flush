Pagespeed-cache-flush
=====================

This utility flushes [Nginx Page Speed] and [Nginx proxy] caches, when source files are changed.
The utility watches for all source files and flushes cache, if detects, that some file changed.

Usage
-----
For example, to watch for all [Django] files, use this command (quotes are important!):
```sh
$ sudo nodejs watcher.js "./django/**/*.+(js|html|css|py)" /var/ngx_pagespeed_cache /var/lib/nginx/proxy_caches/myproject
```
When some file from watched files set changes, utility says about it:
```sh
Detected change of file "./django/templates/common/features.html"
Flushing cache: rm -rf /var/ngx_pagespeed_cache/* /var/lib/nginx/proxy_caches/myproject/* && touch /var/ngx_pagespeed_cache/cache.flush
```
and flushes the cache.

You can omit proxy cache path to clear only Nginx Page Speed cache:
```sh
$ sudo nodejs watcher.js "./django/**/*.+(js|html|css|py)" /var/ngx_pagespeed_cache
```

Utility has protection from removing system paths:
```sh
$ sudo nodejs watcher.js "./django/**/*.+(js|html|css|py)" /
Cache path should contain at least 2 '/' character (to prevent 'rm -rf /usr')
$ sudo nodejs watcher.js "./django/**/*.+(js|html|css|py)" /usr//
Cache path should contain at least 2 '/' character (to prevent 'rm -rf /usr')
```

[Nginx Page Speed]:https://github.com/pagespeed/ngx_pagespeed
[Nginx proxy]:http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache
[Django]:https://www.djangoproject.com/

License
----

GNU GPL v2
