/*
Ext JS 4.1 - JavaScript Library
Copyright (c) 2006-2012, Sencha Inc.
All rights reserved.
licensing@sencha.com

http://www.sencha.com/license

Open Source License
------------------------------------------------------------------------------------------
This version of Ext JS is licensed under the terms of the Open Source GPL 3.0 license. 

http://www.gnu.org/licenses/gpl.html

There are several FLOSS exceptions available for use with this release for
open source applications that are distributed under a license other than GPL.

* Open Source License Exception for Applications

  http://www.sencha.com/products/floss-exception.php

* Open Source License Exception for Development

  http://www.sencha.com/products/ux-exception.php


Alternate Licensing
------------------------------------------------------------------------------------------
Commercial and OEM Licenses are available for an alternate download of Ext JS.
This is the appropriate option if you are creating proprietary applications and you are 
not prepared to distribute and share the source code of your application under the 
GPL v3 license. Please visit http://www.sencha.com/license for more details.

--

This library is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS.  See the GNU General Public License for more details.
*/
//@tag foundation,core


var Ext = Ext || {};
Ext._startTime = new Date().getTime();
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function () {},
        
        
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller; 
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        i;

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    
    Ext.enumerables = enumerables;

    
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {

        
        name: Ext.sandboxName || 'Ext',

        
        emptyFn: emptyFn,

        
        emptyString: new String(),

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        
        iterate: function(object, fn, scope) {
            if (Ext.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (Ext.isIterable(object)) {
                Ext.Array.each.call(Ext.Array, object, fn, scope);
            }
            else {
                Ext.Object.each.call(Ext.Object, object, fn, scope);
            }
        }
    });

    Ext.apply(Ext, {

        
        extend: (function() {
            
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subcl***REMOVED***, supercl***REMOVED***, overrides) {
                
                if (Ext.isObject(supercl***REMOVED***)) {
                    overrides = supercl***REMOVED***;
                    supercl***REMOVED*** = subcl***REMOVED***;
                    subcl***REMOVED*** = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        supercl***REMOVED***.apply(this, arguments);
                    };
                }


                
                var F = function() {},
                    subcl***REMOVED***Proto, supercl***REMOVED***Proto = supercl***REMOVED***.prototype;

                F.prototype = supercl***REMOVED***Proto;
                subcl***REMOVED***Proto = subcl***REMOVED***.prototype = new F();
                subcl***REMOVED***Proto.constructor = subcl***REMOVED***;
                subcl***REMOVED***.supercl***REMOVED*** = supercl***REMOVED***Proto;

                if (supercl***REMOVED***Proto.constructor === objectConstructor) {
                    supercl***REMOVED***Proto.constructor = supercl***REMOVED***;
                }

                subcl***REMOVED***.override = function(overrides) {
                    Ext.override(subcl***REMOVED***, overrides);
                };

                subcl***REMOVED***Proto.override = inlineOverrides;
                subcl***REMOVED***Proto.proto = subcl***REMOVED***Proto;

                subcl***REMOVED***.override(overrides);
                subcl***REMOVED***.extend = function(o) {
                    return Ext.extend(subcl***REMOVED***, o);
                };

                return subcl***REMOVED***;
            };
        }()),

        
        override: function (target, overrides) {
            if (target.$isCl***REMOVED***) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Ext.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isCl***REMOVED***) { 
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value == 'function') {

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name] 
                                    : callOverrideParent; 
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Ext.apply(target, overrides);
                }
            }

            return target;
        }
    });

    
    Ext.apply(Ext, {

        
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        
        typeOf: function(value) {
            var type,
                typeToString;
            
            if (value === null) {
                return 'null';
            }

            type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

        },

        
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        
        isFunction:
        
        
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        
        isString: function(value) {
            return typeof value === 'string';
        },

        
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        
        isIterable: function(value) {
            var type = typeof value,
                checkLength = false;
            if (value && type != 'string') {
                
                if (type == 'function') {
                    
                    
                    if (Ext.isSafari) {
                        checkLength = value instanceof NodeList || value instanceof HTMLCollection;
                    }
                } else {
                    checkLength = true;
                }
            }
            return checkLength ? value.length !== undefined : false;
        }
    });

    Ext.apply(Ext, {

        
        clone: function(item) {
            var type,
                i,
                j,
                k,
                clone,
                key;
            
            if (item === null || item === undefined) {
                return item;
            }

            
            
            
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            type = toString.call(item);

            
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }


            
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace,
                i;

            if (uniqueGlobalNamespace === undefined) {
                i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (Ext.global[uniqueGlobalNamespace] !== undefined);

                Ext.global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },
        
        
        functionFactoryCache: {},
        
        cacheableFunctionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                cache = me.functionFactoryCache,
                idx, fn, ln;
                
             if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
            idx = args.join('');
            fn = cache[idx];
            if (!fn) {
                fn = Function.prototype.constructor.apply(Function.prototype, args);
                
                cache[idx] = fn;
            }
            return fn;
        },
        
        functionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                ln;
                
            if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
     
            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        
        Logger: {
            verbose: emptyFn,
            log: emptyFn,
            info: emptyFn,
            warn: emptyFn,
            error: function(message) {
                throw new Error(message);
            },
            deprecate: emptyFn
        }
    });

    
    Ext.type = Ext.typeOf;

}());


Ext.globalEval = Ext.global.execScript
    ? function(code) {
        execScript(code);
    }
    : function($$code) {
        
        
        (function(){
            eval($$code);
        }());
    };

//@tag foundation,core

//@require ../Ext.js



(function() {


var version = '4.1.1.1', Version;
    Ext.Version = Version = Ext.extend(Object, {

        
        constructor: function(version) {
            var parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.shortVersion = this.version.substr(0, releaseStartIndex);
            }

            this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = parseInt(parts.shift() || 0, 10);
            this.minor = parseInt(parts.shift() || 0, 10);
            this.patch = parseInt(parts.shift() || 0, 10);
            this.build = parseInt(parts.shift() || 0, 10);

            return this;
        },

        
        toString: function() {
            return this.version;
        },

        
        valueOf: function() {
            return this.version;
        },

        
        getMajor: function() {
            return this.major || 0;
        },

        
        getMinor: function() {
            return this.minor || 0;
        },

        
        getPatch: function() {
            return this.patch || 0;
        },

        
        getBuild: function() {
            return this.build || 0;
        },

        
        getRelease: function() {
            return this.release || '';
        },

        
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        
        isGreaterThanOrEqual: function(target) {
            return Version.compare(this.version, target) >= 0;
        },

        
        isLessThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        
        isLessThanOrEqual: function(target) {
            return Version.compare(this.version, target) <= 0;
        },

        
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        
        getShortVersion: function() {
            return this.shortVersion;
        },

        
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        
        lt: function() {
            return this.isLessThan.apply(this, arguments);
        },

        
        gtEq: function() {
            return this.isGreaterThanOrEqual.apply(this, arguments);
        },

        
        ltEq: function() {
            return this.isLessThanOrEqual.apply(this, arguments);
        }
    });

    Ext.apply(Version, {
        
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    
    Ext.apply(Ext, {
        
        versions: {},

        
        lastRegisteredVersion: null,

        
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);
            Ext.lastRegisteredVersion = Ext.versions[packageName];

            return this;
        },

        
        getVersion: function(packageName) {
            if (packageName === undefined) {
                return Ext.lastRegisteredVersion;
            }

            return Ext.versions[packageName];
        },

        
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); 

    Ext.setVersion('core', version);

}());

//@tag foundation,core

//@require ../version/Version.js




