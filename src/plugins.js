/**
 * List of plugins:
 * -Accounting.js
 * -Backbone.js computed properties
 * -jquery.timer.js
 * -jQuery bootstrap news box
 */

/*!
 * accounting.js v0.3.2
 * Copyright 2011, Joss Crowcroft
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://josscrowcroft.github.com/accounting.js/
 */

(function(root, undefined) {

	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally later
	var lib = {};

	// Current version
	lib.version = '0.3.2';


	/* --- Exposed settings --- */

	// The library's settings configuration object. Contains default parameters for
	// currency and number formatting
	lib.settings = {
		currency: {
			symbol : "$",		// default currency symbol is '$'
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
			decimal : ".",		// decimal point separator
			thousand : ",",		// thousands separator
			precision : 2,		// decimal places
			grouping : 3		// digit grouping (not implemented yet)
		},
		number: {
			precision : 0,		// default precision on numbers is 0
			grouping : 3,		// digit grouping (not implemented yet)
			thousand : ",",
			decimal : "."
		}
	};


	/* --- Internal Helper Methods --- */

	// Store reference to possibly-available ECMAScript 5 methods for later
	var nativeMap = Array.prototype.map,
		nativeIsArray = Array.isArray,
		toString = Object.prototype.toString;

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js
	 */
	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js, delegates to ECMA5's native Array.isArray
	 */
	function isArray(obj) {
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
	}

	/**
	 * Tests whether supplied parameter is a true object
	 */
	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	/**
	 * Extends an object with a defaults object, similar to underscore's _.defaults
	 *
	 * Used for abstracting parameter handling from API methods
	 */
	function defaults(object, defs) {
		var key;
		object = object || {};
		defs = defs || {};
		// Iterate over object non-prototype properties:
		for (key in defs) {
			if (defs.hasOwnProperty(key)) {
				// Replace values with defaults only if undefined (allow empty/zero values):
				if (object[key] == null) object[key] = defs[key];
			}
		}
		return object;
	}

	/**
	 * Implementation of `Array.map()` for iteration loops
	 *
	 * Returns a new Array as a result of calling `iterator` on each array value.
	 * Defers to native Array.map if available
	 */
	function map(obj, iterator, context) {
		var results = [], i, j;

		if (!obj) return results;

		// Use native .map method if it exists:
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);

		// Fallback for native .map:
		for (i = 0, j = obj.length; i < j; i++ ) {
			results[i] = iterator.call(context, obj[i], i, obj);
		}
		return results;
	}

	/**
	 * Check and normalise the value of precision (must be positive integer)
	 */
	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val)? base : val;
	}

	/* --- API Methods --- */

	/**
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
	 * alias: accounting.`parse(string)`
	 *
	 * Decimal must be included in the regular expression to match floats (defaults to
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
	 * separator, provide it as the second argument.
	 *
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
	 *
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
	 */
	var unformat = lib.unformat = lib.parse = function(value, decimal) {
		// Recursively unformat arrays:
		if (isArray(value)) {
			return map(value, function(val) {
				return unformat(val, decimal);
			});
		}

		// Fails silently (need decent errors):
		value = value || 0;

		// Return the value as-is if it's already a number:
		if (typeof value === "number") return value;

		// Default decimal point comes from settings, but could be set to eg. "," in opts:
		decimal = decimal || lib.settings.number.decimal;

		 // Build regex to strip out everything except digits, decimal point and minus sign:
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
			unformatted = parseFloat(
				("" + value)
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
			);

		// This will fail silently which may cause trouble, let's wait and see:
		return !isNaN(unformatted) ? unformatted : 0;
	};


	/**
	 * Implementation of toFixed() that treats floats more like decimals
	 *
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
	 * problems for accounting- and finance-related software.
	 */
	var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};


	/**
	 * Format a number, with comma-separated thousands and custom precision/decimal places
	 *
	 * Localise by overriding the precision and thousand / decimal separators
	 * 2nd parameter `precision` can be an object matching `settings.number`
	 */
	var formatNumber = lib.formatNumber = function(number, precision, thousand, decimal) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val) {
				return formatNumber(val, precision, thousand, decimal);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(precision) ? precision : {
					precision : precision,
					thousand : thousand,
					decimal : decimal
				}),
				lib.settings.number
			),

			// Clean up precision
			usePrecision = checkPrecision(opts.precision),

			// Do some calc:
			negative = number < 0 ? "-" : "",
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
			mod = base.length > 3 ? base.length % 3 : 0;

		// Format the number:
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};
	
		// Use accounting.noConflict to restore `accounting` back to its original value.
		// Returns a reference to the library's `accounting` object;
		// e.g. `var numbers = accounting.noConflict();`
		lib.noConflict = (function(oldAccounting) {
			return function() {
				// Reset the value of the root's `accounting` variable:
				root.accounting = oldAccounting;
				// Delete the noConflict method:
				lib.noConflict = undefined;
				// Return reference to the library to re-assign it:
				return lib;
			};
		})(root.accounting);

		// Declare `fx` on the root (global/window) object:
		root['accounting'] = lib;	
	// Root will be `window` in browser or `global` on the server:
}(this));

