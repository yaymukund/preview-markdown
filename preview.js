var marked = require('marked'),
    hljs = require('highlight.js'),
    fs = require('fs'),
    path = process.argv[2],
    TEMPLATE = fs.readFileSync('./template.html', 'utf-8'),
    fsTimeout = false;

marked.setOptions({
  gfm: true,
  highlight: function(code, language) {
    return hljs.highlight(language, code).value;
  }
});

fs.watch(path, (eventType, filename) => {
  if (!fsTimeout) {
    fsTimeout = true;
    console.log(`File event: ${eventType}.`);
    fs.readFile(path, 'utf-8', function(err, data) {
      if (err) throw err;
  
      var html = TEMPLATE.replace('CONTENT', marked(data)),
          htmlFilename = path.replace('^.*[\\\/]', '')
                             .replace(/\.(md|markdown)$/i, '.html');
  
      fs.writeFile(htmlFilename, html, function(err) {
        if (err) throw err;
        console.log(`Created ${htmlFilename}`);
      });
    });
    //debounce for Windows file changes
    fsTimeout = setTimeout(() => { fsTimeout = false }, 250);
  }
});