Ext.String = (function() {
    var trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe      = /('|\\)/g,
        formatRe      = /\{(\d+)\}/g,
        escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
        basicTrimRe   = /^\s+|\s+$/g,
        whitespaceRe  = /\s+/,
        varReplace    = /(^[^a-z]*|[^\w])/gi,
        charToEntity,
        entityToChar,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        },
        htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        };

    return {

        
        createVarName: function(s) {
            return s.replace(varReplace, '');
        },

        
        htmlEncode: function(value) {
            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        },

        
        htmlDecode: function(value) {
            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        },

        
        addCharacterEntities: function(newEntities) {
            var charKeys = [],
                entityKeys = [],
                key, echar;
            for (key in newEntities) {
                echar = newEntities[key];
                entityToChar[key] = echar;
                charToEntity[echar] = key;
                charKeys.push(echar);
                entityKeys.push(key);
            }
            charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
            entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        },

        
        resetCharacterEntities: function() {
            charToEntity = {};
            entityToChar = {};
            
            this.addCharacterEntities({
                '&amp;'     :   '&',
                '&gt;'      :   '>',
                '&lt;'      :   '<',
                '&quot;'    :   '"',
                '&#39;'     :   "'"
            });
        },

        
        urlAppend : function(url, string) {
            if (!Ext.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        
        trim: function(string) {
            return string.replace(trimRegex, "");
        },

        
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substr(1);
        },

        
        uncapitalize: function(string) {
            return string.charAt(0).toLowerCase() + string.substr(1);
        },

        
        ellipsis: function(value, len, word) {
            if (value && value.length > len) {
                if (word) {
                    var vs = value.substr(0, len - 2),
                    index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (len - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, len - 3) + "...";
            }
            return value;
        },

        
        escapeRegex: function(string) {
            return string.replace(escapeRegexRe, "\\$1");
        },

        
        escape: function(string) {
            return string.replace(escapeRe, "\\$1");
        },

        
        toggle: function(string, value, other) {
            return string === value ? other : value;
        },

        
        leftPad: function(string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        
        format: function(format) {
            var args = Ext.Array.toArray(arguments, 1);
            return format.replace(formatRe, function(m, i) {
                return args[i];
            });
        },

        
        repeat: function(pattern, count, sep) {
            for (var buf = [], i = count; i--; ) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },

        
        splitWords: function (words) {
            if (words && typeof words == 'string') {
                return words.replace(basicTrimRe, '').split(whitespaceRe);
            }
            return words || [];
        }
    };
}());


Ext.String.resetCharacterEntities();


Ext.htmlEncode = Ext.String.htmlEncode;



Ext.htmlDecode = Ext.String.htmlDecode;


Ext.urlAppend = Ext.String.urlAppend;

//@tag foundation,core

//@require String.js

//@define Ext.Number




Ext.Number = new function() {

    var me = this,
        isToFixedBroken = (0.9).toFixed() !== '1',
        math = Math;

    Ext.apply(this, {
        
        constrain: function(number, min, max) {
            var x = parseFloat(number);

            
            

            
            
            
            
            
            return (x < min) ? min : ((x > max) ? max : x);
        },

        
        snap : function(value, increment, minValue, maxValue) {
            var m;

            
            
            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return me.constrain(value, minValue,  maxValue);
        },

        
        snapInRange : function(value, increment, minValue, maxValue) {
            var tween;

            
            minValue = (minValue || 0);

            
            if (value === undefined || value < minValue) {
                return minValue;
            }

            
            if (increment && (tween = ((value - minValue) % increment))) {
                value -= tween;
                tween *= 2;
                if (tween >= increment) {
                    value += increment;
                }
            }

            
            if (maxValue !== undefined) {
                if (value > (maxValue = me.snapInRange(maxValue, increment, minValue))) {
                    value = maxValue;
                }
            }

            return value;
        },

        
        toFixed: isToFixedBroken ? function(value, precision) {
            precision = precision || 0;
            var pow = math.pow(10, precision);
            return (math.round(value * pow) / pow).toFixed(precision);
        } : function(value, precision) {
            return value.toFixed(precision);
        },

        
        from: function(value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }

            return !isNaN(value) ? value : defaultValue;
        },

        
        randomInt: function (from, to) {
           return math.floor(math.random() * (to - from + 1) + from);
        }
    });

    
    Ext.num = function() {
        return me.from.apply(this, arguments);
    };
};

//@tag foundation,core

//@require Number.js



(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = (function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            
            

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; 
            array.splice(13, 0, "XXX"); 

            if (lengthBefore+1 != array.length) {
                return false;
            }
            

            return true;
        }()),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = (function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }()),
        supportsSliceOnNodeList = true,
        ExtArray,
        erase,
        replace,
        splice;

    try {
        
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index),
            remove,
            tailOldPos,
            tailNewPos,
            tailCount,
            lengthAfterRemove,
            i;

        
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            remove = Math.min(removeCount, length - pos);
            tailOldPos = pos + remove;
            tailNewPos = tailOldPos + add - remove;
            tailCount = length - tailOldPos;
            lengthAfterRemove = length - remove;

            if (tailNewPos < tailOldPos) { 
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { 
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } 

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; 
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; 
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    erase = supportsSplice ? eraseNative : eraseSim;
    replace = supportsSplice ? replaceNative : replaceSim;
    splice = supportsSplice ? spliceNative : spliceSim;

    

    ExtArray = Ext.Array = {
        
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        
        forEach: supportsForEach ? function(array, fn, scope) {
            return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        
        indexOf: supportsIndexOf ? function(array, item, from) {
            return array.indexOf(item, from);
         } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        
        contains: supportsIndexOf ? function(array, item) {
            return array.indexOf(item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        
        map: supportsMap ? function(array, fn, scope) {
            return array.map(fn, scope);
        } : function(array, fn, scope) {
            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        
        every: supportsEvery ? function(array, fn, scope) {
            return array.every(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        
        some: supportsSome ? function(array, fn, scope) {
            return array.some(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        
        filter: supportsFilter ? function(array, fn, scope) {
            return array.filter(fn, scope);
        } : function(array, fn, scope) {
            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            var type = typeof value;
            
            
            if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        
        clone: function(array) {
            return slice.call(array);
        },

        
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        
        intersect: function() {
            var intersection = [],
                arrays = slice.call(arguments),
                arraysLength,
                array,
                arrayLength,
                minArray,
                minArrayIndex,
                minArrayCandidate,
                minArrayLength,
                element,
                elementCandidate,
                elementCount,
                i, j, k;

            if (!arrays.length) {
                return intersection;
            }

            
            arraysLength = arrays.length;
            for (i = minArrayIndex = 0; i < arraysLength; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }

            minArray = ExtArray.unique(minArray);
            erase(arrays, minArrayIndex, 1);

            
            
            
            minArrayLength = minArray.length;
            arraysLength = arrays.length;
            for (i = 0; i < minArrayLength; i++) {
                element = minArray[i];
                elementCount = 0;

                for (j = 0; j < arraysLength; j++) {
                    array = arrays[j];
                    arrayLength = array.length;
                    for (k = 0; k < arrayLength; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }

                if (elementCount === arraysLength) {
                    intersection.push(element);
                }
            }

            return intersection;
        },

        
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        
        
        slice: ([1,2].slice(1, undefined).length ?
            function (array, begin, end) {
                return slice.call(array, begin, end);
            } :
            
            function (array, begin, end) {
                
                
                if (typeof begin === 'undefined') {
                    return slice.call(array);
                }
                if (typeof end === 'undefined') {
                    return slice.call(array, begin);
                }
                return slice.call(array, begin, end);
            }
        ),

        
        sort: supportsSort ? function(array, sortFn) {
            if (sortFn) {
                return array.sort(sortFn);
            } else {
                return array.sort();
            }
         } : function(array, sortFn) {
            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        
        toMap: function(array, getKey, scope) {
            var map = {},
                i = array.length;

            if (!getKey) {
                while (i--) {
                    map[array[i]] = i+1;
                }
            } else if (typeof getKey == 'string') {
                while (i--) {
                    map[array[i][getKey]] = i+1;
                }
            } else {
                while (i--) {
                    map[getKey.call(scope, array[i])] = i+1;
                }
            }

            return map;
        },


        
        erase: erase,

        
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        
        replace: replace,

        
        splice: splice,

        
        push: function(array) {
            var len = arguments.length,
                i = 1,
                newItem;

            if (array === undefined) {
                array = [];
            } else if (!Ext.isArray(array)) {
                array = [array];
            }
            for (; i < len; i++) {
                newItem = arguments[i];
                Array.prototype.push[Ext.isArray(newItem) ? 'apply' : 'call'](array, newItem);
            }
            return array;
        }
    };

    
    Ext.each = ExtArray.each;

    
    ExtArray.union = ExtArray.merge;

    
    Ext.min = ExtArray.min;

    
    Ext.max = ExtArray.max;

    
    Ext.sum = ExtArray.sum;

    
    Ext.mean = ExtArray.mean;

    
    Ext.flatten = ExtArray.flatten;

    
    Ext.clean = ExtArray.clean;

    
    Ext.unique = ExtArray.unique;

    
    Ext.pluck = ExtArray.pluck;

    
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };
}());

//@tag foundation,core

//@require Array.js



Ext.Function = {

    
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },

    
    bind: function(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            };
        }

        var method = fn,
            slice = Array.prototype.slice;

        return function() {
            var callArgs = args || arguments;

            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0); 
                Ext.Array.insert(callArgs, appendArgs, args);
            }

            return method.apply(scope || Ext.global, callArgs);
        };
    },

    
    p***REMOVED***: function(fn, args, scope) {
        if (!Ext.isArray(args)) {
            if (Ext.isIterable(args)) {
                args = Ext.Array.clone(args);
            } else {
                args = args !== undefined ? [args] : [];
            }
        }

        return function() {
            var fnArgs = [].concat(args);
            fnArgs.push.apply(fnArgs, arguments);
            return fn.apply(scope || this, fnArgs);
        };
    },

    
    alias: function(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    },

    
    clone: function(method) {
        return function() {
            return method.apply(this, arguments);
        };
    },

    
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || Ext.global, args) !== false) ? origFn.apply(me || Ext.global, args) : returnValue || null;
            };
        }
    },

    
    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }

        return function() {
            var me = this,
                args = Array.prototype.slice.call(arguments);

            setTimeout(function() {
                fn.apply(me, args);
            }, delay);
        };
    },

    
    defer: function(fn, millis, scope, args, appendArgs) {
        fn = Ext.Function.bind(fn, scope, args, appendArgs);
        if (millis > 0) {
            return setTimeout(Ext.supports.TimeoutActualLateness ? function () {
                fn();
            } : fn, millis);
        }
        fn();
        return 0;
    },

    
    createSequence: function(originalFn, newFn, scope) {
        if (!newFn) {
            return originalFn;
        }
        else {
            return function() {
                var result = originalFn.apply(this, arguments);
                newFn.apply(scope || this, arguments);
                return result;
            };
        }
    },

    
    createBuffered: function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    },

    
    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    },


    
    interceptBefore: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            var ret = fn.apply(scope || this, arguments);
            method.apply(this, arguments);

            return ret;
        });
    },

    
    interceptAfter: function(object, methodName, fn, scope) {
        var method = object[methodName] || Ext.emptyFn;

        return (object[methodName] = function() {
            method.apply(this, arguments);
            return fn.apply(scope || this, arguments);
        });
    }
};


Ext.defer = Ext.Function.alias(Ext.Function, 'defer');


Ext.p***REMOVED*** = Ext.Function.alias(Ext.Function, 'p***REMOVED***');


Ext.bind = Ext.Function.alias(Ext.Function, 'bind');

//@tag foundation,core

//@require Function.js




(function() {


var TemplateCl***REMOVED*** = function(){},
    ExtObject = Ext.Object = {

    
    chain: function (object) {
        TemplateCl***REMOVED***.prototype = object;
        var result = new TemplateCl***REMOVED***();
        TemplateCl***REMOVED***.prototype = null;
        return result;
    },

    
    toQueryObjects: function(name, value, recursive) {
        var self = ExtObject.toQueryObjects,
            objects = [],
            i, ln;

        if (Ext.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                }
                else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    }
                    else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        }
        else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            }
            else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);


                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },

    
    each: function(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    },

    
    merge: function(destination) {
        var i = 1,
            ln = arguments.length,
            mergeFn = ExtObject.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = destination[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    }
                    else {
                        destination[key] = cloneFn(value);
                    }
                }
                else {
                    destination[key] = value;
                }
            }
        }

        return destination;
    },

    
    mergeIf: function(destination) {
        var i = 1,
            ln = arguments.length,
            cloneFn = Ext.clone,
            object, key, value;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                if (!(key in destination)) {
                    value = object[key];

                    if (value && value.constructor === Object) {
                        destination[key] = cloneFn(value);
                    }
                    else {
                        destination[key] = value;
                    }
                }
            }
        }

        return destination;
    },

    
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },

    
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },

    
    getKeys: (typeof Object.keys == 'function')
        ? function(object){
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
        : function(object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }

            return keys;
        },

    
    getSize: function(object) {
        var size = 0,
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                size++;
            }
        }

        return size;
    },

    
    cl***REMOVED***ify: function(object) {
        var prototype = object,
            objectProperties = [],
            propertyCl***REMOVED***esMap = {},
            objectCl***REMOVED*** = function() {
                var i = 0,
                    ln = objectProperties.length,
                    property;

                for (; i < ln; i++) {
                    property = objectProperties[i];
                    this[property] = new propertyCl***REMOVED***esMap[property]();
                }
            },
            key, value;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                if (value && value.constructor === Object) {
                    objectProperties.push(key);
                    propertyCl***REMOVED***esMap[key] = ExtObject.cl***REMOVED***ify(value);
                }
            }
        }

        objectCl***REMOVED***.prototype = prototype;

        return objectCl***REMOVED***;
    }
};


Ext.merge = Ext.Object.merge;


Ext.mergeIf = Ext.Object.mergeIf;


