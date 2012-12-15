var marked = require('marked'),
    hljs = require('highlight.js'),
    fs = require('fs'),
    path = process.argv[2],
    TEMPLATE = fs.readFileSync('./template.html', 'utf-8');

marked.setOptions({
  gfm: true,
  highlight: function(code, language) {
    return hljs.highlight(language, code).value;
  }
});

var createMarkdownFile = function(path) {
  fs.readFile(path, 'utf-8', function(err, data) {
    if (err) throw err;

    var html = TEMPLATE.replace('CONTENT', marked(data)),
        htmlFilename = path.replace('^.*[\\\/]', '')
                           .replace(/\.(md|markdown)$/i, '.html');

    fs.writeFile(htmlFilename, html, function(err) {
      if (err) throw err;
      console.log('Created ' + htmlFilename);
    });
  });
};

setInterval(function() { createMarkdownFile(path); }, 2000);
