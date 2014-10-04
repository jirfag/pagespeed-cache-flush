var chokidar = require('chokidar');
var glob = require("glob");
var exec = require('child_process').exec;

function flush_cache_for_path(path) {
    var cmd = 'sudo rm -rf /var/lib/nginx/proxy_caches/jiffyload/* /var/ngx_pagespeed_cache/* && sudo touch /var/ngx_pagespeed_cache/cache.flush';
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error('cant flush cache for path "%s": %s', path, err);
            process.exit(-1);
        }
    });
}

function main() {
    var args_n = process.argv.length;
    if (args_n != 3) {
        console.error('Usage: %s "glob_pattern"', process.argv[1]);
        console.error('Example: %s "**/*.+(js|html|css|py)"', process.argv[1]);
        process.exit(-1);
    }
    var pattern = process.argv[2];
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
                flush_cache_for_path(path);
            })
            .on('error', function(err) {
                console.error('Error occured: %s', err);
                process.exit(-1);
            });
    });
}

main();