Ext.urlEncode = function() {
    var args = Ext.Array.from(arguments),
        prefix = '';

    
    if ((typeof args[1] === 'string')) {
        prefix = args[1] + '&';
        args[1] = false;
    }

    return prefix + ExtObject.toQueryString.apply(ExtObject, args);
};


Ext.urlDecode = function() {
    return ExtObject.fromQueryString.apply(ExtObject, arguments);
};

}());

//@tag foundation,core

//@require Object.js

//@define Ext.Date






(function() {




function xf(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
}

Ext.Date = {
    
    now: Date.now || function() {
        return +new Date();
    },

    
    toString: function(date) {
        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
            + pad(date.getMonth() + 1, 2, '0') + "-"
            + pad(date.getDate(), 2, '0') + "T"
            + pad(date.getHours(), 2, '0') + ":"
            + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    },

    
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || new Date()));
    },

    
    useStrict: false,

    
    formatCodeToRegex: function(character, currentGroup) {
        
        var p = utilDate.parseCodes[character];

        if (p) {
          p = typeof p == 'function'? p() : p;
          utilDate.parseCodes[character] = p; 
        }

        return p ? Ext.applyIf({
          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.String.escapeRegex(character) 
        };
    },

    
    parseFunctions: {
        "MS": function(input, strict) {
            
            
            var re = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/'),
                r = (input || '').match(re);
            return r? new Date(((r[1] || '') + r[2]) * 1) : null;
        }
    },
    parseRegexes: [],

    
    formatFunctions: {
        "MS": function() {
            
            return '\\/Date(' + this.getTime() + ')\\/';
        }
    },

    y2kYear : 50,

    
    MILLI : "ms",

    
    SECOND : "s",

    
    MINUTE : "mi",

    
    HOUR : "h",

    
    DAY : "d",

    
    MONTH : "mo",

    
    YEAR : "y",

    
    defaults: {},

    
    
    dayNames : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    

    
    
    monthNames : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    

    
    
    monthNumbers : {
        January: 0,
        Jan: 0,
        February: 1,
        Feb: 1,
        March: 2,
        Mar: 2,
        April: 3,
        Apr: 3,
        May: 4,
        June: 5,
        Jun: 5,
        July: 6,
        Jul: 6,
        August: 7,
        Aug: 7,
        September: 8,
        Sep: 8,
        October: 9,
        Oct: 9,
        November: 10,
        Nov: 10,
        December: 11,
        Dec: 11
    },
    
    
    
    
    defaultFormat : "m/d/Y",
    
    
    
    getShortMonthName : function(month) {
        return Ext.Date.monthNames[month].substring(0, 3);
    },
    

    
    
    getShortDayName : function(day) {
        return Ext.Date.dayNames[day].substring(0, 3);
    },
    

    
    
    getMonthNumber : function(name) {
        
        return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
    },
    

    
    formatContainsHourInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            hourInfoRe = /([gGhHisucUOPZ]|MS)/;
        return function(format){
            return hourInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    }()),

    
    formatContainsDateInfo : (function(){
        var stripEscapeRe = /(\\.)/g,
            dateInfoRe = /([djzmnYycU]|MS)/;

        return function(format){
            return dateInfoRe.test(format.replace(stripEscapeRe, ''));
        };
    }()),
    
    
    unescapeFormat: (function() { 
        var slashRe = /\\/gi;
        return function(format) {
            
            
            
            return format.replace(slashRe, '');
        }
    }()),

    
    formatCodes : {
        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
        D: "Ext.Date.getShortDayName(this.getDay())", 
        j: "this.getDate()",
        l: "Ext.Date.dayNames[this.getDay()]",
        N: "(this.getDay() ? this.getDay() : 7)",
        S: "Ext.Date.getSuffix(this)",
        w: "this.getDay()",
        z: "Ext.Date.getDayOfYear(this)",
        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
        F: "Ext.Date.monthNames[this.getMonth()]",
        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
        M: "Ext.Date.getShortMonthName(this.getMonth())", 
        n: "(this.getMonth() + 1)",
        t: "Ext.Date.getDaysInMonth(this)",
        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
        y: "('' + this.getFullYear()).substring(2, 4)",
        a: "(this.getHours() < 12 ? 'am' : 'pm')",
        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
        G: "this.getHours()",
        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
        O: "Ext.Date.getGMTOffset(this)",
        P: "Ext.Date.getGMTOffset(this, true)",
        T: "Ext.Date.getTimezone(this)",
        Z: "(this.getTimezoneOffset() * -60)",

        c: function() { 
            var c, code, i, l, e;
            for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                e = c.charAt(i);
                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); 
            }
            return code.join(" + ");
        },
        

        U: "Math.round(this.getTime() / 1000)"
    },

    
    isValid : function(y, m, d, h, i, s, ms) {
        
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },

    
    parse : function(input, format, strict) {
        var p = utilDate.parseFunctions;
        if (p[format] == null) {
            utilDate.createParser(format);
        }
        return p[format](input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
    },

    
    parseDate: function(input, format, strict){
        return utilDate.parse(input, format, strict);
    },


    
    getFormatCode : function(character) {
        var f = utilDate.formatCodes[character];

        if (f) {
          f = typeof f == 'function'? f() : f;
          utilDate.formatCodes[character] = f; 
        }

        
        return f || ("'" + Ext.String.escape(character) + "'");
    },

    
    createFormat : function(format) {
        var code = [],
            special = false,
            ch = '',
            i;

        for (i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push("'" + Ext.String.escape(ch) + "'");
            } else {
                code.push(utilDate.getFormatCode(ch));
            }
        }
        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
    },

    
    createParser : (function() {
        var code = [
            "var dt, y, m, d, h, i, s, ms, o, z, zz, u, v,",
                "def = Ext.Date.defaults,",
                "results = String(input).match(Ext.Date.parseRegexes[{0}]);", 

            "if(results){",
                "{1}",

                "if(u != null){", 
                    "v = new Date(u * 1000);", 
                "}else{",
                    
                    
                    
                    "dt = Ext.Date.clearTime(new Date);",

                    
                    "y = Ext.Number.from(y, Ext.Number.from(def.y, dt.getFullYear()));",
                    "m = Ext.Number.from(m, Ext.Number.from(def.m - 1, dt.getMonth()));",
                    "d = Ext.Number.from(d, Ext.Number.from(def.d, dt.getDate()));",

                    
                    "h  = Ext.Number.from(h, Ext.Number.from(def.h, dt.getHours()));",
                    "i  = Ext.Number.from(i, Ext.Number.from(def.i, dt.getMinutes()));",
                    "s  = Ext.Number.from(s, Ext.Number.from(def.s, dt.getSeconds()));",
                    "ms = Ext.Number.from(ms, Ext.Number.from(def.ms, dt.getMilliseconds()));",

                    "if(z >= 0 && y >= 0){",
                        
                        

                        
                        
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",

                        
                        "v = !strict? v : (strict === true && (z <= 364 || (Ext.Date.isLeapYear(v) && z <= 365))? Ext.Date.add(v, Ext.Date.DAY, z) : null);",
                    "}else if(strict === true && !Ext.Date.isValid(y, m + 1, d, h, i, s, ms)){", 
                        "v = null;", 
                    "}else{",
                        
                        
                        "v = Ext.Date.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), Ext.Date.YEAR, y < 100 ? y - 100 : 0);",
                    "}",
                "}",
            "}",

            "if(v){",
                
                "if(zz != null){",
                    
                    "v = Ext.Date.add(v, Ext.Date.SECOND, -v.getTimezoneOffset() * 60 - zz);",
                "}else if(o){",
                    
                    "v = Ext.Date.add(v, Ext.Date.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
                "}",
            "}",

            "return v;"
        ].join('\n');

        return function(format) {
            var regexNum = utilDate.parseRegexes.length,
                currentGroup = 1,
                calc = [],
                regex = [],
                special = false,
                ch = "",
                i = 0,
                len = format.length,
                atEnd = [],
                obj;

            for (; i < len; ++i) {
                ch = format.charAt(i);
                if (!special && ch == "\\") {
                    special = true;
                } else if (special) {
                    special = false;
                    regex.push(Ext.String.escape(ch));
                } else {
                    obj = utilDate.formatCodeToRegex(ch, currentGroup);
                    currentGroup += obj.g;
                    regex.push(obj.s);
                    if (obj.g && obj.c) {
                        if (obj.calcAtEnd) {
                            atEnd.push(obj.c);
                        } else {
                            calc.push(obj.c);
                        }
                    }
                }
            }
            
            calc = calc.concat(atEnd);

            utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
            utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
        };
    }()),

    
    parseCodes : {
        
        d: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|0[1-9])" 
        },
        j: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|[1-9])" 
        },
        D: function() {
            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); 
            return {
                g:0,
                c:null,
                s:"(?:" + a.join("|") +")"
            };
        },
        l: function() {
            return {
                g:0,
                c:null,
                s:"(?:" + utilDate.dayNames.join("|") + ")"
            };
        },
        N: {
            g:0,
            c:null,
            s:"[1-7]" 
        },
        
        S: {
            g:0,
            c:null,
            s:"(?:st|nd|rd|th)"
        },
        
        w: {
            g:0,
            c:null,
            s:"[0-6]" 
        },
        z: {
            g:1,
            c:"z = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,3})" 
        },
        W: {
            g:0,
            c:null,
            s:"(?:\\d{2})" 
        },
        F: function() {
            return {
                g:1,
                c:"m = parseInt(Ext.Date.getMonthNumber(results[{0}]), 10);\n", 
                s:"(" + utilDate.monthNames.join("|") + ")"
            };
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); 
            return Ext.applyIf({
                s:"(" + a.join("|") + ")"
            }, utilDate.formatCodeToRegex("F"));
        },
        m: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|0[1-9])" 
        },
        n: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|[1-9])" 
        },
        t: {
            g:0,
            c:null,
            s:"(?:\\d{2})" 
        },
        L: {
            g:0,
            c:null,
            s:"(?:1|0)"
        },
        o: function() {
            return utilDate.formatCodeToRegex("Y");
        },
        Y: {
            g:1,
            c:"y = parseInt(results[{0}], 10);\n",
            s:"(\\d{4})" 
        },
        y: {
            g:1,
            c:"var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > Ext.Date.y2kYear ? 1900 + ty : 2000 + ty;\n", 
            s:"(\\d{1,2})"
        },
        
        
        a: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(am|pm|AM|PM)",
            calcAtEnd: true
        },
        
        
        A: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(AM|PM|am|pm)",
            calcAtEnd: true
        },
        
        g: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|[0-9])" 
        },
        G: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|1[0-9]|[0-9])" 
        },
        h: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|0[1-9])" 
        },
        H: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|[0-1][0-9])" 
        },
        i: {
            g:1,
            c:"i = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        s: {
            g:1,
            c:"s = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        u: {
            g:1,
            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
            s:"(\\d+)" 
        },
        O: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", 
                    "mn = o.substring(3,5) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+-]\\d{4})" 
        },
        P: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", 
                    "mn = o.substring(4,6) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+-]\\d{2}:\\d{2})" 
        },
        T: {
            g:0,
            c:null,
            s:"[A-Z]{1,4}" 
        },
        Z: {
            g:1,
            c:"zz = results[{0}] * 1;\n" 
                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
            s:"([+-]?\\d{1,5})" 
        },
        c: function() {
            var calc = [],
                arr = [
                    utilDate.formatCodeToRegex("Y", 1), 
                    utilDate.formatCodeToRegex("m", 2), 
                    utilDate.formatCodeToRegex("d", 3), 
                    utilDate.formatCodeToRegex("H", 4), 
                    utilDate.formatCodeToRegex("i", 5), 
                    utilDate.formatCodeToRegex("s", 6), 
                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, 
                    {c:[ 
                        "if(results[8]) {", 
                            "if(results[8] == 'Z'){",
                                "zz = 0;", 
                            "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c, 
                            "}else{",
                                utilDate.formatCodeToRegex("O", 8).c, 
                            "}",
                        "}"
                    ].join('\n')}
                ],
                i,
                l;

            for (i = 0, l = arr.length; i < l; ++i) {
                calc.push(arr[i].c);
            }

            return {
                g:1,
                c:calc.join(""),
                s:[
                    arr[0].s, 
                    "(?:", "-", arr[1].s, 
                        "(?:", "-", arr[2].s, 
                            "(?:",
                                "(?:T| )?", 
                                arr[3].s, ":", arr[4].s,  
                                "(?::", arr[5].s, ")?", 
                                "(?:(?:\\.|,)(\\d+))?", 
                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", 
                            ")?",
                        ")?",
                    ")?"
                ].join("")
            };
        },
        U: {
            g:1,
            c:"u = parseInt(results[{0}], 10);\n",
            s:"(-?\\d+)" 
        }
    },

    
    
    dateFormat: function(date, format) {
        return utilDate.format(date, format);
    },

    
    isEqual: function(date1, date2) {
        
        if (date1 && date2) {
            return (date1.getTime() === date2.getTime());
        }
        
        return !(date1 || date2);
    },

    
    format: function(date, format) {
        var formatFunctions = utilDate.formatFunctions;

        if (!Ext.isDate(date)) {
            return '';
        }

        if (formatFunctions[format] == null) {
            utilDate.createFormat(format);
        }

        return formatFunctions[format].call(date) + '';
    },

    
    getTimezone : function(date) {
        
        
        
        
        
        
        
        
        
        
        
        
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,4})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    
    getGMTOffset : function(date, colon) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + Ext.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
            + (colon ? ":" : "")
            + Ext.String.leftPad(Math.abs(offset % 60), 2, "0");
    },

    
    getDayOfYear: function(date) {
        var num = 0,
            d = Ext.Date.clone(date),
            m = date.getMonth(),
            i;

        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += utilDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    },

    
    getWeekOfYear : (function() {
        
        var ms1d = 864e5, 
            ms7d = 7 * ms1d; 

        return function(date) { 
            var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, 
                AWN = Math.floor(DC3 / 7), 
                Wyr = new Date(AWN * ms7d).getUTCFullYear();

            return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
        };
    }()),

    
    isLeapYear : function(date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    
    getFirstDayOfMonth : function(date) {
        var day = (date.getDay() - (date.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    
    getLastDayOfMonth : function(date) {
        return utilDate.getLastDateOfMonth(date).getDay();
    },


    
    getFirstDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    
    getLastDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
    },

    
    getDaysInMonth: (function() {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return function(date) { 
            var m = date.getMonth();

            return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
        };
    }()),

    
    
    getSuffix : function(date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    },
    

    
    clone : function(date) {
        return new Date(date.getTime());
    },

    
    isDST : function(date) {
        
        
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },

    
    clearTime : function(date, clone) {
        if (clone) {
            return Ext.Date.clearTime(Ext.Date.clone(date));
        }

        
        var d = date.getDate(),
            hr,
            c;

        
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (date.getDate() != d) { 
            
            

            
            for (hr = 1, c = utilDate.add(date, Ext.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Ext.Date.HOUR, hr));

            date.setDate(d);
            date.setHours(c.getHours());
        }

        return date;
    },

    
    add : function(date, interval, value) {
        var d = Ext.Date.clone(date),
            Date = Ext.Date,
            day;
        if (!interval || value === 0) {
            return d;
        }

        switch(interval.toLowerCase()) {
            case Ext.Date.MILLI:
                d.setMilliseconds(d.getMilliseconds() + value);
                break;
            case Ext.Date.SECOND:
                d.setSeconds(d.getSeconds() + value);
                break;
            case Ext.Date.MINUTE:
                d.setMinutes(d.getMinutes() + value);
                break;
            case Ext.Date.HOUR:
                d.setHours(d.getHours() + value);
                break;
            case Ext.Date.DAY:
                d.setDate(d.getDate() + value);
                break;
            case Ext.Date.MONTH:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.MONTH, value)).getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case Ext.Date.YEAR:
                day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.YEAR, value)).getDate());
                }
                d.setDate(day);
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    },

    
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

    
    compat: function() {
        var nativeDate = window.Date,
            p, u,
            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'],
            sLen    = statics.length,
            pLen    = proto.length,
            stat, prot, s;

        
        for (s = 0; s < sLen; s++) {
            stat = statics[s];
            nativeDate[stat] = utilDate[stat];
        }

        
        for (p = 0; p < pLen; p++) {
            prot = proto[p];
            nativeDate.prototype[prot] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return utilDate[prot].apply(utilDate, args);
            };
        }
    }
};

