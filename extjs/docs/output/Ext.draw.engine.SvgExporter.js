Ext.data.JsonP.Ext_draw_engine_SvgExporter({"mixins":[],"code_type":"ext_define","inheritable":false,"component":false,"meta":{},"mixedInto":[],"uses":[],"aliases":{},"parentMixins":[],"supercl***REMOVED***es":["Ext.Base"],"members":{"event":[],"property":[{"meta":{"private":true},"owner":"Ext.Base","tagname":"property","name":"$cl***REMOVED***Name","id":"property-S-cl***REMOVED***Name"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"property","name":"configMap","id":"property-configMap"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"property","name":"initConfigList","id":"property-initConfigList"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"property","name":"initConfigMap","id":"property-initConfigMap"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"property","name":"isInstance","id":"property-isInstance"},{"meta":{"protected":true},"owner":"Ext.Base","tagname":"property","name":"self","id":"property-self"}],"css_var":[],"method":[{"meta":{"deprecated":{"text":"as of 4.1. Use {@link #callParent} instead."},"protected":true},"owner":"Ext.Base","tagname":"method","name":"callOverridden","id":"method-callOverridden"},{"meta":{"protected":true},"owner":"Ext.Base","tagname":"method","name":"callParent","id":"method-callParent"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"configCl***REMOVED***","id":"method-configCl***REMOVED***"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"destroy","id":"method-destroy"},{"meta":{},"owner":"Ext.draw.engine.SvgExporter","tagname":"method","name":"generate","id":"method-generate"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"getConfig","id":"method-getConfig"},{"meta":{},"owner":"Ext.Base","tagname":"method","name":"getInitialConfig","id":"method-getInitialConfig"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"hasConfig","id":"method-hasConfig"},{"meta":{"protected":true},"owner":"Ext.Base","tagname":"method","name":"initConfig","id":"method-initConfig"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"onConfigUpdate","id":"method-onConfigUpdate"},{"meta":{"private":true},"owner":"Ext.Base","tagname":"method","name":"setConfig","id":"method-setConfig"},{"meta":{"protected":true},"owner":"Ext.Base","tagname":"method","name":"statics","id":"method-statics"}],"css_mixin":[],"cfg":[]},"tagname":"cl***REMOVED***","extends":"Ext.Base","html":"<div><pre cl***REMOVED***=\"hierarchy\"><h4>Hierarchy</h4><div cl***REMOVED***='subcl***REMOVED*** first-child'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='docCl***REMOVED***'>Ext.Base</a><div cl***REMOVED***='subcl***REMOVED*** '><strong>Ext.draw.engine.SvgExporter</strong></div></div><h4>Files</h4><div cl***REMOVED***='dependency'><a href='source/SvgExporter.html#Ext-draw-engine-SvgExporter' target='_blank'>SvgExporter.js</a></div></pre><div cl***REMOVED***='doc-contents'><p>A utility cl***REMOVED*** for exporting a <a href=\"#!/api/Ext.draw.Surface\" rel=\"Ext.draw.Surface\" cl***REMOVED***=\"docCl***REMOVED***\">Surface</a> to a string\nthat may be saved or used for processing on the server.</p>\n</div><div cl***REMOVED***='members'><div cl***REMOVED***='members-section'><div cl***REMOVED***='definedBy'>Defined By</div><h3 cl***REMOVED***='members-title icon-property'>Properties</h3><div cl***REMOVED***='subsection'><div id='property-S-cl***REMOVED***Name' cl***REMOVED***='member first-child inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-S-cl***REMOVED***Name' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-S-cl***REMOVED***Name' cl***REMOVED***='name expandable'>$cl***REMOVED***Name</a><span> : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></span><strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Defaults to: <code>&quot;Ext.Base&quot;</code></p></div></div></div><div id='property-configMap' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-configMap' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-configMap' cl***REMOVED***='name expandable'>configMap</a><span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-initConfigList' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-initConfigList' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-initConfigList' cl***REMOVED***='name expandable'>initConfigList</a><span> : <a href=\"#!/api/Array\" rel=\"Array\" cl***REMOVED***=\"docCl***REMOVED***\">Array</a></span><strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Defaults to: <code>[]</code></p></div></div></div><div id='property-initConfigMap' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-initConfigMap' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-initConfigMap' cl***REMOVED***='name expandable'>initConfigMap</a><span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Defaults to: <code>{}</code></p></div></div></div><div id='property-isInstance' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-isInstance' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-isInstance' cl***REMOVED***='name expandable'>isInstance</a><span> : <a href=\"#!/api/Boolean\" rel=\"Boolean\" cl***REMOVED***=\"docCl***REMOVED***\">Boolean</a></span><strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Defaults to: <code>true</code></p></div></div></div><div id='property-self' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-property-self' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-property-self' cl***REMOVED***='name expandable'>self</a><span> : <a href=\"#!/api/Ext.Cl***REMOVED***\" rel=\"Ext.Cl***REMOVED***\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Cl***REMOVED***</a></span><strong cl***REMOVED***='protected signature'>protected</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Get the reference to the current cl***REMOVED*** from which this object was instantiated. ...</div><div cl***REMOVED***='long'><p>Get the reference to the current cl***REMOVED*** from which this object was instantiated. Unlike <a href=\"#!/api/Ext.Base-method-statics\" rel=\"Ext.Base-method-statics\" cl***REMOVED***=\"docCl***REMOVED***\">statics</a>,\n<code>this.self</code> is scope-dependent and it's meant to be used for dynamic inheritance. See <a href=\"#!/api/Ext.Base-method-statics\" rel=\"Ext.Base-method-statics\" cl***REMOVED***=\"docCl***REMOVED***\">statics</a>\nfor a detailed comparison</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Cat', {\n    statics: {\n        speciesName: 'Cat' // My.Cat.speciesName = 'Cat'\n    },\n\n    constructor: function() {\n        alert(this.self.speciesName); // dependent on 'this'\n    },\n\n    clone: function() {\n        return new this.self();\n    }\n});\n\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.SnowLeopard', {\n    extend: 'My.Cat',\n    statics: {\n        speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'\n    }\n});\n\nvar cat = new My.Cat();                     // alerts 'Cat'\nvar snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'\n\nvar clone = snowLeopard.clone();\nalert(<a href=\"#!/api/Ext-method-getCl***REMOVED***Name\" rel=\"Ext-method-getCl***REMOVED***Name\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.getCl***REMOVED***Name</a>(clone));             // alerts 'My.SnowLeopard'\n</code></pre>\n</div></div></div></div></div><div cl***REMOVED***='members-section'><div cl***REMOVED***='definedBy'>Defined By</div><h3 cl***REMOVED***='members-title icon-method'>Methods</h3><div cl***REMOVED***='subsection'><div id='method-callOverridden' cl***REMOVED***='member first-child inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-callOverridden' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-callOverridden' cl***REMOVED***='name expandable'>callOverridden</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Array\" rel=\"Array\" cl***REMOVED***=\"docCl***REMOVED***\">Array</a>/Arguments args</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><strong cl***REMOVED***='deprecated signature'>deprecated</strong><strong cl***REMOVED***='protected signature'>protected</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Call the original method that was previously overridden with override\n\nExt.define('My.Cat', {\n    constructor: functi...</div><div cl***REMOVED***='long'><p>Call the original method that was previously overridden with <a href=\"#!/api/Ext.Base-static-method-override\" rel=\"Ext.Base-static-method-override\" cl***REMOVED***=\"docCl***REMOVED***\">override</a></p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Cat', {\n    constructor: function() {\n        alert(\"I'm a cat!\");\n    }\n});\n\nMy.Cat.override({\n    constructor: function() {\n        alert(\"I'm going to be a cat!\");\n\n        this.callOverridden();\n\n        alert(\"Meeeeoooowwww\");\n    }\n});\n\nvar kitty = new My.Cat(); // alerts \"I'm going to be a cat!\"\n                          // alerts \"I'm a cat!\"\n                          // alerts \"Meeeeoooowwww\"\n</code></pre>\n        <div cl***REMOVED***='signature-box deprecated'>\n        <p>This method has been <strong>deprecated</strong> </p>\n        <p>as of 4.1. Use <a href=\"#!/api/Ext.Base-method-callParent\" rel=\"Ext.Base-method-callParent\" cl***REMOVED***=\"docCl***REMOVED***\">callParent</a> instead.</p>\n\n        </div>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>args</span> : <a href=\"#!/api/Array\" rel=\"Array\" cl***REMOVED***=\"docCl***REMOVED***\">Array</a>/Arguments<div cl***REMOVED***='sub-desc'><p>The arguments, either an array or the <code>arguments</code> object\nfrom the current method, for example: <code>this.callOverridden(arguments)</code></p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><div cl***REMOVED***='sub-desc'><p>Returns the result of calling the overridden method</p>\n</div></li></ul></div></div></div><div id='method-callParent' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-callParent' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-callParent' cl***REMOVED***='name expandable'>callParent</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Array\" rel=\"Array\" cl***REMOVED***=\"docCl***REMOVED***\">Array</a>/Arguments args</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><strong cl***REMOVED***='protected signature'>protected</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Call the \"parent\" method of the current method. ...</div><div cl***REMOVED***='long'><p>Call the \"parent\" method of the current method. That is the method previously\noverridden by derivation or by an override (see <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>).</p>\n\n<pre><code> <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Base', {\n     constructor: function (x) {\n         this.x = x;\n     },\n\n     statics: {\n         method: function (x) {\n             return x;\n         }\n     }\n });\n\n <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Derived', {\n     extend: 'My.Base',\n\n     constructor: function () {\n         this.callParent([21]);\n     }\n });\n\n var obj = new My.Derived();\n\n alert(obj.x);  // alerts 21\n</code></pre>\n\n<p>This can be used with an override as follows:</p>\n\n<pre><code> <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.DerivedOverride', {\n     override: 'My.Derived',\n\n     constructor: function (x) {\n         this.callParent([x*2]); // calls original My.Derived constructor\n     }\n });\n\n var obj = new My.Derived();\n\n alert(obj.x);  // now alerts 42\n</code></pre>\n\n<p>This also works with static methods.</p>\n\n<pre><code> <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Derived2', {\n     extend: 'My.Base',\n\n     statics: {\n         method: function (x) {\n             return this.callParent([x*2]); // calls My.Base.method\n         }\n     }\n });\n\n alert(My.Base.method(10);     // alerts 10\n alert(My.Derived2.method(10); // alerts 20\n</code></pre>\n\n<p>Lastly, it also works with overridden static methods.</p>\n\n<pre><code> <a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Derived2Override', {\n     override: 'My.Derived2',\n\n     statics: {\n         method: function (x) {\n             return this.callParent([x*2]); // calls My.Derived2.method\n         }\n     }\n });\n\n alert(My.Derived2.method(10); // now alerts 40\n</code></pre>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>args</span> : <a href=\"#!/api/Array\" rel=\"Array\" cl***REMOVED***=\"docCl***REMOVED***\">Array</a>/Arguments<div cl***REMOVED***='sub-desc'><p>The arguments, either an array or the <code>arguments</code> object\nfrom the current method, for example: <code>this.callParent(arguments)</code></p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><div cl***REMOVED***='sub-desc'><p>Returns the result of calling the parent method</p>\n</div></li></ul></div></div></div><div id='method-configCl***REMOVED***' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-configCl***REMOVED***' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-configCl***REMOVED***' cl***REMOVED***='name expandable'>configCl***REMOVED***</a>( <span cl***REMOVED***='pre'></span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n</div></div></div><div id='method-destroy' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-destroy' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-destroy' cl***REMOVED***='name expandable'>destroy</a>( <span cl***REMOVED***='pre'></span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<p>Overrides: <a href='#!/api/Ext.AbstractComponent-method-destroy' rel='Ext.AbstractComponent-method-destroy' cl***REMOVED***='docCl***REMOVED***'>Ext.AbstractComponent.destroy</a>, <a href='#!/api/Ext.AbstractPlugin-method-destroy' rel='Ext.AbstractPlugin-method-destroy' cl***REMOVED***='docCl***REMOVED***'>Ext.AbstractPlugin.destroy</a>, <a href='#!/api/Ext.layout.Layout-method-destroy' rel='Ext.layout.Layout-method-destroy' cl***REMOVED***='docCl***REMOVED***'>Ext.layout.Layout.destroy</a></p></div></div></div><div id='method-generate' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.draw.engine.SvgExporter'>Ext.draw.engine.SvgExporter</span><br/><a href='source/SvgExporter.html#Ext-draw-engine-SvgExporter-method-generate' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.draw.engine.SvgExporter-method-generate' cl***REMOVED***='name expandable'>generate</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Ext.draw.Surface\" rel=\"Ext.draw.Surface\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.draw.Surface</a> surface, [<a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config]</span> ) : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Exports the p***REMOVED***ed surface to a SVG string representation ...</div><div cl***REMOVED***='long'><p>Exports the p***REMOVED***ed surface to a SVG string representation</p>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>surface</span> : <a href=\"#!/api/Ext.draw.Surface\" rel=\"Ext.draw.Surface\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.draw.Surface</a><div cl***REMOVED***='sub-desc'><p>The surface to export</p>\n</div></li><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> (optional)<div cl***REMOVED***='sub-desc'><p>Any configuration for the export. Currently this is\nunused but may provide more options in the future</p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></span><div cl***REMOVED***='sub-desc'><p>The SVG as a string</p>\n</div></li></ul></div></div></div><div id='method-getConfig' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-getConfig' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-getConfig' cl***REMOVED***='name expandable'>getConfig</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> name</span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>name</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getInitialConfig' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-getInitialConfig' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-getInitialConfig' cl***REMOVED***='name expandable'>getInitialConfig</a>( <span cl***REMOVED***='pre'>[<a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a> name]</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a>/Mixed</div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Returns the initial configuration p***REMOVED***ed to constructor when instantiating\nthis cl***REMOVED***. ...</div><div cl***REMOVED***='long'><p>Returns the initial configuration p***REMOVED***ed to constructor when instantiating\nthis cl***REMOVED***.</p>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>name</span> : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a> (optional)<div cl***REMOVED***='sub-desc'><p>Name of the config option to return.</p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a>/Mixed</span><div cl***REMOVED***='sub-desc'><p>The full config object or a single config value\nwhen <code>name</code> parameter specified.</p>\n</div></li></ul></div></div></div><div id='method-hasConfig' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-hasConfig' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-hasConfig' cl***REMOVED***='name expandable'>hasConfig</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config</span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div><div id='method-initConfig' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-initConfig' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-initConfig' cl***REMOVED***='name expandable'>initConfig</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config</span> ) : <a href=\"#!/api/Ext.Base\" rel=\"Ext.Base\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Base</a><strong cl***REMOVED***='protected signature'>protected</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Initialize configuration for this cl***REMOVED***. ...</div><div cl***REMOVED***='long'><p>Initialize configuration for this cl***REMOVED***. a typical example:</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.awesome.Cl***REMOVED***', {\n    // The default config\n    config: {\n        name: 'Awesome',\n        isAwesome: true\n    },\n\n    constructor: function(config) {\n        this.initConfig(config);\n    }\n});\n\nvar awesome = new My.awesome.Cl***REMOVED***({\n    name: 'Super Awesome'\n});\n\nalert(awesome.getName()); // 'Super Awesome'\n</code></pre>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Ext.Base\" rel=\"Ext.Base\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Base</a></span><div cl***REMOVED***='sub-desc'><p>this</p>\n</div></li></ul></div></div></div><div id='method-onConfigUpdate' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-onConfigUpdate' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-onConfigUpdate' cl***REMOVED***='name expandable'>onConfigUpdate</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> names, <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> callback, <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> scope</span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>names</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li><li><span cl***REMOVED***='pre'>callback</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li><li><span cl***REMOVED***='pre'>scope</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setConfig' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-setConfig' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-setConfig' cl***REMOVED***='name expandable'>setConfig</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config, <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> applyIfNotSet</span> )<strong cl***REMOVED***='private signature'>private</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'> ...</div><div cl***REMOVED***='long'>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li><li><span cl***REMOVED***='pre'>applyIfNotSet</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div><div id='method-statics' cl***REMOVED***='member  inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><a href='#!/api/Ext.Base' rel='Ext.Base' cl***REMOVED***='defined-in docCl***REMOVED***'>Ext.Base</a><br/><a href='source/Base.html#Ext-Base-method-statics' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.Base-method-statics' cl***REMOVED***='name expandable'>statics</a>( <span cl***REMOVED***='pre'></span> ) : <a href=\"#!/api/Ext.Cl***REMOVED***\" rel=\"Ext.Cl***REMOVED***\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Cl***REMOVED***</a><strong cl***REMOVED***='protected signature'>protected</strong></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Get the reference to the cl***REMOVED*** from which this object was instantiated. ...</div><div cl***REMOVED***='long'><p>Get the reference to the cl***REMOVED*** from which this object was instantiated. Note that unlike <a href=\"#!/api/Ext.Base-property-self\" rel=\"Ext.Base-property-self\" cl***REMOVED***=\"docCl***REMOVED***\">self</a>,\n<code>this.statics()</code> is scope-independent and it always returns the cl***REMOVED*** from which it was called, regardless of what\n<code>this</code> points to during run-time</p>\n\n<pre><code><a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.Cat', {\n    statics: {\n        totalCreated: 0,\n        speciesName: 'Cat' // My.Cat.speciesName = 'Cat'\n    },\n\n    constructor: function() {\n        var statics = this.statics();\n\n        alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to\n                                        // equivalent to: My.Cat.speciesName\n\n        alert(this.self.speciesName);   // dependent on 'this'\n\n        statics.totalCreated++;\n    },\n\n    clone: function() {\n        var cloned = new this.self;                      // dependent on 'this'\n\n        cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName\n\n        return cloned;\n    }\n});\n\n\n<a href=\"#!/api/Ext-method-define\" rel=\"Ext-method-define\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.define</a>('My.SnowLeopard', {\n    extend: 'My.Cat',\n\n    statics: {\n        speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'\n    },\n\n    constructor: function() {\n        this.callParent();\n    }\n});\n\nvar cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'\n\nvar snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'\n\nvar clone = snowLeopard.clone();\nalert(<a href=\"#!/api/Ext-method-getCl***REMOVED***Name\" rel=\"Ext-method-getCl***REMOVED***Name\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.getCl***REMOVED***Name</a>(clone));         // alerts 'My.SnowLeopard'\nalert(clone.groupName);                 // alerts 'Cat'\n\nalert(My.Cat.totalCreated);             // alerts 3\n</code></pre>\n<h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Ext.Cl***REMOVED***\" rel=\"Ext.Cl***REMOVED***\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.Cl***REMOVED***</a></span><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","subcl***REMOVED***es":[],"name":"Ext.draw.engine.SvgExporter","alternateCl***REMOVED***Names":[],"inheritdoc":null,"files":[{"href":"SvgExporter.html#Ext-draw-engine-SvgExporter","filename":"SvgExporter.js"}],"html_meta":{},"singleton":true,"id":"cl***REMOVED***-Ext.draw.engine.SvgExporter","statics":{"property":[],"event":[],"css_var":[],"method":[],"css_mixin":[],"cfg":[]},"requires":[]});