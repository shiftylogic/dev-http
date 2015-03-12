#!/usr/bin/env node

/*

The MIT License (MIT)

Copyright (c) 2015 Robert Anderson.

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

*/

'use strict';

var express = require('express'),
    serveStatic = require('serve-static'),

    app = express(),
    port = process.env.PORT || 9000,
    options = {
        dotfiles: 'deny',
        index: ['index.html', 'index.htm', 'main.html', 'main.htm']
    },

    anchoredPaths = process.argv.slice(2).map(function (path) {
        var parts = path.split(':'),
            anchor = parts[0],
            servedPath = parts[1];

        if (!servedPath) {
            console.log('  >> Anchoring [%s] to [/]', anchor);
            return {
                anchor: '/',
                fn: serveStatic(anchor, options)
            };
        } else {
            console.log('  >> Anchoring [%s] to [/%s]', servedPath, anchor);
            return {
                anchor: '/' + anchor,
                fn: serveStatic(servedPath, options)
            };
        }
    });

app.use(function (req, res, next) {
    console.log('Serving: ', req.url);
    next();
});

anchoredPaths.forEach(function (x) {
    app.use(x.anchor, x.fn);
});

app.use(function (req, res, next) {
    console.log('  => 404: Resource not found (%s).', req.url);
    next();
});

app.listen(port, function () {
    console.log('Server running on port', port);
});