/**
 * BACKBONE COMPUTED PROPERTIES
 * https://github.com/kdocki/backbone.model.computed
 * 
 * Written with love by Kelt <kelt@codesleeve.com>
 *
 * I like computed properties in EmberJS so I made this Backbone.Model override
 * so that I can easily do them now. Basically 
 */
(function() {

    /**
     * [toCamelCase description]
     */
    function toCamelCase(_str)
    {
        var str = _str;
        var placement = str.indexOf('_');

        while (placement !== -1)
        {
            var capitailChar = str.substr(placement + 1, 1).toUpperCase();
            str = str.substr(0, placement) + capitailChar + str.substr(placement+2);
            placement = str.indexOf('_');
        }

        return str;
    }

    /**
     * [toSnakeCase description]
     */
    function toSnakeCase(_str)
    {
        var str = "";

        for(var index = 0; index < _str.length; index++)
        {
            var charAt = _str.charAt(index);

            if (charAt != charAt.toLowerCase()) {
                charAt = '_' + charAt.toLowerCase();
            }

            str = str + charAt;
        }

        return str;
    }

    /**
     * [inArray description]
     */
    function inArray(value, array)
    {
        for (var index in array)
        {
            if (value == array[index]) {
                return index;
            }
        }

        return -1;
    }

    /**
     * Find computed properties in our backbone model and put them
     * in the name we would expect. Here is an example of how to 
     * access the computed property
     * 
     *     getPropName : function() { ... }
     *
     * Fetch value like this...
     * 
     *     this.get('prop_name');
     */
    function getComputedProperites(model)
    {
        var computedProperties = [];

        for(var key in model)
        {
            if(_.isFunction(model[key]))
            {
                if (key.substr(0, 3) === 'get' || key.substr(0, 3) === 'set')
                {
                    var propName = toSnakeCase(key.substr(3)).substr(1);
                    if (propName.length > 0) {
                        computedProperties.push(propName);
                    }
                }
            }
        }

        return _.uniq(computedProperties);
    }

    /**
     * [hasComputedProperty description]
     */
    function hasComputedProperty(model, propName, prefix)
    {
        var funcName = prefix + toCamelCase('_' + propName);

        if (inArray(funcName, model.ignoreMethods) !== -1) {
            return false;
        }

        var func = model[funcName];

        return _.isFunction(func);
    }

    /**
     * [registerEvent description]
     */
    function registerProperty(model, propName)
    {
        var getter = model['get' + toCamelCase('_' + propName)];
        var changes = [];

        if (_.isFunction(getter) && typeof getter.__properties !== 'undefined')
        {
            changes = getter.__properties;
        }

        for (var index in changes)
        {
            model.on('change:' + changes[index], function() {
                model.trigger('change:' + propName);
            });
        }
    }

    /**
     * [setupEvents description]
     */
    function setupEvents(model)
    {
        var properties = getComputedProperites(model);

        for (var index in properties)
        {
            registerProperty(model, properties[index]);
        }
    }

    /**
     * Store the original get function so I can use it later
     */
     var origGet = Backbone.Model.prototype.get;

    /**
     * [backboneGet description]
     */
    function backboneGet(attr)
    {
        if (hasComputedProperty(this, attr, 'get'))
        {
            var getter = this['get' + toCamelCase('_' + attr)];
            return getter.call(this);
        }

        return origGet.call(this, attr);
    }

    /**
     * Store the original set function so I can use it later
     */
     var origSet = Backbone.Model.prototype.set;

    /**
     * [backboneSet description]
     */
    function backboneSet(attr, value)
    {
        if (hasComputedProperty(this, attr, 'set'))
        {
            var setter = this['set' + toCamelCase('_' + attr)];
            return setter.call(this, value);
        }

        return origSet.apply(this, [attr, value]);
    }

    /**
     * Store the original toJSON function so I can use it later
     */
    var origToJSON = Backbone.Model.prototype.toJSON

    /**
     * [backboneToJSON description]
     */
    function backboneToJSON(options)
    {
        var data = origToJSON.call(this, options);
        var properties = getComputedProperites(this);

        for (var index in properties)
        {
            var attr = properties[index];
            if (hasComputedProperty(this, attr, 'get'))
            {
                var getter = this['get' + toCamelCase('_' + attr)];
                data[attr] =  getter.call(this, options);
            }
        }
        
        return data;
    }

    /**
     * This is much like EmberJS's property
     * on the EmberOjects. Allows us to set
     * change events on computed properties
     */
    Function.prototype.property = function()
    {
        this.__properties = arguments;
        return this;
    }

    /**
     * Overriding the Backbone.Model to make it
     * register trigger events in the right place
     */
    Backbone.Model = (function(Model)
    {
        Backbone.Model = function(attributes, options)
        {
            Model.apply(this, arguments);
     
            setupEvents(this);
        };

        _.extend(Backbone.Model, Model);

        Backbone.Model.prototype = (function(Prototype)
        {
            Prototype.prototype = Model.prototype;
            return new Prototype;
        })(function() {});

        Backbone.Model.prototype.constructor = Backbone.Model;

        return Backbone.Model;

    })(Backbone.Model);


    Backbone.Model.prototype.toJSON = backboneToJSON;
    Backbone.Model.prototype.set = backboneSet;
    Backbone.Model.prototype.get = backboneGet;

})();