var utilDate = Ext.Date;

}());

//@tag foundation,core

//@require ../lang/Date.js



(function(flexSetter) {

var noArgs = [],
    Base = function(){};

    
    Ext.apply(Base, {
        $cl***REMOVED***Name: 'Ext.Base',

        $isCl***REMOVED***: true,

        
        create: function() {
            return Ext.create.apply(Ext, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        
        extend: function(parent) {
            var parentPrototype = parent.prototype,
                basePrototype, prototype, i, ln, name, statics;

            prototype = this.prototype = Ext.Object.chain(parentPrototype);
            prototype.self = this;

            this.supercl***REMOVED*** = prototype.supercl***REMOVED*** = parentPrototype;

            if (!parent.$isCl***REMOVED***) {
                basePrototype = Ext.Base.prototype;

                for (i in basePrototype) {
                    if (i in prototype) {
                        prototype[i] = basePrototype[i];
                    }
                }
            }

            
            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0,ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }

            prototype.config = new prototype.configCl***REMOVED***();
            prototype.initConfigList = prototype.initConfigList.slice();
            prototype.initConfigMap = Ext.clone(prototype.initConfigMap);
            prototype.configMap = Ext.Object.chain(prototype.configMap);
        },

        
        $onExtended: [],

        
        triggerExtended: function() {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        
        onExtended: function(fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        
        addConfig: function(config, fullMerge) {
            var prototype = this.prototype,
                configNameCache = Ext.Cl***REMOVED***.configNameCache,
                hasConfig = prototype.configMap,
                initConfigList = prototype.initConfigList,
                initConfigMap = prototype.initConfigMap,
                defaultConfig = prototype.config,
                initializedName, name, value;

            for (name in config) {
                if (config.hasOwnProperty(name)) {
                    if (!hasConfig[name]) {
                        hasConfig[name] = true;
                    }

                    value = config[name];

                    initializedName = configNameCache[name].initialized;

                    if (!initConfigMap[name] && value !== null && !prototype[initializedName]) {
                        initConfigMap[name] = true;
                        initConfigList.push(name);
                    }
                }
            }

            if (fullMerge) {
                Ext.merge(defaultConfig, config);
            }
            else {
                Ext.mergeIf(defaultConfig, config);
            }

            prototype.configCl***REMOVED*** = Ext.Object.cl***REMOVED***ify(defaultConfig);
        },

        
        addStatics: function(members) {
            var member, name;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function' && !member.$isCl***REMOVED*** && member !== Ext.emptyFn && member !== Ext.identityFn) {
                        member.$owner = this;
                        member.$name = name;
                    }
                    this[name] = member;
                }
            }

            return this;
        },

        
        addInheritableStatics: function(members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        
        addMembers: function(members) {
            var prototype = this.prototype,
                enumerables = Ext.enumerables,
                names = [],
                i, ln, name, member;

            for (name in members) {
                names.push(name);
            }

            if (enumerables) {
                names.push.apply(names, enumerables);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];

                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isCl***REMOVED*** && member !== Ext.emptyFn) {
                        member.$owner = this;
                        member.$name = name;
                    }

                    prototype[name] = member;
                }
            }

            return this;
        },

        
        addMember: function(name, member) {
            if (typeof member == 'function' && !member.$isCl***REMOVED*** && member !== Ext.emptyFn) {
                member.$owner = this;
                member.$name = name;
            }

            this.prototype[name] = member;

            return this;
        },

        
        implement: function() {
            this.addMembers.apply(this, arguments);
        },

        
        borrow: function(fromCl***REMOVED***, members) {
            var prototype = this.prototype,
                fromPrototype = fromCl***REMOVED***.prototype,
                i, ln, name, fn, toBorrow;

            members = Ext.Array.from(members);

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = Ext.Function.clone(toBorrow);


                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        
        override: function(members) {
            var me = this,
                enumerables = Ext.enumerables,
                target = me.prototype,
                cloneFunction = Ext.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = []; 
                statics = null; 

                for (name in members) { 
                    if (name == 'statics') {
                        statics = members[name];
                    } else if (name == 'config') {
                        me.addConfig(members[name], true);
                    } else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--; ) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$cl***REMOVED***Name && member !== Ext.emptyFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }


                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me; 
                members = statics; 
            } while (members);

            return this;
        },

        
        callParent: function(args) {
            var method;

            
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.supercl***REMOVED***.self[method.$name])).apply(this, args || noArgs);
        },

        
        callSuper: function(args) {
            var method;

            
            return (method = this.callSuper.caller) &&
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.supercl***REMOVED***.self[method.$name]).apply(this, args || noArgs);
        },

        
        mixin: function(name, mixinCl***REMOVED***) {
            var mixin = mixinCl***REMOVED***.prototype,
                prototype = this.prototype,
                key;

            if (typeof mixin.onCl***REMOVED***MixedIn != 'undefined') {
                mixin.onCl***REMOVED***MixedIn.call(mixinCl***REMOVED***, this);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Ext.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                if (key === 'mixins') {
                    Ext.merge(prototype.mixins, mixin[key]);
                }
                else if (typeof prototype[key] == 'undefined' && key != 'mixinId' && key != 'config') {
                    prototype[key] = mixin[key];
                }
            }

            if ('config' in mixin) {
                this.addConfig(mixin.config, false);
            }

            prototype.mixins[name] = mixin;
        },

        
        getName: function() {
            return Ext.getCl***REMOVED***Name(this);
        },

        
        createAlias: flexSetter(function(alias, origin) {
            this.override(alias, function() {
                return this[origin].apply(this, arguments);
            });
        }),

        
        addXtype: function(xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Ext.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Ext.Cl***REMOVED***Manager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({
        
        isInstance: true,

        
        $cl***REMOVED***Name: 'Ext.Base',

        
        configCl***REMOVED***: Ext.emptyFn,

        
        initConfigList: [],

        
        configMap: {},

        
        initConfigMap: {},

        
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        
        callParent: function(args) {
            
            
            
            
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                        ((method = method.$owner ? method : method.caller) &&
                                method.$owner.supercl***REMOVED***[method.$name]));


            return superMethod.apply(this, args || noArgs);
        },

        
        callSuper: function(args) {
            
            
            
            
            var method,
                superMethod = (method = this.callSuper.caller) &&
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.supercl***REMOVED***[method.$name]);


            return superMethod.apply(this, args || noArgs);
        },

        
        self: Base,

        
        constructor: function() {
            return this;
        },

        
        initConfig: function(config) {
            var instanceConfig = config,
                configNameCache = Ext.Cl***REMOVED***.configNameCache,
                defaultConfig = new this.configCl***REMOVED***(),
                defaultConfigList = this.initConfigList,
                hasConfig = this.configMap,
                nameMap, i, ln, name, initializedName;

            this.initConfig = Ext.emptyFn;

            this.initialConfig = instanceConfig || {};

            this.config = config = (instanceConfig) ? Ext.merge(defaultConfig, config) : defaultConfig;

            if (instanceConfig) {
                defaultConfigList = defaultConfigList.slice();

                for (name in instanceConfig) {
                    if (hasConfig[name]) {
                        if (instanceConfig[name] !== null) {
                            defaultConfigList.push(name);
                            this[configNameCache[name].initialized] = false;
                        }
                    }
                }
            }

            for (i = 0,ln = defaultConfigList.length; i < ln; i++) {
                name = defaultConfigList[i];
                nameMap = configNameCache[name];
                initializedName = nameMap.initialized;

                if (!this[initializedName]) {
                    this[initializedName] = true;
                    this[nameMap.set].call(this, config[name]);
                }
            }

            return this;
        },

        
        hasConfig: function(name) {
            return Boolean(this.configMap[name]);
        },

        
        setConfig: function(config, applyIfNotSet) {
            if (!config) {
                return this;
            }

            var configNameCache = Ext.Cl***REMOVED***.configNameCache,
                currentConfig = this.config,
                hasConfig = this.configMap,
                initialConfig = this.initialConfig,
                name, value;

            applyIfNotSet = Boolean(applyIfNotSet);

            for (name in config) {
                if (applyIfNotSet && initialConfig.hasOwnProperty(name)) {
                    continue;
                }

                value = config[name];
                currentConfig[name] = value;

                if (hasConfig[name]) {
                    this[configNameCache[name].set](value);
                }
            }

            return this;
        },

        
        getConfig: function(name) {
            var configNameCache = Ext.Cl***REMOVED***.configNameCache;

            return this[configNameCache[name].get]();
        },

        
        getInitialConfig: function(name) {
            var config = this.config;

            if (!name) {
                return config;
            }
            else {
                return config[name];
            }
        },

        
        onConfigUpdate: function(names, callback, scope) {
            var self = this.self,
                i, ln, name,
                updaterName, updater, newUpdater;

            names = Ext.Array.from(names);

            scope = scope || this;

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                updaterName = 'update' + Ext.String.capitalize(name);
                updater = this[updaterName] || Ext.emptyFn;
                newUpdater = function() {
                    updater.apply(this, arguments);
                    scope[callback].apply(scope, arguments);
                };
                newUpdater.$name = updaterName;
                newUpdater.$owner = self;

                this[updaterName] = newUpdater;
            }
        },

        
        destroy: function() {
            this.destroy = Ext.emptyFn;
        }
    });

    
    Base.prototype.callOverridden = Base.prototype.callParent;

    Ext.Base = Base;

}(Ext.Function.flexSetter));

