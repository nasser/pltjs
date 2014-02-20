/*
 * plt.js 0.1.0
 * 
 * http://github.com/nasser/pltjs
 * 
 * Copyright (c) 2014 Ramsey Nasser
 * Licensend under the MIT license.
 */

// configuration object
// refreshes every second by default
var PLT = {
  refresh: true,
  refreshTime: 1000,

  parser: null
};

window.onload = function() {
  // inject css style to format code elements and body text
  var cssNode = document.createElement('style');
  cssNode.innerHTML = "body { font-family: sans-serif; }";
  cssNode.innerHTML += "code { display: block; white-space: pre; margin-bottom: 1em; }";
  document.body.appendChild(cssNode);

  // extract PEG grammar from <grammar> element and build parser
  var grammarElement = document.querySelector("grammar");
  PLT.parser = PEG.buildParser(grammarElement.textContent)
  grammarElement.parentNode.removeChild(grammarElement);

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
  if(PLT.refresh)
    setTimeout(function() { window.location.reload(true) }, PLT.refreshTime);
}