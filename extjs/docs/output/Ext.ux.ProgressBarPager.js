Ext.data.JsonP.Ext_ux_ProgressBarPager({"mixins":[],"code_type":"ext_define","inheritable":false,"component":false,"meta":{},"mixedInto":[],"uses":[],"aliases":{},"parentMixins":[],"supercl***REMOVED***es":[],"members":{"event":[],"property":[],"css_var":[],"method":[{"meta":{},"owner":"Ext.ux.ProgressBarPager","tagname":"method","name":"constructor","id":"method-constructor"}],"css_mixin":[],"cfg":[{"meta":{},"owner":"Ext.ux.ProgressBarPager","tagname":"cfg","name":"defaultAnimCfg","id":"cfg-defaultAnimCfg"},{"meta":{},"owner":"Ext.ux.ProgressBarPager","tagname":"cfg","name":"defaultText","id":"cfg-defaultText"},{"meta":{},"owner":"Ext.ux.ProgressBarPager","tagname":"cfg","name":"width","id":"cfg-width"}]},"tagname":"cl***REMOVED***","extends":null,"html":"<div><pre cl***REMOVED***=\"hierarchy\"><h4>Requires</h4><div cl***REMOVED***='dependency'><a href='#!/api/Ext.ProgressBar' rel='Ext.ProgressBar' cl***REMOVED***='docCl***REMOVED***'>Ext.ProgressBar</a></div><h4>Files</h4><div cl***REMOVED***='dependency'><a href='source/ProgressBarPager.html#Ext-ux-ProgressBarPager' target='_blank'>ProgressBarPager.js</a></div></pre><div cl***REMOVED***='doc-contents'><p>Plugin for displaying a progressbar inside of a paging toolbar instead of plain text</p>\n</div><div cl***REMOVED***='members'><div cl***REMOVED***='members-section'><div cl***REMOVED***='definedBy'>Defined By</div><h3 cl***REMOVED***='members-title icon-cfg'>Config options</h3><div cl***REMOVED***='subsection'><div id='cfg-defaultAnimCfg' cl***REMOVED***='member first-child not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.ux.ProgressBarPager'>Ext.ux.ProgressBarPager</span><br/><a href='source/ProgressBarPager.html#Ext-ux-ProgressBarPager-cfg-defaultAnimCfg' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.ux.ProgressBarPager-cfg-defaultAnimCfg' cl***REMOVED***='name expandable'>defaultAnimCfg</a><span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>A Ext.fx.Anim configuration object. ...</div><div cl***REMOVED***='long'><p>A <a href=\"#!/api/Ext.fx.Anim\" rel=\"Ext.fx.Anim\" cl***REMOVED***=\"docCl***REMOVED***\">Ext.fx.Anim</a> configuration object.</p>\n\n<p>Defaults to: <code>{duration: 1000, easing: &quot;bounceOut&quot;}</code></p></div></div></div><div id='cfg-defaultText' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.ux.ProgressBarPager'>Ext.ux.ProgressBarPager</span><br/><a href='source/ProgressBarPager.html#Ext-ux-ProgressBarPager-cfg-defaultText' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.ux.ProgressBarPager-cfg-defaultText' cl***REMOVED***='name expandable'>defaultText</a><span> : <a href=\"#!/api/String\" rel=\"String\" cl***REMOVED***=\"docCl***REMOVED***\">String</a></span></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>The text to display while the store is loading. ...</div><div cl***REMOVED***='long'><p>The text to display while the store is loading.  Default is 'Loading...'</p>\n\n<p>Defaults to: <code>&quot;Loading...&quot;</code></p></div></div></div><div id='cfg-width' cl***REMOVED***='member  not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.ux.ProgressBarPager'>Ext.ux.ProgressBarPager</span><br/><a href='source/ProgressBarPager.html#Ext-ux-ProgressBarPager-cfg-width' target='_blank' cl***REMOVED***='view-source'>view source</a></div><a href='#!/api/Ext.ux.ProgressBarPager-cfg-width' cl***REMOVED***='name expandable'>width</a><span> : <a href=\"#!/api/Number\" rel=\"Number\" cl***REMOVED***=\"docCl***REMOVED***\">Number</a></span></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>The default progress bar width. ...</div><div cl***REMOVED***='long'><p>The default progress bar width.  Default is 225.</p>\n\n<p>Defaults to: <code>225</code></p></div></div></div></div></div><div cl***REMOVED***='members-section'><div cl***REMOVED***='definedBy'>Defined By</div><h3 cl***REMOVED***='members-title icon-method'>Methods</h3><div cl***REMOVED***='subsection'><div id='method-constructor' cl***REMOVED***='member first-child not-inherited'><a href='#' cl***REMOVED***='side expandable'><span>&nbsp;</span></a><div cl***REMOVED***='title'><div cl***REMOVED***='meta'><span cl***REMOVED***='defined-in' rel='Ext.ux.ProgressBarPager'>Ext.ux.ProgressBarPager</span><br/><a href='source/ProgressBarPager.html#Ext-ux-ProgressBarPager-method-constructor' target='_blank' cl***REMOVED***='view-source'>view source</a></div><strong cl***REMOVED***='new-keyword'>new</strong><a href='#!/api/Ext.ux.ProgressBarPager-method-constructor' cl***REMOVED***='name expandable'>Ext.ux.ProgressBarPager</a>( <span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a> config</span> ) : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></div><div cl***REMOVED***='description'><div cl***REMOVED***='short'>Create a new ProgressBarPager ...</div><div cl***REMOVED***='long'><p>Create a new ProgressBarPager</p>\n<h3 cl***REMOVED***=\"pa\">Parameters</h3><ul><li><span cl***REMOVED***='pre'>config</span> : <a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a><div cl***REMOVED***='sub-desc'><p>Configuration options</p>\n</div></li></ul><h3 cl***REMOVED***='pa'>Returns</h3><ul><li><span cl***REMOVED***='pre'><a href=\"#!/api/Object\" rel=\"Object\" cl***REMOVED***=\"docCl***REMOVED***\">Object</a></span><div cl***REMOVED***='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","subcl***REMOVED***es":[],"name":"Ext.ux.ProgressBarPager","alternateCl***REMOVED***Names":[],"inheritdoc":null,"files":[{"href":"ProgressBarPager.html#Ext-ux-ProgressBarPager","filename":"ProgressBarPager.js"}],"html_meta":{},"singleton":false,"id":"cl***REMOVED***-Ext.ux.ProgressBarPager","statics":{"property":[],"event":[],"css_var":[],"method":[],"css_mixin":[],"cfg":[]},"requires":["Ext.ProgressBar"]});