//@tag foundation,core

//@require Base.js



(function() {
    var ExtCl***REMOVED***,
        Base = Ext.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    
    function makeCtor (cl***REMOVED***Name) {
        function constructor () {
            
            
            return this.constructor.apply(this, arguments) || null;
        }
        return constructor;
    }

    
    Ext.Cl***REMOVED*** = ExtCl***REMOVED*** = function(Cl***REMOVED***, data, onCreated) {
        if (typeof Cl***REMOVED*** != 'function') {
            onCreated = data;
            data = Cl***REMOVED***;
            Cl***REMOVED*** = null;
        }

        if (!data) {
            data = {};
        }

        Cl***REMOVED*** = ExtCl***REMOVED***.create(Cl***REMOVED***, data);

        ExtCl***REMOVED***.process(Cl***REMOVED***, data, onCreated);

        return Cl***REMOVED***;
    };

    Ext.apply(ExtCl***REMOVED***, {
        
        onBeforeCreated: function(Cl***REMOVED***, data, hooks) {
            Cl***REMOVED***.addMembers(data);

            hooks.onCreated.call(Cl***REMOVED***, Cl***REMOVED***);
        },

        
        create: function(Cl***REMOVED***, data) {
            var name, i;

            if (!Cl***REMOVED***) {
                Cl***REMOVED*** = makeCtor(
                );
            }

            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Cl***REMOVED***[name] = Base[name];
            }

            return Cl***REMOVED***;
        },

        
        process: function(Cl***REMOVED***, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtCl***REMOVED***.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty, process;

            delete data.preprocessors;

            for (i = 0,ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    }
                    else if (preprocessorsProperties) {
                        for (j = 0,subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Ext.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Cl***REMOVED***, data, hooks);
        },
        
        doProcess: function(Cl***REMOVED***, data, hooks){
            var me = this,
                preprocessor = hooks.preprocessors.shift();

            if (!preprocessor) {
                hooks.onBeforeCreated.apply(me, arguments);
                return;
            }

            if (preprocessor.call(me, Cl***REMOVED***, data, hooks, me.doProcess) !== false) {
                me.doProcess(Cl***REMOVED***, data, hooks);
            }
        },

        
        preprocessors: {},

        
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPreprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        
        getPreprocessors: function() {
            return this.preprocessors;
        },

        
        defaultPreprocessors: [],

        
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors;
        },

        
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        configNameCache: {},

        getConfigNameMap: function(name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

                map = cache[name] = {
                    internal: name,
                    initialized: '_is' + capitalizedName + 'Initialized',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    'set': 'set' + capitalizedName,
                    'get': 'get' + capitalizedName,
                    doSet : 'doSet' + capitalizedName,
                    changeEvent: name.toLowerCase() + 'change'
                };
            }

            return map;
        }
    });

    
    ExtCl***REMOVED***.registerPreprocessor('extend', function(Cl***REMOVED***, data) {
        var Base = Ext.Base,
            basePrototype = Base.prototype,
            extend = data.extend,
            Parent, parentPrototype, i;

        delete data.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        }
        else {
            Parent = Base;
        }

        parentPrototype = Parent.prototype;

        if (!Parent.$isCl***REMOVED***) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Cl***REMOVED***.extend(Parent);

        Cl***REMOVED***.triggerExtended.apply(Cl***REMOVED***, arguments);

        if (data.onCl***REMOVED***Extended) {
            Cl***REMOVED***.onExtended(data.onCl***REMOVED***Extended, Cl***REMOVED***);
            delete data.onCl***REMOVED***Extended;
        }

    }, true);

    
    ExtCl***REMOVED***.registerPreprocessor('statics', function(Cl***REMOVED***, data) {
        Cl***REMOVED***.addStatics(data.statics);

        delete data.statics;
    });

    
    ExtCl***REMOVED***.registerPreprocessor('inheritableStatics', function(Cl***REMOVED***, data) {
        Cl***REMOVED***.addInheritableStatics(data.inheritableStatics);

        delete data.inheritableStatics;
    });

    
    ExtCl***REMOVED***.registerPreprocessor('config', function(Cl***REMOVED***, data) {
        var config = data.config,
            prototype = Cl***REMOVED***.prototype;

        delete data.config;

        Ext.Object.each(config, function(name, value) {
            var nameMap = ExtCl***REMOVED***.getConfigNameMap(name),
                internalName = nameMap.internal,
                initializedName = nameMap.initialized,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setName = nameMap.set,
                getName = nameMap.get,
                hasOwnSetter = (setName in prototype) || data.hasOwnProperty(setName),
                hasOwnApplier = (applyName in prototype) || data.hasOwnProperty(applyName),
                hasOwnUpdater = (updateName in prototype) || data.hasOwnProperty(updateName),
                optimizedGetter, customGetter;

            if (value === null || (!hasOwnSetter && !hasOwnApplier && !hasOwnUpdater)) {
                prototype[internalName] = value;
                prototype[initializedName] = true;
            }
            else {
                prototype[initializedName] = false;
            }

            if (!hasOwnSetter) {
                data[setName] = function(value) {
                    var oldValue = this[internalName],
                        applier = this[applyName],
                        updater = this[updateName];

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                    }

                    if (applier) {
                        value = applier.call(this, value, oldValue);
                    }

                    if (typeof value != 'undefined') {
                        this[internalName] = value;

                        if (updater && value !== oldValue) {
                            updater.call(this, value, oldValue);
                        }
                    }

                    return this;
                };
            }

            if (!(getName in prototype) || data.hasOwnProperty(getName)) {
                customGetter = data[getName] || false;

                if (customGetter) {
                    optimizedGetter = function() {
                        return customGetter.apply(this, arguments);
                    };
                }
                else {
                    optimizedGetter = function() {
                        return this[internalName];
                    };
                }

                data[getName] = function() {
                    var currentGetter;

                    if (!this[initializedName]) {
                        this[initializedName] = true;
                        this[setName](this.config[name]);
                    }

                    currentGetter = this[getName];

                    if ('$previous' in currentGetter) {
                        currentGetter.$previous = optimizedGetter;
                    }
                    else {
                        this[getName] = optimizedGetter;
                    }

                    return optimizedGetter.apply(this, arguments);
                };
            }
        });

        Cl***REMOVED***.addConfig(config, true);
    });

    
    ExtCl***REMOVED***.registerPreprocessor('mixins', function(Cl***REMOVED***, data, hooks) {
        var mixins = data.mixins,
            name, mixin, i, ln;

        delete data.mixins;

        Ext.Function.interceptBefore(hooks, 'onCreated', function() {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$cl***REMOVED***Name;

                    Cl***REMOVED***.mixin(name, mixin);
                }
            }
            else {
                for (var mixinName in mixins) {
                    if (mixins.hasOwnProperty(mixinName)) {
                        Cl***REMOVED***.mixin(mixinName, mixins[mixinName]);
                    }
                }
            }
        });
    });

    
    Ext.extend = function(Cl***REMOVED***, Parent, members) {
        if (arguments.length === 2 && Ext.isObject(Parent)) {
            members = Parent;
            Parent = Cl***REMOVED***;
            Cl***REMOVED*** = null;
        }

        var cls;

        if (!Parent) {
            throw new Error("[Ext.extend] Attempting to extend from a cl***REMOVED*** which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = [
            'extend'
            ,'statics'
            ,'inheritableStatics'
            ,'mixins'
            ,'config'
        ];

        if (Cl***REMOVED***) {
            cls = new ExtCl***REMOVED***(Cl***REMOVED***, members);
            
            cls.prototype.constructor = Cl***REMOVED***;
        } else {
            cls = new ExtCl***REMOVED***(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };

}());

//@tag foundation,core

//@require Cl***REMOVED***.js



(function(Cl***REMOVED***, alias, arraySlice, arrayFrom, global) {

    
    function makeCtor () {
        function constructor () {
            
            
            return this.constructor.apply(this, arguments) || null;
        }
        return constructor;
    }

    var Manager = Ext.Cl***REMOVED***Manager = {

        
        cl***REMOVED***es: {},

        
        existCache: {},

        
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {}
        },

        
        enableNamespaceParseCache: true,

        
        namespaceParseCache: {},

        
        instantiators: [],

        
        isCreated: function(cl***REMOVED***Name) {
            var existCache = this.existCache,
                i, ln, part, root, parts;


            if (this.cl***REMOVED***es[cl***REMOVED***Name] || existCache[cl***REMOVED***Name]) {
                return true;
            }

            root = global;
            parts = this.parseNamespace(cl***REMOVED***Name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            existCache[cl***REMOVED***Name] = true;

            this.triggerCreated(cl***REMOVED***Name);

            return true;
        },

        
        createdListeners: [],

        
        nameCreatedListeners: {},

        
        triggerCreated: function(cl***REMOVED***Name) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                alternateNames = this.maps.nameToAlternates[cl***REMOVED***Name],
                names = [cl***REMOVED***Name],
                i, ln, j, subLn, listener, name;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, cl***REMOVED***Name);
            }

            if (alternateNames) {
                names.push.apply(names, alternateNames);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                listeners = nameListeners[name];

                if (listeners) {
                    for (j = 0,subLn = listeners.length; j < subLn; j++) {
                        listener = listeners[j];
                        listener.fn.call(listener.scope, name);
                    }
                    delete nameListeners[name];
                }
            }
        },

        
        onCreated: function(fn, scope, cl***REMOVED***Name) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (cl***REMOVED***Name) {
                if (this.isCreated(cl***REMOVED***Name)) {
                    fn.call(scope, cl***REMOVED***Name);
                    return;
                }

                if (!nameListeners[cl***REMOVED***Name]) {
                    nameListeners[cl***REMOVED***Name] = [];
                }

                nameListeners[cl***REMOVED***Name].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        
        parseNamespace: function(namespace) {

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        
        setNamespace: function(name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        
        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        
        set: function(name, value) {
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.cl***REMOVED***es[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        
        get: function(name) {
            var cl***REMOVED***es = this.cl***REMOVED***es,
                root,
                parts,
                part, i, ln;

            if (cl***REMOVED***es[name]) {
                return cl***REMOVED***es[name];
            }

            root = global;
            parts = this.parseNamespace(name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                cl***REMOVED***Name;

            if (typeof cls == 'string') {
                cl***REMOVED***Name = cls;
            } else {
                cl***REMOVED***Name = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== cl***REMOVED***Name) {

                aliasToNameMap[alias] = cl***REMOVED***Name;
            }

            if (!nameToAliasesMap[cl***REMOVED***Name]) {
                nameToAliasesMap[cl***REMOVED***Name] = [];
            }

            if (alias) {
                Ext.Array.include(nameToAliasesMap[cl***REMOVED***Name], alias);
            }

            return this;
        },

        
        addNameAliasMappings: function(aliases){
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                cl***REMOVED***Name, aliasList, alias, i;

            for (cl***REMOVED***Name in aliases) {
                aliasList = nameToAliasesMap[cl***REMOVED***Name] ||
                    (nameToAliasesMap[cl***REMOVED***Name] = []);

                for (i = 0; i < aliases[cl***REMOVED***Name].length; i++) {
                    alias = aliases[cl***REMOVED***Name][i];
                    if (!aliasToNameMap[alias]) {
                        aliasToNameMap[alias] = cl***REMOVED***Name;
                        aliasList.push(alias);
                    }
                }

            }
            return this;
        },

        
        addNameAlternateMappings: function(alternates) {
            var alternateToName = this.maps.alternateToName,
                nameToAlternates = this.maps.nameToAlternates,
                cl***REMOVED***Name, aliasList, alternate, i;

            for (cl***REMOVED***Name in alternates) {
                aliasList = nameToAlternates[cl***REMOVED***Name] ||
                    (nameToAlternates[cl***REMOVED***Name] = []);

                for (i  = 0; i < alternates[cl***REMOVED***Name].length; i++) {
                    alternate = alternates[cl***REMOVED***Name];
                    if (!alternateToName[alternate]) {
                        alternateToName[alternate] = cl***REMOVED***Name;
                        aliasList.push(alternate);
                    }
                }

            }
            return this;
        },

        
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        
        getName: function(object) {
            return object && object.$cl***REMOVED***Name || '';
        },

        
        getCl***REMOVED***: function(object) {
            return object && object.self || null;
        },

        
        create: function(cl***REMOVED***Name, data, createdFn) {

            var ctor = makeCtor();
            if (typeof data == 'function') {
                data = data(ctor);
            }


            data.$cl***REMOVED***Name = cl***REMOVED***Name;

            return new Cl***REMOVED***(ctor, data, function() {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    postprocessors = [],
                    postprocessor, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0,ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0,subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                data.postprocessors = postprocessors;
                data.createdFn = createdFn;
                Manager.processCreate(cl***REMOVED***Name, this, data);
            });
        },
        
        processCreate: function(cl***REMOVED***Name, cls, clsData){
            var me = this,
                postprocessor = clsData.postprocessors.shift(),
                createdFn = clsData.createdFn;

            if (!postprocessor) {
                if (cl***REMOVED***Name) {
                    me.set(cl***REMOVED***Name, cls);
                }

                if (createdFn) {
                    createdFn.call(cls, cls);
                }

                if (cl***REMOVED***Name) {
                    me.triggerCreated(cl***REMOVED***Name);
                }
                return;
            }

            if (postprocessor.call(me, cl***REMOVED***Name, cls, clsData, me.processCreate) !== false) {
                me.processCreate(cl***REMOVED***Name, cls, clsData);
            }
        },

        createOverride: function (cl***REMOVED***Name, data, createdFn) {
            var me = this,
                overriddenCl***REMOVED***Name = data.override,
                requires = data.requires,
                uses = data.uses,
                cl***REMOVED***Ready = function () {
                    var cls, temp;

                    if (requires) {
                        temp = requires;
                        requires = null; 

                        
                        
                        
                        Ext.Loader.require(temp, cl***REMOVED***Ready);
                    } else {
                        
                        
                        cls = me.get(overriddenCl***REMOVED***Name);

                        
                        delete data.override;
                        delete data.requires;
                        delete data.uses;

                        Ext.override(cls, data);

                        
                        
                        
                        me.triggerCreated(cl***REMOVED***Name);

                        if (uses) {
                            Ext.Loader.addUsedCl***REMOVED***es(uses); 
                        }

                        if (createdFn) {
                            createdFn.call(cls); 
                        }
                    }
                };

            me.existCache[cl***REMOVED***Name] = true;

            
            me.onCreated(cl***REMOVED***Ready, me, overriddenCl***REMOVED***Name);
 
            return me;
        },

        
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                cl***REMOVED***Name = this.getNameByAlias(alias);

            if (!cl***REMOVED***Name) {
                cl***REMOVED***Name = this.maps.aliasToName[alias];



                Ext.syncRequire(cl***REMOVED***Name);
            }

            args[0] = cl***REMOVED***Name;

            return this.instantiate.apply(this, args);
        },

        
        instantiate: function() {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (nameType != 'function') {
                if (nameType != 'string' && args.length === 0) {
                    args = [name];
                    name = name.xcl***REMOVED***;
                }


                cls = this.get(name);
            }
            else {
                cls = name;
            }

            
            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            
            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            
            if (!cls) {

                Ext.syncRequire(name);

                cls = this.get(name);
            }


            return this.getInstantiator(args.length)(cls, args);
        },

        
        dynInstantiate: function(name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        
        getInstantiator: function(length) {
            var instantiators = this.instantiators,
                instantiator,
                i,
                args;

            instantiator = instantiators[length];

            if (!instantiator) {
                i = length;
                args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
            }

            return instantiator;
        },

        
        postprocessors: {},

        
        defaultPostprocessors: [],

        
        registerPostprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPostprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);

            return this;
        },

        
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;


            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        }
                        else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];

                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }

            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }
    };

    
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            this.setAlias(cls, alias);
        }

    }, ['xtype', 'alias']);

    
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });

    
    Manager.registerPostprocessor('alternateCl***REMOVED***Name', function(name, cls, data) {
        var alternates = data.alternateCl***REMOVED***Name,
            i, ln, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }

        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];


            this.set(alternate, cls);
        }
    });

    Ext.apply(Ext, {
        
        create: alias(Manager, 'instantiate'),

        
        widget: function(name, config) {
            
            
            
            
            
            
            
            var xtype = name,
                alias, cl***REMOVED***Name, T, load;

            if (typeof xtype != 'string') { 
                
                config = name; 
                xtype = config.xtype;
            } else {
                config = config || {};
            }
            
            if (config.isComponent) {
                return config;
            }

            alias = 'widget.' + xtype;
            cl***REMOVED***Name = Manager.getNameByAlias(alias);

            
            if (!cl***REMOVED***Name) {
                load = true;
            }
            
            T = Manager.get(cl***REMOVED***Name);
            if (load || !T) {
                return Manager.instantiateByAlias(alias, config);
            }
            return new T(config);
        },

        
        createByAlias: alias(Manager, 'instantiateByAlias'),

        
        define: function (cl***REMOVED***Name, data, createdFn) {
            if (data.override) {
                return Manager.createOverride.apply(Manager, arguments);
            }

            return Manager.create.apply(Manager, arguments);
        },

        
        getCl***REMOVED***Name: alias(Manager, 'getName'),

        
        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$cl***REMOVED***) {
                    return Ext.getCl***REMOVED***Name(object.$cl***REMOVED***) + '#' + object.$name;
                }

                if (object.$cl***REMOVED***Name) {
                    return object.$cl***REMOVED***Name;
                }
            }

            return 'Anonymous';
        },

        
        getCl***REMOVED***: alias(Manager, 'getCl***REMOVED***'),

        
        namespace: alias(Manager, 'createNamespaces')
    });

    
    Ext.createWidget = Ext.widget;

    
    Ext.ns = Ext.namespace;

    Cl***REMOVED***.registerPreprocessor('cl***REMOVED***Name', function(cls, data) {
        if (data.$cl***REMOVED***Name) {
            cls.$cl***REMOVED***Name = data.$cl***REMOVED***Name;
        }
    }, true, 'first');

    Cl***REMOVED***.registerPreprocessor('alias', function(cls, data) {
        var prototype = cls.prototype,
            xtypes = arrayFrom(data.xtype),
            aliases = arrayFrom(data.alias),
            widgetPrefix = 'widget.',
            widgetPrefixLength = widgetPrefix.length,
            xtypesChain = Array.prototype.slice.call(prototype.xtypesChain || []),
            xtypesMap = Ext.merge({}, prototype.xtypesMap || {}),
            i, ln, alias, xtype;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];


            if (alias.substring(0, widgetPrefixLength) === widgetPrefix) {
                xtype = alias.substring(widgetPrefixLength);
                Ext.Array.include(xtypes, xtype);
            }
        }

        cls.xtype = data.xtype = xtypes[0];
        data.xtypes = xtypes;

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypesChain.push(xtype);
            }
        }

        data.xtypesChain = xtypesChain;
        data.xtypesMap = xtypesMap;

        Ext.Function.interceptAfter(data, 'onCl***REMOVED***Created', function() {
            var mixins = prototype.mixins,
                key, mixin;

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    mixin = mixins[key];

                    xtypes = mixin.xtypes;

                    if (xtypes) {
                        for (i = 0,ln = xtypes.length; i < ln; i++) {
                            xtype = xtypes[i];

                            if (!xtypesMap[xtype]) {
                                xtypesMap[xtype] = true;
                                xtypesChain.push(xtype);
                            }
                        }
                    }
                }
            }
        });

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];


            Ext.Array.include(aliases, widgetPrefix + xtype);
        }

        data.alias = aliases;

    }, ['xtype', 'alias']);

}(Ext.Cl***REMOVED***, Ext.Function.alias, Array.prototype.slice, Ext.Array.from, Ext.global));

