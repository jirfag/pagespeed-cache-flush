var chokidar = require('chokidar');
var glob = require("glob");
var exec = require('child_process').exec;
var util = require('util');

function flush_cache_for_path(path, pagespeed_cache_path, proxy_cache_path) {
    var cmd = util.format('rm -rf %s/* %s%s && touch %s/cache.flush',
                          pagespeed_cache_path,
                          proxy_cache_path ? proxy_cache_path : "", proxy_cache_path ? "/*" : "",
                          pagespeed_cache_path);
    console.log('Flushing cache: %s', cmd);
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error('cant flush cache for path "%s": %s', path, err);
            process.exit(-1);
        }
    });
}

function main() {
    var args_n = process.argv.length;
    if (args_n != 4 && args_n != 5) {
        console.error('Usage: %s "glob_pattern" /path/to/page-speed/cache [/path/to/proxy/cache]', process.argv[1]);
        console.error('Example: %s "**/*.+(js|html|css|py)" /var/ngx_pagespeed_cache /var/lib/nginx/proxy_caches/myproject', process.argv[1]);
        process.exit(-1);
    }

    var pattern = process.argv[2];
    var pagespeed_cache_path = process.argv[3].replace(/\/+$/g, "");
    var proxy_cache_path = process.argv.length == 5 ? process.argv[4].replace(/\/+$/g, "") : null;
    if ((pagespeed_cache_path.match(/\//g)||[]).length < 2 || (proxy_cache_path && (proxy_cache_path.match(/\//g)||[]).length < 2)) {
        console.error("Cache path should contain at least 2 '/' character (to prevent 'rm -rf /usr')");
        process.exit(-1);
    }

    console.log('Looking for files, mathing pattern "%s"', pattern);
    glob(pattern, function(err, files) {
        if (err) {
            console.error('Cant find requested files: %s', err);
            process.exit(-1);
        }

        console.log('Watching for %d files', files.length);
        var watcher = chokidar.watch(files, {persistent:true});
        watcher
            .on('change', function(path) {
                console.log('Detected change of file "%s"', path);
                flush_cache_for_path(path, pagespeed_cache_path, proxy_cache_path);
            })
            .on('error', function(err) {
                console.error('Error occured: %s', err);
                process.exit(-1);
            });
    });
}

main();
