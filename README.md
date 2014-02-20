plt.js
======
A programming language design prototyping tool

Overview
--------

plt.js is an environment for writing and testing programming language grammars. You write your language's grammar and example code in an HTMLish syntax, and plt.js will attempt to parse your code against your grammar and display the result.

It looks like this:

```html
<grammar>
  start       = '(' '+' space a:number ' ' b:number space ')' { return a + b }
  number      = d:digit+ { return parseInt( d.join('') ) }
  digit       = [0123456789]
  space       = ' '*
</grammar>

<h3>Addition</h3>
<code>(+ 5 10)</code>
<code>(+7 13)</code>
<code>(+ 7 13)</code>
```

Which would output

```
Addition

(+ 5 10)
↳ 15
(+7 13)
↳ 20
(+ 7 13)
↳ 20
```

Try it. It's great fun.

Usage
-----
1. Download and extract [plt.js](https://github.com/nasser/pltjs/archive/master.zip)
2. Copy `index.html` to `your-language.html`
3. Open `your-language.html` in a browser
4. Replace the `<title>` tag with the name of your language
5. Replace the `<grammar>` tag with the PEG grammar of your language
6. Write examples of correct syntax in `<code>` tags. plt.js will parse them and display the result.
7. Write examples of incorrect syntax in `<code bad>` tags. plt.js will parse them and display the result.
8. Write any other HTML to annotate your examples.

The file is set to automatically refresh every second, so any changes you make to the grammar or examples will be visible immediatley. This allows you to fluidly sketch your language and try out ideas at your leisure.

The only constraint is that your `your-language.html` file must be in the same folder as the `js/` folder where plt.js keeps its files.

Name
----
PLT is short for [Programming Language Theory](http://en.wikipedia.org/wiki/Programming_language_theory), the branch of computer science that deals with the design and implementation of programming languages.

Acknowledgments
---------------
plt.js comes out of my time as an [Eyebeam](http://eyebeam.org) Fellow exploring code as a medium of self expression.

Legal
-----
Copyright © 2014 Ramsey Nasser. Released under the MIT License.

[PEG.js](http://pegjs.majda.cz/) Copyright © 2010–2013 David Majda

[Sugar.js](http://sugarjs.com/) Copyright © 2011 Andrew Plummer