//@tag foundation,core

//@require Cl***REMOVED***Manager.js

//@define Ext.Loader




Ext.Loader = new function() {
    var Loader = this,
        Manager = Ext.Cl***REMOVED***Manager,
        Cl***REMOVED*** = Ext.Cl***REMOVED***,
        flexSetter = Ext.Function.flexSetter,
        alias = Ext.Function.alias,
        p***REMOVED*** = Ext.Function.p***REMOVED***,
        defer = Ext.Function.defer,
        arrayErase = Ext.Array.erase,
        dependencyProperties = ['extend', 'mixins', 'requires'],
        isInHistory = {},
        history = [],
        slashDotSlashRe = /\/\.\//g,
        dotRe = /\./g;

    Ext.apply(Loader, {

        
        isInHistory: isInHistory,

        
        history: history,

        
        config: {
            
            enabled: false,

            
            scriptChainDelay : false,

            
            disableCaching: true,

            
            disableCachingParam: '_dc',

            
            garbageCollect : false,

            
            paths: {
                'Ext': '.'
            },

            
            preserveScripts : true,

            
            scriptCharset : undefined
        },

        
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.merge(Loader.config, name);
            }
            else {
                Loader.config[name] = (Ext.isObject(value)) ? Ext.merge(Loader.config[name], value) : value;
            }

            return Loader;
        },

        
        getConfig: function(name) {
            if (name) {
                return Loader.config[name];
            }

            return Loader.config;
        },

        
        setPath: flexSetter(function(name, path) {
            Loader.config.paths[name] = path;

            return Loader;
        }),

        
        addCl***REMOVED***PathMappings: function(paths) {
            var name;

            for(name in paths){
                Loader.config.paths[name] = paths[name];
            }
            return Loader;
        },

        
        getPath: function(cl***REMOVED***Name) {
            var path = '',
                paths = Loader.config.paths,
                prefix = Loader.getPrefix(cl***REMOVED***Name);

            if (prefix.length > 0) {
                if (prefix === cl***REMOVED***Name) {
                    return paths[prefix];
                }

                path = paths[prefix];
                cl***REMOVED***Name = cl***REMOVED***Name.substring(prefix.length + 1);
            }

            if (path.length > 0) {
                path += '/';
            }

            return path.replace(slashDotSlashRe, '/') + cl***REMOVED***Name.replace(dotRe, "/") + '.js';
        },

        
        getPrefix: function(cl***REMOVED***Name) {
            var paths = Loader.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(cl***REMOVED***Name)) {
                return cl***REMOVED***Name;
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === cl***REMOVED***Name.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            return deepestPrefix;
        },

        
        isACl***REMOVED***NameWithAKnownPrefix: function(cl***REMOVED***Name) {
            var prefix = Loader.getPrefix(cl***REMOVED***Name);

            
            return prefix !== '' && prefix !== cl***REMOVED***Name;
        },

        
        require: function(expressions, fn, scope, excludes) {
            if (fn) {
                fn.call(scope);
            }
        },

        
        syncRequire: function() {},

        
        exclude: function(excludes) {
            return {
                require: function(expressions, fn, scope) {
                    return Loader.require(expressions, fn, scope, excludes);
                },

                syncRequire: function(expressions, fn, scope) {
                    return Loader.syncRequire(expressions, fn, scope, excludes);
                }
            };
        },

        
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            fn.call(scope);
        }
    });

    var queue = [],
        isCl***REMOVED***FileLoaded = {},
        isFileLoaded = {},
        cl***REMOVED***NameToFilePathMap = {},
        scriptElements = {},
        readyListeners = [],
        usedCl***REMOVED***es = [],
        requiresMap = {};

    Ext.apply(Loader, {
        
        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        
        isLoading: false,

        
        queue: queue,

        
        isCl***REMOVED***FileLoaded: isCl***REMOVED***FileLoaded,

        
        isFileLoaded: isFileLoaded,

        
        readyListeners: readyListeners,

        
        optionalRequires: usedCl***REMOVED***es,

        
        requiresMap: requiresMap,

        
        numPendingFiles: 0,

        
        numLoadedFiles: 0,

        
        hasFileLoadError: false,

        
        cl***REMOVED***NameToFilePathMap: cl***REMOVED***NameToFilePathMap,

        
        scriptsLoading: 0,

        
        syncModeEnabled: false,

        scriptElements: scriptElements,

        
        refreshQueue: function() {
            var ln = queue.length,
                i, item, j, requires;

            

            if (!ln && !Loader.scriptsLoading) {
                return Loader.triggerReady();
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;

                    
                    
                    if (requires.length > Loader.numLoadedFiles) {
                        continue;
                    }

                    
                    for (j = 0; j < requires.length; ) {
                        if (Manager.isCreated(requires[j])) {
                            
                            arrayErase(requires, j, 1);
                        }
                        else {
                            j++;
                        }
                    }

                    
                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.call(item.scope);
                        Loader.refreshQueue();
                        break;
                    }
                }
            }

            return Loader;
        },

        
        injectScriptElement: function(url, onLoad, onError, scope, charset) {
            var script = document.createElement('script'),
                dispatched = false,
                config = Loader.config,
                onLoadFn = function() {

                    if(!dispatched) {
                        dispatched = true;
                        script.onload = script.onreadystatechange = script.onerror = null;
                        if (typeof config.scriptChainDelay == 'number') {
                            
                            defer(onLoad, config.scriptChainDelay, scope);
                        } else {
                            onLoad.call(scope);
                        }
                        Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                    }

                },
                onErrorFn = function(arg) {
                    defer(onError, 1, scope);   
                    Loader.cleanupScriptElement(script, config.preserveScripts === false, config.garbageCollect);
                };

            script.type = 'text/javascript';
            script.onerror = onErrorFn;
            charset = charset || config.scriptCharset;
            if (charset) {
                script.charset = charset;
            }

            
            if ('addEventListener' in script ) {
                script.onload = onLoadFn;
            } else if ('readyState' in script) {   
                script.onreadystatechange = function() {
                    if ( this.readyState == 'loaded' || this.readyState == 'complete' ) {
                        onLoadFn();
                    }
                };
            } else {
                 script.onload = onLoadFn;
            }

            script.src = url;
            (Loader.documentHead || document.getElementsByTagName('head')[0]).appendChild(script);

            return script;
        },

        
        removeScriptElement: function(url) {
            if (scriptElements[url]) {
                Loader.cleanupScriptElement(scriptElements[url], true, !!Loader.getConfig('garbageCollect'));
                delete scriptElements[url];
            }

            return Loader;
        },

        
        cleanupScriptElement: function(script, remove, collect) {
            var prop;
            script.onload = script.onreadystatechange = script.onerror = null;
            if (remove) {
                Ext.removeNode(script);       
                if (collect) {
                    for (prop in script) {
                        try {
                            script[prop] = null;
                            delete script[prop];      
                        } catch (cleanEx) {
                            
                        }
                    }
                }
            }

            return Loader;
        },

        
        loadScript: function (options) {
            var config = Loader.getConfig(),
                isString = typeof options == 'string',
                url = isString ? options : options.url,
                onError = !isString && options.onError,
                onLoad = !isString && options.onLoad,
                scope = !isString && options.scope,
                onScriptError = function() {
                    Loader.numPendingFiles--;
                    Loader.scriptsLoading--;

                    if (onError) {
                        onError.call(scope, "Failed loading '" + url + "', please verify that the file exists");
                    }

                    if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                        Loader.refreshQueue();
                    }
                },
                onScriptLoad = function () {
                    Loader.numPendingFiles--;
                    Loader.scriptsLoading--;

                    if (onLoad) {
                        onLoad.call(scope);
                    }

                    if (Loader.numPendingFiles + Loader.scriptsLoading === 0) {
                        Loader.refreshQueue();
                    }
                },
                src;

            Loader.isLoading = true;
            Loader.numPendingFiles++;
            Loader.scriptsLoading++;

            src = config.disableCaching ?
                (url + '?' + config.disableCachingParam + '=' + Ext.Date.now()) : url;

            scriptElements[url] = Loader.injectScriptElement(src, onScriptLoad, onScriptError);
        },

        
        loadScriptFile: function(url, onLoad, onError, scope, synchronous) {
            if (isFileLoaded[url]) {
                return Loader;
            }

            var config = Loader.getConfig(),
                noCacheUrl = url + (config.disableCaching ? ('?' + config.disableCachingParam + '=' + Ext.Date.now()) : ''),
                isCrossOriginRestricted = false,
                xhr, status, onScriptError,
                debugSourceURL = "";

            scope = scope || Loader;

            Loader.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                };

                scriptElements[url] = Loader.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
            } else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                } catch (e) {
                    isCrossOriginRestricted = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && (self.location || {}).protocol == 'file:') ? 200 : xhr.status;

                isCrossOriginRestricted = isCrossOriginRestricted || (status === 0);

                if (isCrossOriginRestricted
                ) {
                }
                else if ((status >= 200 && status < 300) || (status === 304)
                ) {
                    
                    
                    if (!Ext.isIE) {
                        debugSourceURL = "\n//@ sourceURL=" + url;
                    }

                    Ext.globalEval(xhr.responseText + debugSourceURL);

                    onLoad.call(scope);
                }
                else {
                }

                
                xhr = null;
            }
        },

        
        syncRequire: function() {
            var syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                Loader.syncModeEnabled = true;
            }

            Loader.require.apply(Loader, arguments);

            if (!syncModeEnabled) {
                Loader.syncModeEnabled = false;
            }

            Loader.refreshQueue();
        },

        
        require: function(expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                excludedCl***REMOVED***Names = [],
                possibleCl***REMOVED***Names = [],
                cl***REMOVED***Names = [],
                references = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, cl***REMOVED***Name,
                possibleCl***REMOVED***Name, i, j, ln, subLn;

            if (excludes) {
                
                excludes = (typeof excludes === 'string') ? [ excludes ] : excludes;

                for (i = 0,ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];

                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedCl***REMOVED***Names = Manager.getNamesByExpression(exclude);

                        for (j = 0,subLn = excludedCl***REMOVED***Names.length; j < subLn; j++) {
                            excluded[excludedCl***REMOVED***Names[j]] = true;
                        }
                    }
                }
            }

            
            expressions = (typeof expressions === 'string') ? [ expressions ] : (expressions ? expressions : []);

            if (fn) {
                if (fn.length > 0) {
                    callback = function() {
                        var cl***REMOVED***es = [],
                            i, ln;

                        for (i = 0,ln = references.length; i < ln; i++) {
                            cl***REMOVED***es.push(Manager.get(references[i]));
                        }

                        return fn.apply(this, cl***REMOVED***es);
                    };
                }
                else {
                    callback = fn;
                }
            }
            else {
                callback = Ext.emptyFn;
            }

            scope = scope || Ext.global;

            for (i = 0,ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleCl***REMOVED***Names = Manager.getNamesByExpression(expression);
                    subLn = possibleCl***REMOVED***Names.length;

                    for (j = 0; j < subLn; j++) {
                        possibleCl***REMOVED***Name = possibleCl***REMOVED***Names[j];

                        if (excluded[possibleCl***REMOVED***Name] !== true) {
                            references.push(possibleCl***REMOVED***Name);

                            if (!Manager.isCreated(possibleCl***REMOVED***Name) && !included[possibleCl***REMOVED***Name]) {
                                included[possibleCl***REMOVED***Name] = true;
                                cl***REMOVED***Names.push(possibleCl***REMOVED***Name);
                            }
                        }
                    }
                }
            }

            
            
            if (cl***REMOVED***Names.length > 0) {
                if (!Loader.config.enabled) {
                    throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                             "Missing required cl***REMOVED***" + ((cl***REMOVED***Names.length > 1) ? "es" : "") + ": " + cl***REMOVED***Names.join(', '));
                }
            }
            else {
                callback.call(scope);
                return Loader;
            }

            syncModeEnabled = Loader.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: cl***REMOVED***Names.slice(), 
                                                  
                    callback: callback,
                    scope: scope
                });
            }

            ln = cl***REMOVED***Names.length;

            for (i = 0; i < ln; i++) {
                cl***REMOVED***Name = cl***REMOVED***Names[i];

                filePath = Loader.getPath(cl***REMOVED***Name);

                
                
                
                if (syncModeEnabled && isCl***REMOVED***FileLoaded.hasOwnProperty(cl***REMOVED***Name)) {
                    Loader.numPendingFiles--;
                    Loader.removeScriptElement(filePath);
                    delete isCl***REMOVED***FileLoaded[cl***REMOVED***Name];
                }

                if (!isCl***REMOVED***FileLoaded.hasOwnProperty(cl***REMOVED***Name)) {
                    isCl***REMOVED***FileLoaded[cl***REMOVED***Name] = false;

                    cl***REMOVED***NameToFilePathMap[cl***REMOVED***Name] = filePath;

                    Loader.numPendingFiles++;
                    Loader.loadScriptFile(
                        filePath,
                        p***REMOVED***(Loader.onFileLoaded, [cl***REMOVED***Name, filePath], Loader),
                        p***REMOVED***(Loader.onFileLoadError, [cl***REMOVED***Name, filePath], Loader),
                        Loader,
                        syncModeEnabled
                    );
                }
            }

            if (syncModeEnabled) {
                callback.call(scope);

                if (ln === 1) {
                    return Manager.get(cl***REMOVED***Name);
                }
            }

            return Loader;
        },

        
        onFileLoaded: function(cl***REMOVED***Name, filePath) {
            Loader.numLoadedFiles++;

            isCl***REMOVED***FileLoaded[cl***REMOVED***Name] = true;
            isFileLoaded[filePath] = true;

            Loader.numPendingFiles--;

            if (Loader.numPendingFiles === 0) {
                Loader.refreshQueue();
            }

        },

        
        onFileLoadError: function(cl***REMOVED***Name, filePath, errorMessage, isSynchronous) {
            Loader.numPendingFiles--;
            Loader.hasFileLoadError = true;

        },

        
        addUsedCl***REMOVED***es: function (cl***REMOVED***es) {
            var cls, i, ln;

            if (cl***REMOVED***es) {
                cl***REMOVED***es = (typeof cl***REMOVED***es == 'string') ? [cl***REMOVED***es] : cl***REMOVED***es;
                for (i = 0, ln = cl***REMOVED***es.length; i < ln; i++) {
                    cls = cl***REMOVED***es[i];
                    if (typeof cls == 'string' && !Ext.Array.contains(usedCl***REMOVED***es, cls)) {
                        usedCl***REMOVED***es.push(cls);
                    }
                }
            }

            return Loader;
        },

        
        triggerReady: function() {
            var listener,
                i, refCl***REMOVED***es = usedCl***REMOVED***es;

            if (Loader.isLoading) {
                Loader.isLoading = false;

                if (refCl***REMOVED***es.length !== 0) {
                    
                    refCl***REMOVED***es = refCl***REMOVED***es.slice();
                    usedCl***REMOVED***es.length = 0;
                    
                    
                    Loader.require(refCl***REMOVED***es, Loader.triggerReady, Loader);
                    return Loader;
                }
            }

            
            
            
            while (readyListeners.length && !Loader.isLoading) {
                
                
                listener = readyListeners.shift();
                listener.fn.call(listener.scope);
            }

            return Loader;
        },

        
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            if (!Loader.isLoading) {
                fn.call(scope);
            }
            else {
                readyListeners.push({
                    fn: fn,
                    scope: scope
                });
            }
        },

        
        historyPush: function(cl***REMOVED***Name) {
            if (cl***REMOVED***Name && isCl***REMOVED***FileLoaded.hasOwnProperty(cl***REMOVED***Name) && !isInHistory[cl***REMOVED***Name]) {
                isInHistory[cl***REMOVED***Name] = true;
                history.push(cl***REMOVED***Name);
            }
            return Loader;
        }
    });

    
    Ext.disableCacheBuster = function (disable, path) {
        var date = new Date();
        date.setTime(date.getTime() + (disable ? 10*365 : -1) * 24*60*60*1000);
        date = date.toGMTString();
        document.cookie = 'ext-cache=1; expires=' + date + '; path='+(path || '/');
    };


    
    Ext.require = alias(Loader, 'require');

    
    Ext.syncRequire = alias(Loader, 'syncRequire');

    
    Ext.exclude = alias(Loader, 'exclude');

    
    Ext.onReady = function(fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    
    Cl***REMOVED***.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            dependency,
            cl***REMOVED***Name = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue,
            requiredMap, requiredDep;

        

        for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                }
                else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                }
                else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }


        Loader.require(dependencies, function() {
            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            continueFn.call(me, cls, data, hooks);
        });

        return false;
    }, true, 'after', 'cl***REMOVED***Name');

    
    Manager.registerPostprocessor('uses', function(name, cls, data) {
        var uses = data.uses;
        if (uses) {
            Loader.addUsedCl***REMOVED***es(uses);
        }
    });

    Manager.onCreated(Loader.historyPush);
};



