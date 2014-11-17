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
  cssNode.innerHTML += "#repl { height: 1em; }";
  cssNode.innerHTML += "#repl .error { color: red; }";
  cssNode.innerHTML += "#repl pre { background: #eee; padding: 5px; }";
  cssNode.innerHTML += "textarea { opacity:0 }";
  cssNode.innerHTML += ".jqconsole-cursor { background: gray; }";
  document.body.appendChild(cssNode);

  // extract PEG grammar from <grammar> element and build parser
  var grammarElement = $("grammar");
  PLT.parser = PEG.buildParser(grammarElement.text())
  grammarElement.remove();

  var stringifiedParse = function(source) {
    return JSON.stringify(PLT.parser.parse(source));
  }

  // build repl object
  $('<div id="repl">').
    appendTo("body");
  var repl = $("#repl").jqconsole("", '> ');
  $("#repl div").attr('style', '');

  var startPrompt = function () {
    repl.Prompt(true, function (input) {
      try {
        var evalfn = PLT.repl || stringifiedParse;
        repl.Write(evalfn(input) + '\n', 'jqconsole-output');
      } catch(err) {
        repl.Write(err.message + "\n", 'error');
      }
      startPrompt();

      // scroll to the repl when on new line
      repl.$console.get(0).scrollIntoView();
    });
  }
  startPrompt();

  // scroll to the repl when a key is pressed
  repl.$input_source.keypress(function() { repl.$console.get(0).scrollIntoView(); });

  // focus the repl by default
  repl.Focus();

  $('<h2>' + $('title').text() + '</h2>').
    prependTo("body");

  // collect all correct code examples and try and parse them
  var goods = document.querySelectorAll("code:not([bad])")
  for (var i = 0; i < goods.length; i++) {
    try {
      var str = stringifiedParse(goods[i].textContent);

      // Look for expected attribute like this: <code expected="true">
      if(goods[i].attributes.getNamedItem('expect')){
        var expectedValue = goods[i].attributes.getNamedItem('expect').value;

        // Create a regEx from the expectedValue
        var re = new RegExp(expectedValue, "");

        // Validate that the expected value matches the returned value
        if(!str.match(re)){
          var error = new Error('Expected '+expectedValue+" but got "+str)
          error.line = 0;
          throw error; 
        }
      }
      // the code parsed, append result in grey
      goods[i].innerHTML += "\n<em style='color:gray'>&#8627; " + str + "</em>";

    } catch (err) {
      // the code did not parse, append result in red
      
      // Add carrot to show the position of the error
      var carrot = '';
      if(err.line == goods[i].textContent.split('\n').length){
        carrot = Array(err.column).join(' ')+'&uarr;\n'
      }

      // If there is line info, add information about where the error is
      var lineError = '';
      if(err.line){
        lineError = "<br>\t" + "Line " + err.line + " Column " + err.column;
      }

      goods[i].innerHTML += "\n<span style='color:red;'>" + carrot + " " + err.message + lineError + "</em>";
    }
  }

  // collect all incorrect code examples and try and parse them
  var bads = document.querySelectorAll("code[bad]")
  for (var i = 0; i < bads.length; i++) {
    try {
      var str = stringifiedParse(goods[i].textContent);
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
