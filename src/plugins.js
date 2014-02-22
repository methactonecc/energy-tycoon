/**
 * List of plugins:
 * -Accounting.js
 * -Backbone.js computed properties
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