if (Ext._cl***REMOVED***PathMetadata) {
    Ext.Loader.addCl***REMOVED***PathMappings(Ext._cl***REMOVED***PathMetadata);
    Ext._cl***REMOVED***PathMetadata = null;
}


(function() {
    var scripts = document.getElementsByTagName('script'),
        currentScript = scripts[scripts.length - 1],
        src = currentScript.src,
        path = src.substring(0, src.lastIndexOf('/') + 1),
        Loader = Ext.Loader;


    Loader.setConfig({
        enabled: true,
        disableCaching: true,
        paths: {
            'Ext': path + 'src'
        }
    });
})();



Ext._endTime = new Date().getTime();
if (Ext._beforereadyhandler){
    Ext._beforereadyhandler();
}

//@tag foundation,core

//@require ../cl***REMOVED***/Loader.js



Ext.Error = Ext.extend(Error, {
    statics: {
        
        ignore: false,

        
        

        
        raise: function(err){
            err = err || {};
            if (Ext.isString(err)) {
                err = { msg: err };
            }

            var method = this.raise.caller,
                msg;

            if (method) {
                if (method.$name) {
                    err.sourceMethod = method.$name;
                }
                if (method.$owner) {
                    err.sourceCl***REMOVED*** = method.$owner.$cl***REMOVED***Name;
                }
            }

            if (Ext.Error.handle(err) !== true) {
                msg = Ext.Error.prototype.toString.call(err);

                Ext.log({
                    msg: msg,
                    level: 'error',
                    dump: err,
                    stack: true
                });

                throw new Ext.Error(err);
            }
        },

        
        handle: function(){
            return Ext.Error.ignore;
        }
    },

    
    name: 'Ext.Error',

    
    constructor: function(config){
        if (Ext.isString(config)) {
            config = { msg: config };
        }

        var me = this;

        Ext.apply(me, config);

        me.message = me.message || me.msg; 
        
    },

    
    toString: function(){
        var me = this,
            cl***REMOVED***Name = me.sourceCl***REMOVED*** ? me.sourceCl***REMOVED*** : '',
            methodName = me.sourceMethod ? '.' + me.sourceMethod + '(): ' : '',
            msg = me.msg || '(No description provided)';

        return cl***REMOVED***Name + methodName + msg;
    }
});


Ext.deprecated = function (suggestion) {
    return Ext.emptyFn;
};
