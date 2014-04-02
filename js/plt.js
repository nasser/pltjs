/*
 * plt.js 0.2.0
 *
 * http://github.com/nasser/pltjs
 *
 * Copyright (c) 2014 Ramsey Nasser
 * Licensend under the MIT license.
 */

// configuration object
// refreshes every second by default
var PLT = {
  refresh: false,
  refreshTime: 1000,

  parser: null
};

$(function() {
  // inject css style to format code elements and body text
  var cssNode = document.createElement('style');
  cssNode.innerHTML = "body { font-family: sans-serif; }";
  cssNode.innerHTML += "code { display: block; white-space: pre; margin-bottom: 1em; }";
  cssNode.innerHTML += "#repl { height: 50px; }";
  cssNode.innerHTML += "textarea { opacity:0 }";
  cssNode.innerHTML += ".jqconsole-cursor { background: gray; }";
  document.body.appendChild(cssNode);

  // extract PEG grammar from <grammar> element and build parser
  var grammarElement = $("grammar");
  PLT.parser = PEG.buildParser(grammarElement.text())
  grammarElement.remove();

  // build repl object
  $('<div id="repl">').
    appendTo("body");
  var repl = $("#repl").jqconsole("", '> ');
  $("#repl div").attr('style', '');

  var startPrompt = function () {
    repl.Prompt(true, function (input) {
      try {
        var evalfn = PLT.repl || PLT.eval || PLT.parser.parse;
        repl.Write(PLT.parser.parse(input) + '\n', 'jqconsole-output');
      } catch(err) {
        repl.Append($("<span>" + err.message + "</span>").css('color', 'red'))
        repl.Write("\n");
      }
      startPrompt();
    });
  }
  startPrompt();

  $('<h2>' + $('title').text() + '</h2>').
    prependTo("body");

  // collect all correct code examples and try and parse them
  var goods = document.querySelectorAll("code:not([bad])")
  for (var i = 0; i < goods.length; i++) {
    try {
      var ast = PLT.parser.parse(goods[i].textContent);
      var str = ast.toString ? ast.toString() : JSON.stringify(ast);
      // the code parsed, append result in grey
      goods[i].innerHTML += "\n<em style='color:gray'>&#8627; " + str + "</em>";

    } catch (err) {
      // the code did not parse, append result in red
      goods[i].innerHTML += "\n<em style='color:red;'>&#8627; " + err.message + "</em>";

    }
  }

  // collect all incorrect code examples and try and parse them
  var bads = document.querySelectorAll("code[bad]")
  for (var i = 0; i < bads.length; i++) {
    try {
      var ast = PLT.parser.parse(bads[i].textContent);
      var str = ast.toString ? ast.toString() : JSON.stringify(ast);
      // the code parsed, append result in red
      bads[i].innerHTML += "\n<em style='color:red;'>&#8627; " + str + "</em>";

    } catch (err) {
      // the code did not parse, append result in gray
      bads[i].innerHTML += "\n<em style='color:gray'>&#8627; " + err.message + "</em>";

    }
  }

  // refresh the page if refreshing is enabled
  setInterval(function() { if(PLT.refresh) window.location.reload(true) }, PLT.refreshTime);
});
