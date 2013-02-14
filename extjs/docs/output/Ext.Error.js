Ext.data.JsonP.Ext_Error({"mixins":[],"code_type":"***REMOVED***ignment","inheritable":false,"component":false,"meta":{"author":["Brian Moeskau <brian@sencha.com>"],"docauthor":["Brian Moeskau <brian@sencha.com>"]},"mixedInto":[],"uses":[],"aliases":{},"parentMixins":[],"supercl***REMOVED***es":["Error"],"members":{"event":[],"property":[],"css_var":[],"method":[{"meta":{},"owner":"Ext.Error","tagname":"method","name":"constructor","id":"method-constructor"},{"meta":{},"owner":"Ext.Error","tagname":"method","name":"toString","id":"method-toString"}],"css_mixin":[],"cfg":[]},"tagname":"cl***REMOVED***","extends":"Error","html":"<div><pre cl***REMOVED***=\"hierarchy\"><h4>Hierarchy</h4><div cl***REMOVED***='subcl***REMOVED*** first-child'>Error<div cl***REMOVED***='subcl***REMOVED*** '><strong>Ext.Error</strong></div></div><h4>Files</h4><div cl***REMOVED***='dependency'><a href='source/Error.html#Ext-Error' target='_blank'>Error.js</a></div></pre><div cl***REMOVED***='doc-contents'><p>A wrapper cl***REMOVED*** for the native JavaScript Error object that adds a few useful capabilities for handling\nerrors in an Ext application. When you use <a href=\"#!/api/Ext.Error\" rel=\"Ext.Error\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error</a> to <a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">raise</a> an error from within any cl***REMOVED*** that\nuses the Ext 4 cl***REMOVED*** system, the Error cl***REMOVED*** can automatically add the source cl***REMOVED*** and method from which\nthe error was raised. It also includes logic to automatically log the eroor to the console, if available,\nwith additional metadata about the error. In all cases, the error will always be thrown at the end so that\nexecution will halt.</p>\n\n<p><a href=\"#!/api/Ext.Error\" rel=\"Ext.Error\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error</a> also offers a global error <a href=\"#!/api/Ext.Error-static-method-handle\" rel=\"Ext.Error-static-method-handle\" cl***REMOVED***=\"docCl***REMOVED***\">handling</a> method that can be overridden in order to\nhandle application-wide errors in a single spot. You can optionally <a href=\"#!/api/Ext.Error-static-property-ignore\" rel=\"Ext.Error-static-property-ignore\" cl***REMOVED***=\"docCl***REMOVED***\">ignore</a> errors altogether,\nalthough in a real application it's usually a better idea to override the handling function and perform\nlogging or some other method of reporting the errors in a way that is meaningful to the application.</p>\n\n<p>At its simplest you can simply raise an error as a simple string from within any code:</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.raise</a>('Something bad happened!');\n</code></pre>\n\n<p>If raised from plain JavaScript code, the error will be logged to the console (if available) and the message\ndisplayed. In most cases however you'll be raising errors from within a cl***REMOVED***, and it may often be useful to add\nadditional metadata about the error being raised.  The <a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">raise</a> method can also take a config object.\nIn this form the <code>msg</code> attribute becomes the error description, and any other data added to the config gets\nadded to the error object and, if the console is available, logged to the console for inspection.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('Ext.Foo', {\n    doSomething: function(option){\n        if (someCondition === false) {\n            <a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.raise</a>({\n                msg: 'You cannot do that!',\n                option: option,   // whatever was p***REMOVED***ed into the method\n                'error code': 100 // other arbitrary info\n            });\n        }\n    }\n});\n</code></pre>\n\n<p>If a console is available (that supports the <code>console.dir</code> function) you'll see console output like:</p>\n\n<pre><code>An error was raised with the following data:\noption:         Object { foo: \"bar\"}\n    foo:        \"bar\"\nerror code:     100\nmsg:            \"You cannot do that!\"\nsourceCl***REMOVED***:   \"Ext.Foo\"\nsourceMethod:  \"doSomething\"\n\nuncaught exception: You cannot do that!\n</code></pre>\n\n<p>As you can see, the error will report exactly where it was raised and will include as much information as the\nraising code can usefully provide.</p>\n\n<p>If you want to handle all application errors globally you can simply override the static <a href=\"#!/api/Ext.Error-static-method-handle\" rel=\"Ext.Error-static-method-handle\" cl***REMOVED***=\"docCl***REMOVED***\">handle</a> method\nand provide whatever handling logic you need. If the method returns true then the error is considered handled\nand will not be thrown to the browser. If anything but true is returned then the error will be thrown normally.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-method-handle\" rel=\"Ext.Error-static-method-handle\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.handle</a> = function(err) {\n    if (err.someProperty == 'NotReallyAnError') {\n        // maybe log something to the application here if applicable\n        return true;\n    }\n    // any non-true return value (including none) will cause the error to be thrown\n}\n</code></pre>\n</div><div cl***REMOVED***='members'><div cl***REMOVED***='members-section'><h3 cl***REMOVED***='members-title icon-property'>Properties</h3><div cl***REMOVED***='subsection'><div cl***REMOVED***='definedBy'>Defined By</div><h4 cl***REMOVED***='members-subtitle'>Static Properties</h3><div id='static-property-ignore' cl***REMOVED***='member first-child not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-static-property-ignore' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Error-static-property-ignore' cl***REMOVED***='name expandable'>ignore</a><span> : <a href=\"#!/api/Boolean\" rel=\"Boolean\" cl***REMOVED***=\"docCl***REMOVED***\">Boolean</a></span><strong cl***REMOVED***='static signature'>static</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Static flag that can be used to globally disable error reporting to the browser if set to true\n(defaults to false). ...</div><div cl***REMOVED***='long'><p>Static flag that can be used to globally disable error reporting to the browser if set to true\n(defaults to false). Note that if you ignore Ext errors it's likely that some other code may fail\nand throw a native JavaScript error thereafter, so use with caution. In most cases it will probably\nbe preferable to supply a custom error <a href=\"#!/api/Ext.Error-static-method-handle\" rel=\"Ext.Error-static-method-handle\" cl***REMOVED***=\"docCl***REMOVED***\">handling</a> function instead.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-property-ignore\" rel=\"Ext.Error-static-property-ignore\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.ignore</a> = true;\n</code></pre>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='static-property-notify' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-static-property-notify' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Error-static-property-notify' cl***REMOVED***='name expandable'>notify</a><span> : <a href=\"#!/api/Boolean\" rel=\"Boolean\" cl***REMOVED***=\"docCl***REMOVED***\">Boolean</a></span><strong cl***REMOVED***='static signature'>static</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Static flag that can be used to globally control error notification to the user. ...</div><div cl***REMOVED***='long'><p>Static flag that can be used to globally control error notification to the user. Unlike\nEx.Error.ignore, this does not effect exceptions. They are still thrown. This value can be\nset to false to disable the alert notification (default is true for IE6 and IE7).</p>\n\n<p>Only the first error will generate an alert. Internally this flag is set to false when the\nfirst error occurs prior to displaying the alert.</p>\n\n<p>This flag is not used in a release build.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-property-notify\" rel=\"Ext.Error-static-property-notify\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.notify</a> = false;\n</code></pre>\n</div></div></div></div></div><div cl***REMOVED***='members-section'><h3 cl***REMOVED***='members-title icon-method'>Methods</h3><div cl***REMOVED***='subsection'><div cl***REMOVED***='definedBy'>Defined By</div><h4 cl***REMOVED***='members-subtitle'>Instance Methods</h3><div id='method-constructor' cl***REMOVED***='member first-child not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-method-constructor' target='_blank' cl***REMOVED***='view-source'>view source</a></div><strong cl***REMOVED***='new-keyword'>new</strong><a href='#!/api/Ext.Error-method-constructor' cl***REMOVED***='name expandable'>Ext.Error</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a>/<a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Creates new Error object. ...</div><div cl***REMOVED***='long'><p>Creates new Error object.</p>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a>/<a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'><p>The error message string, or an object containing the\nattribute \"msg\" that will be used as the error message. Any other data included in\nthe object will be applied to the error instance and logged to the browser console, if available.</p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toString' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-method-toString' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Error-method-toString' cl***REMOVED***='name expandable'>toString</a>( <span cl***REMOVED***='pre'></span> ) : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Provides a custom string representation of the error object. ...</div><div cl***REMOVED***='long'><p>Provides a custom string representation of the error object. This is an override of the base JavaScript\n<code><a href=\"#!/api/Object-method-toString\" rel=\"Object-method-toString\" cl***REMOVED***=\"docCl***REMOVED***\">Object.toString</a></code> method, which is useful so that when logged to the browser console, an error object will\nbe displayed with a useful message instead of <code>[object Object]</code>, the default <code>toString</code> result.</p>\n\n<p>The default implementation will include the error message along with the raising cl***REMOVED*** and method, if available,\nbut this can be overridden with a custom implementation either at the prototype level (for all errors) or on\na particular error instance, if you want to provide a custom description that will show up in the console.</p>\n<h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></span><div cl***REMOVED***='sub-desc'><p>The error message. If raised from within the Ext 4 cl***REMOVED*** system, the error message will also\ninclude the raising cl***REMOVED*** and method names, if available.</p>\n</div></li></ul></div></div></div></div><div cl***REMOVED***='subsection'><div cl***REMOVED***='definedBy'>Defined By</div><h4 cl***REMOVED***='members-subtitle'>Static Methods</h3><div id='static-method-handle' cl***REMOVED***='member first-child not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-static-method-handle' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Error-static-method-handle' cl***REMOVED***='name expandable'>handle</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Ext.Error\" rel=\"Ext.Error\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error</a> err</span> )<strong cl***REMOVED***='static signature'>static</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Globally handle any Ext errors that may be raised, optionally providing custom logic to\nhandle different errors indiv...</div><div cl***REMOVED***='long'><p>Globally handle any Ext errors that may be raised, optionally providing custom logic to\nhandle different errors individually. Return true from the function to byp***REMOVED*** throwing the\nerror to the browser, otherwise the error will be thrown and execution will halt.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-method-handle\" rel=\"Ext.Error-static-method-handle\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.handle</a> = function(err) {\n    if (err.someProperty == 'NotReallyAnError') {\n        // maybe log something to the application here if applicable\n        return true;\n    }\n    // any non-true return value (including none) will cause the error to be thrown\n}\n</code></pre>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>err</span> : <a href=\"#!/api/Ext.Error\" rel=\"Ext.Error\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error</a><div cl***REMOVED***='sub-desc'><p>The <a href=\"#!/api/Ext.Error\" rel=\"Ext.Error\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error</a> object being raised. It will contain any attributes that were originally\nraised with it, plus properties about the method and cl***REMOVED*** from which the error originated (if raised from a\ncl***REMOVED*** that uses the Ext 4 cl***REMOVED*** system).</p>\n</div></li></ul></div></div></div><div id='static-method-raise' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.Error'>Ext.Error</span><br/><a href='source/Error.html#Ext-Error-static-method-raise' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Error-static-method-raise' cl***REMOVED***='name expandable'>raise</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a>/<a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> err</span> )<strong cl***REMOVED***='static signature'>static</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Raise an error that can include additional data and supports automatic console logging if available. ...</div><div cl***REMOVED***='long'><p>Raise an error that can include additional data and supports automatic console logging if available.\nYou can p***REMOVED*** a string error message or an object with the <code>msg</code> attribute which will be used as the\nerror message. The object can contain any other name-value attributes (or objects) to be logged\nalong with the error.</p>\n\n<p>Note that after displaying the error message a JavaScript error will ultimately be thrown so that\nexecution will halt.</p>\n\n<p>Example usage:</p>\n\n<pre><code><a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.raise</a>('A simple string error message');\n\n// or...\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('Ext.Foo', {\n    doSomething: function(option){\n        if (someCondition === false) {\n            <a href=\"#!/api/Ext.Error-static-method-raise\" rel=\"Ext.Error-static-method-raise\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Error.raise</a>({\n                msg: 'You cannot do that!',\n                option: option,   // whatever was p***REMOVED***ed into the method\n                'error code': 100 // other arbitrary info\n            });\n        }\n    }\n});\n</code></pre>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>err</span> : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a>/<a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'><p>The error message string, or an object containing the attribute \"msg\" that will be\nused as the error message. Any other data included in the object will also be logged to the browser console,\nif available.</p>\n</div></li></ul></div></div></div></div></div></div></div>","subcl***REMOVED***es":[],"name":"Ext.Error","alternateCl***REMOVED***Names":[],"inheritdoc":null,"files":[{"href":"Error.html#Ext-Error","filename":"Error.js"}],"html_meta":{"author":null,"docauthor":null},"singleton":false,"id":"cl***REMOVED***-Ext.Error","statics":{"property":[{"meta":{"static":true},"owner":"Ext.Error","tagname":"property","name":"ignore","id":"static-property-ignore"},{"meta":{"static":true},"owner":"Ext.Error","tagname":"property","name":"notify","id":"static-property-notify"}],"event":[],"css_var":[],"method":[{"meta":{"static":true},"owner":"Ext.Error","tagname":"method","name":"handle","id":"static-method-handle"},{"meta":{"static":true},"owner":"Ext.Error","tagname":"method","name":"raise","id":"static-method-raise"}],"css_mixin":[],"cfg":[]},"requires":[]});