/**
 * jquery.timer.js
 *
 * Copyright (c) 2011 Jason Chavannes <jason.chavannes@gmail.com>
 *
 * http://jchavannes.com/jquery-timer
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function($) {
	$.timer = function(func, time, autostart) {	
	 	this.set = function(func, time, autostart) {
	 		this.init = true;
	 	 	if(typeof func == 'object') {
		 	 	var paramList = ['autostart', 'time'];
	 	 	 	for(var arg in paramList) {if(func[paramList[arg]] != undefined) {eval(paramList[arg] + " = func[paramList[arg]]");}};
 	 			func = func.action;
	 	 	}
	 	 	if(typeof func == 'function') {this.action = func;}
		 	if(!isNaN(time)) {this.intervalTime = time;}
		 	if(autostart && !this.isActive) {
			 	this.isActive = true;
			 	this.setTimer();
		 	}
		 	return this;
	 	};
	 	this.once = function(time) {
			var timer = this;
	 	 	if(isNaN(time)) {time = 0;}
			window.setTimeout(function() {timer.action();}, time);
	 		return this;
	 	};
		this.play = function(reset) {
			if(!this.isActive) {
				if(reset) {this.setTimer();}
				else {this.setTimer(this.remaining);}
				this.isActive = true;
			}
			return this;
		};
		this.pause = function() {
			if(this.isActive) {
				this.isActive = false;
				this.remaining -= new Date() - this.last;
				this.clearTimer();
			}
			return this;
		};
		this.stop = function() {
			this.isActive = false;
			this.remaining = this.intervalTime;
			this.clearTimer();
			return this;
		};
		this.toggle = function(reset) {
			if(this.isActive) {this.pause();}
			else if(reset) {this.play(true);}
			else {this.play();}
			return this;
		};
		this.reset = function() {
			this.isActive = false;
			this.play(true);
			return this;
		};
		this.clearTimer = function() {
			window.clearTimeout(this.timeoutObject);
		};
	 	this.setTimer = function(time) {
			var timer = this;
	 	 	if(typeof this.action != 'function') {return;}
	 	 	if(isNaN(time)) {time = this.intervalTime;}
		 	this.remaining = time;
	 	 	this.last = new Date();
			this.clearTimer();
			this.timeoutObject = window.setTimeout(function() {timer.go();}, time);
		};
	 	this.go = function() {
	 		if(this.isActive) {
	 			this.action();
	 			this.setTimer();
	 		}
	 	};
	 	
	 	if(this.init) {
	 		return new $.timer(func, time, autostart);
	 	} else {
			this.set(func, time, autostart);
	 		return this;
	 	}
	};
})(jQuery);


/*
 * jQuery Bootstrap News Box v1.0.1
 * 
 * Copyright 2014, Dragan Mitrovic
 * email: gagi270683@gmail.com
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

//Utility
if (typeof Object.create !== 'function') {
    //Douglas Crockford inheritance function
    Object.create = function (obj) {
        function F() { };
        F.prototype = obj;
        return new F();
    };
}

(function ($, w, d, undefined) {

    var NewsBox = {

        init: function ( options, elem ) {
            //cache the references
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            
            self.newsTagName = self.$elem.find(":first-child").prop('tagName');
            self.newsClassName = self.$elem.find(":first-child").attr('class');

            self.timer = null;
            self.resizeTimer = null; // used with window.resize event 
            self.animationStarted = false;
            self.isHovered = false;


            if ( typeof options === 'string' ) {
                //string was passed
                if(console) {
                    console.error("String property override is not supported");
                }
                throw ("String property override is not supported");
            } else {
                //object was passed
                //extend user options overrides
                self.options = $.extend( {}, $.fn.bootstrapNews.options, options );
                
                self.prepareLayout();


                //autostart animation
                if(self.options.autoplay) {
                    self.animate();
                }

                if ( self.options.navigation ) {
                    self.buildNavigation();
                }

                //enable users to override the methods
                if( typeof self.options.onToDo === 'function') {
                    self.options.onToDo.apply(self, arguments);
                }

            }
        },

        prepareLayout: function() {
            var self = this;

            //checking mouse position
                
            $(self.elem).find('.'+self.newsClassName).on('mouseenter', function(){
                self.onReset(true);
            });

            $(self.elem).find('.'+self.newsClassName).on('mouseout', function(){
                self.onReset(false);
            });

            //set news visible / hidden
            $.map(self.$elem.find(self.newsTagName), function(newsItem, index){
                if(index > self.options.newsPerPage - 1) {
                    $(newsItem).hide();
                } else {
                    $(newsItem).show();
                }
            });

            //prevent user to select more news that it actualy have

            if( self.$elem.find(self.newsTagName).length < self.options.newsPerPage ) {
                self.options.newsPerPage = self.$elem.find(self.newsTagName).length;
            }
            
            //get height of the very first self.options.newsPerPage news
            var height = 0;

            $.map(self.$elem.find(self.newsTagName), function( newsItem, index ) {
                if ( index < self.options.newsPerPage ) {
                    height = parseInt(height) + parseInt($(newsItem).height()) + 10;
                }
            });

            $(self.elem).css({"overflow-y": "hidden", "height": height});

            //recalculate news box height for responsive interfaces
            $( w ).resize(function() {
                if ( self.resizeTimer !== null ) {
                    clearTimeout( self.resizeTimer );
                }
                self.resizeTimer = setTimeout( function() {
                  self.prepareLayout();
                }, 200 );
            });

        },

        findPanelObject: function() { 
            var panel = this.$elem;
            while ( panel.parent() !== undefined ) {
                panel = panel.parent();
                if ( panel.parent().hasClass('panel') ) { 
                    return panel.parent();
                }
            }

            return undefined;
        },

        buildNavigation: function() { 
            var panel = this.findPanelObject();
            if( panel ) {
                var nav = '<ul class="pagination pull-right" style="margin: 0px;">' +
                             '<li><a href="#" class="prev"><span class="glyphicon glyphicon-chevron-down"></span></a></li>' +
                             '<li><a href="#" class="next"><span class="glyphicon glyphicon-chevron-up"></span></a></li>' +
                           '</ul><div class="clearfix"></div>';


                var footer = $(panel).find(".panel-footer")[0];
                if( footer ) {
                    $(footer).append(nav);
                } else {
                    $(panel).append('<div class="panel-footer">' + nav + '</div>');
                }

                var self = this;
                $(panel).find('.prev').on('click', function(ev){
                    ev.preventDefault();
                    self.onPrev();
                });

                $(panel).find('.next').on('click', function(ev){
                    ev.preventDefault();
                    self.onNext();
                });

            }
        },

        onStop: function() {
            
        },

        onPause: function() {
            var self = this;
            self.isHovered = true;
            if(this.options.autoplay && self.timer) {
                clearTimeout(self.timer);
            }
        },

        onReset: function(status) {
            var self = this;
            if(self.timer) {
                clearTimeout(self.timer);
            }

            if(self.options.autoplay) {
                self.isHovered = status;
                self.animate();
            }
        },

        animate: function() {
            var self = this;
            self.timer = setTimeout(function() {
                
                if ( !self.options.pauseOnHover ) {
                    self.isHovered = false;
                }

                if (! self.isHovered) {
                     if(self.options.direction === 'up') {
                        self.onNext();
                     } else {
                        self.onPrev();
                     }
                } 
            }, self.options.newsTickerInterval);
        },

        onPrev: function() {
            
            var self = this;

            if ( self.animationStarted ) {
                return false;
            }

            self.animationStarted = true;

            var html = '<' + self.newsTagName + ' style="display:none;" class="' + self.newsClassName + '">' + $(self.$elem).find(self.newsTagName).last().html() + '</' + self.newsTagName + '>';
            $(self.$elem).prepend(html);
            $(self.$elem).find(self.newsTagName).first().slideDown(self.options.animationSpeed, function(){
                $(self.$elem).find(self.newsTagName).last().remove();
            });

            $(self.$elem).find(self.newsTagName +':nth-child(' + parseInt(self.options.newsPerPage + 1) + ')').slideUp(self.options.animationSpeed, function(){
                self.animationStarted = false;
                self.onReset(self.isHovered);
            });

            $(self.elem).find('.'+self.newsClassName).on('mouseenter', function(){
                self.onReset(true);
            });

            $(self.elem).find('.'+self.newsClassName).on('mouseout', function(){
                self.onReset(false);
            });
        },

        onNext: function() {
            var self = this;

            if ( self.animationStarted ) {
                return false;
            }

            self.animationStarted = true;

            var html = '<' + self.newsTagName + ' style="display:none;" class=' + self.newsClassName + '>' + $(self.$elem).find(self.newsTagName).first().html() + '</' + self.newsTagName + '>';
            $(self.$elem).append(html);

            $(self.$elem).find(self.newsTagName).first().slideUp(self.options.animationSpeed, function(){
                $(this).remove();
            });

            $(self.$elem).find(self.newsTagName +':nth-child(' + parseInt(self.options.newsPerPage + 1) + ')').slideDown(self.options.animationSpeed, function(){
                self.animationStarted = false;
                self.onReset(self.isHovered);
            });

            $(self.elem).find('.'+self.newsClassName).on('mouseenter', function(){
                self.onReset(true);
            });

            $(self.elem).find('.'+self.newsClassName).on('mouseout', function(){
                self.onReset(false);
            });
        }
    };

    $.fn.bootstrapNews = function ( options ) {
        //enable multiple DOM object selection (class selector) + enable chaining like $(".class").bootstrapNews().chainingMethod()
        return this.each( function () {

            var newsBox = Object.create( NewsBox );

            newsBox.init( options, this );
            //console.log(newsBox);

        });
    };

    $.fn.bootstrapNews.options = {
        newsPerPage: 4,
        navigation: true,
        autoplay: true,
        direction:'up',
        animationSpeed: 'normal',
        newsTickerInterval: 4000, //4 secs
        pauseOnHover: true,
        onStop: null,
        onPause: null,
        onReset: null,
        onPrev: null,
        onNext: null,
        onToDo: null
    };

})(jQuery, window, document);