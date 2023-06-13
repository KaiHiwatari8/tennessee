"use strict";
exports.id = 109;
exports.ids = [109];
exports.modules = {

/***/ 1603:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __spreadArray = (void 0) && (void 0).__spreadArray || function(to, from) {
    for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ContextAPI = void 0;
var NoopContextManager_1 = __webpack_require__(6349);
var global_utils_1 = __webpack_require__(6078);
var diag_1 = __webpack_require__(4306);
var API_NAME = "context";
var NOOP_CONTEXT_MANAGER = new NoopContextManager_1.NoopContextManager();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */ var ContextAPI = /** @class */ function() {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ function ContextAPI() {}
    /** Get the singleton instance of the Context API */ ContextAPI.getInstance = function() {
        if (!this._instance) {
            this._instance = new ContextAPI();
        }
        return this._instance;
    };
    /**
     * Set the current context manager.
     *
     * @returns true if the context manager was successfully registered, else false
     */ ContextAPI.prototype.setGlobalContextManager = function(contextManager) {
        return global_utils_1.registerGlobal(API_NAME, contextManager, diag_1.DiagAPI.instance());
    };
    /**
     * Get the currently active context
     */ ContextAPI.prototype.active = function() {
        return this._getContextManager().active();
    };
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */ ContextAPI.prototype.with = function(context, fn, thisArg) {
        var _a;
        var args = [];
        for(var _i = 3; _i < arguments.length; _i++){
            args[_i - 3] = arguments[_i];
        }
        return (_a = this._getContextManager()).with.apply(_a, __spreadArray([
            context,
            fn,
            thisArg
        ], args));
    };
    /**
     * Bind a context to a target function or event emitter
     *
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     * @param target function or event emitter to bind
     */ ContextAPI.prototype.bind = function(context, target) {
        return this._getContextManager().bind(context, target);
    };
    ContextAPI.prototype._getContextManager = function() {
        return global_utils_1.getGlobal(API_NAME) || NOOP_CONTEXT_MANAGER;
    };
    /** Disable and remove the global context manager */ ContextAPI.prototype.disable = function() {
        this._getContextManager().disable();
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
    };
    return ContextAPI;
}();
exports.ContextAPI = ContextAPI; //# sourceMappingURL=context.js.map


/***/ }),

/***/ 4306:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DiagAPI = void 0;
var ComponentLogger_1 = __webpack_require__(1271);
var logLevelLogger_1 = __webpack_require__(1312);
var types_1 = __webpack_require__(4524);
var global_utils_1 = __webpack_require__(6078);
var API_NAME = "diag";
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 */ var DiagAPI = /** @class */ function() {
    /**
     * Private internal constructor
     * @private
     */ function DiagAPI() {
        function _logProxy(funcName) {
            return function() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                var logger = global_utils_1.getGlobal("diag");
                // shortcut if logger not set
                if (!logger) return;
                return logger[funcName].apply(logger, args);
            };
        }
        // Using self local variable for minification purposes as 'this' cannot be minified
        var self = this;
        // DiagAPI specific functions
        self.setLogger = function(logger, logLevel) {
            var _a, _b;
            if (logLevel === void 0) {
                logLevel = types_1.DiagLogLevel.INFO;
            }
            if (logger === self) {
                // There isn't much we can do here.
                // Logging to the console might break the user application.
                // Try to log to self. If a logger was previously registered it will receive the log.
                var err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                return false;
            }
            var oldLogger = global_utils_1.getGlobal("diag");
            var newLogger = logLevelLogger_1.createLogLevelDiagLogger(logLevel, logger);
            // There already is an logger registered. We'll let it know before overwriting it.
            if (oldLogger) {
                var stack = (_b = new Error().stack) !== null && _b !== void 0 ? _b : "<failed to generate stacktrace>";
                oldLogger.warn("Current logger will be overwritten from " + stack);
                newLogger.warn("Current logger will overwrite one already registered from " + stack);
            }
            return global_utils_1.registerGlobal("diag", newLogger, self, true);
        };
        self.disable = function() {
            global_utils_1.unregisterGlobal(API_NAME, self);
        };
        self.createComponentLogger = function(options) {
            return new ComponentLogger_1.DiagComponentLogger(options);
        };
        self.verbose = _logProxy("verbose");
        self.debug = _logProxy("debug");
        self.info = _logProxy("info");
        self.warn = _logProxy("warn");
        self.error = _logProxy("error");
    }
    /** Get the singleton instance of the DiagAPI API */ DiagAPI.instance = function() {
        if (!this._instance) {
            this._instance = new DiagAPI();
        }
        return this._instance;
    };
    return DiagAPI;
}();
exports.DiagAPI = DiagAPI; //# sourceMappingURL=diag.js.map


/***/ }),

/***/ 2509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.PropagationAPI = void 0;
var global_utils_1 = __webpack_require__(6078);
var NoopTextMapPropagator_1 = __webpack_require__(978);
var TextMapPropagator_1 = __webpack_require__(3458);
var context_helpers_1 = __webpack_require__(9128);
var utils_1 = __webpack_require__(32);
var diag_1 = __webpack_require__(4306);
var API_NAME = "propagation";
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */ var PropagationAPI = /** @class */ function() {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ function PropagationAPI() {
        this.createBaggage = utils_1.createBaggage;
        this.getBaggage = context_helpers_1.getBaggage;
        this.setBaggage = context_helpers_1.setBaggage;
        this.deleteBaggage = context_helpers_1.deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */ PropagationAPI.getInstance = function() {
        if (!this._instance) {
            this._instance = new PropagationAPI();
        }
        return this._instance;
    };
    /**
     * Set the current propagator.
     *
     * @returns true if the propagator was successfully registered, else false
     */ PropagationAPI.prototype.setGlobalPropagator = function(propagator) {
        return global_utils_1.registerGlobal(API_NAME, propagator, diag_1.DiagAPI.instance());
    };
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */ PropagationAPI.prototype.inject = function(context, carrier, setter) {
        if (setter === void 0) {
            setter = TextMapPropagator_1.defaultTextMapSetter;
        }
        return this._getGlobalPropagator().inject(context, carrier, setter);
    };
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */ PropagationAPI.prototype.extract = function(context, carrier, getter) {
        if (getter === void 0) {
            getter = TextMapPropagator_1.defaultTextMapGetter;
        }
        return this._getGlobalPropagator().extract(context, carrier, getter);
    };
    /**
     * Return a list of all fields which may be used by the propagator.
     */ PropagationAPI.prototype.fields = function() {
        return this._getGlobalPropagator().fields();
    };
    /** Remove the global propagator */ PropagationAPI.prototype.disable = function() {
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
    };
    PropagationAPI.prototype._getGlobalPropagator = function() {
        return global_utils_1.getGlobal(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
    };
    return PropagationAPI;
}();
exports.PropagationAPI = PropagationAPI; //# sourceMappingURL=propagation.js.map


/***/ }),

/***/ 4458:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TraceAPI = void 0;
var global_utils_1 = __webpack_require__(6078);
var ProxyTracerProvider_1 = __webpack_require__(9766);
var spancontext_utils_1 = __webpack_require__(7375);
var context_utils_1 = __webpack_require__(6051);
var diag_1 = __webpack_require__(4306);
var API_NAME = "trace";
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */ var TraceAPI = /** @class */ function() {
    /** Empty private constructor prevents end users from constructing a new instance of the API */ function TraceAPI() {
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.wrapSpanContext = spancontext_utils_1.wrapSpanContext;
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
        this.deleteSpan = context_utils_1.deleteSpan;
        this.getSpan = context_utils_1.getSpan;
        this.getSpanContext = context_utils_1.getSpanContext;
        this.setSpan = context_utils_1.setSpan;
        this.setSpanContext = context_utils_1.setSpanContext;
    }
    /** Get the singleton instance of the Trace API */ TraceAPI.getInstance = function() {
        if (!this._instance) {
            this._instance = new TraceAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global tracer.
     *
     * @returns true if the tracer provider was successfully registered, else false
     */ TraceAPI.prototype.setGlobalTracerProvider = function(provider) {
        var success = global_utils_1.registerGlobal(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
        if (success) {
            this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
    };
    /**
     * Returns the global tracer provider.
     */ TraceAPI.prototype.getTracerProvider = function() {
        return global_utils_1.getGlobal(API_NAME) || this._proxyTracerProvider;
    };
    /**
     * Returns a tracer from the global tracer provider.
     */ TraceAPI.prototype.getTracer = function(name, version) {
        return this.getTracerProvider().getTracer(name, version);
    };
    /** Remove the global tracer provider */ TraceAPI.prototype.disable = function() {
        global_utils_1.unregisterGlobal(API_NAME, diag_1.DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
    };
    return TraceAPI;
}();
exports.TraceAPI = TraceAPI; //# sourceMappingURL=trace.js.map


/***/ }),

/***/ 9128:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deleteBaggage = exports.setBaggage = exports.getBaggage = void 0;
var context_1 = __webpack_require__(1569);
/**
 * Baggage key
 */ var BAGGAGE_KEY = context_1.createContextKey("OpenTelemetry Baggage Key");
/**
 * Retrieve the current baggage from the given context
 *
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */ function getBaggage(context) {
    return context.getValue(BAGGAGE_KEY) || undefined;
}
exports.getBaggage = getBaggage;
/**
 * Store a baggage in the given context
 *
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */ function setBaggage(context, baggage) {
    return context.setValue(BAGGAGE_KEY, baggage);
}
exports.setBaggage = setBaggage;
/**
 * Delete the baggage stored in the given context
 *
 * @param {Context} Context that manage all context values
 */ function deleteBaggage(context) {
    return context.deleteValue(BAGGAGE_KEY);
}
exports.deleteBaggage = deleteBaggage; //# sourceMappingURL=context-helpers.js.map


/***/ }),

/***/ 7920:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.BaggageImpl = void 0;
var BaggageImpl = /** @class */ function() {
    function BaggageImpl(entries) {
        this._entries = entries ? new Map(entries) : new Map();
    }
    BaggageImpl.prototype.getEntry = function(key) {
        var entry = this._entries.get(key);
        if (!entry) {
            return undefined;
        }
        return Object.assign({}, entry);
    };
    BaggageImpl.prototype.getAllEntries = function() {
        return Array.from(this._entries.entries()).map(function(_a) {
            var k = _a[0], v = _a[1];
            return [
                k,
                v
            ];
        });
    };
    BaggageImpl.prototype.setEntry = function(key, entry) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntry = function(key) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntries = function() {
        var keys = [];
        for(var _i = 0; _i < arguments.length; _i++){
            keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl(this._entries);
        for(var _a = 0, keys_1 = keys; _a < keys_1.length; _a++){
            var key = keys_1[_a];
            newBaggage._entries.delete(key);
        }
        return newBaggage;
    };
    BaggageImpl.prototype.clear = function() {
        return new BaggageImpl();
    };
    return BaggageImpl;
}();
exports.BaggageImpl = BaggageImpl; //# sourceMappingURL=baggage-impl.js.map


/***/ }),

/***/ 3153:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.baggageEntryMetadataSymbol = void 0;
/**
 * Symbol used to make BaggageEntryMetadata an opaque type
 */ exports.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata"); //# sourceMappingURL=symbol.js.map


/***/ }),

/***/ 1848:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=types.js.map


/***/ }),

/***/ 32:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.baggageEntryMetadataFromString = exports.createBaggage = void 0;
var diag_1 = __webpack_require__(4306);
var baggage_impl_1 = __webpack_require__(7920);
var symbol_1 = __webpack_require__(3153);
var diag = diag_1.DiagAPI.instance();
/**
 * Create a new Baggage with optional entries
 *
 * @param entries An array of baggage entries the new baggage should contain
 */ function createBaggage(entries) {
    if (entries === void 0) {
        entries = {};
    }
    return new baggage_impl_1.BaggageImpl(new Map(Object.entries(entries)));
}
exports.createBaggage = createBaggage;
/**
 * Create a serializable BaggageEntryMetadata object from a string.
 *
 * @param str string metadata. Format is currently not defined by the spec and has no special meaning.
 *
 */ function baggageEntryMetadataFromString(str) {
    if (typeof str !== "string") {
        diag.error("Cannot create baggage metadata from unknown type: " + typeof str);
        str = "";
    }
    return {
        __TYPE__: symbol_1.baggageEntryMetadataSymbol,
        toString: function() {
            return str;
        }
    };
}
exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString; //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 7007:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=Attributes.js.map


/***/ }),

/***/ 2482:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=Exception.js.map


/***/ }),

/***/ 3669:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=Time.js.map


/***/ }),

/***/ 6349:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __spreadArray = (void 0) && (void 0).__spreadArray || function(to, from) {
    for(var i = 0, il = from.length, j = to.length; i < il; i++, j++)to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NoopContextManager = void 0;
var context_1 = __webpack_require__(1569);
var NoopContextManager = /** @class */ function() {
    function NoopContextManager() {}
    NoopContextManager.prototype.active = function() {
        return context_1.ROOT_CONTEXT;
    };
    NoopContextManager.prototype.with = function(_context, fn, thisArg) {
        var args = [];
        for(var _i = 3; _i < arguments.length; _i++){
            args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray([
            thisArg
        ], args));
    };
    NoopContextManager.prototype.bind = function(_context, target) {
        return target;
    };
    NoopContextManager.prototype.enable = function() {
        return this;
    };
    NoopContextManager.prototype.disable = function() {
        return this;
    };
    return NoopContextManager;
}();
exports.NoopContextManager = NoopContextManager; //# sourceMappingURL=NoopContextManager.js.map


/***/ }),

/***/ 1569:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ROOT_CONTEXT = exports.createContextKey = void 0;
/** Get a key to uniquely identify a context value */ function createContextKey(description) {
    // The specification states that for the same input, multiple calls should
    // return different keys. Due to the nature of the JS dependency management
    // system, this creates problems where multiple versions of some package
    // could hold different keys for the same property.
    //
    // Therefore, we use Symbol.for which returns the same key for the same input.
    return Symbol.for(description);
}
exports.createContextKey = createContextKey;
var BaseContext = /** @class */ function() {
    /**
     * Construct a new context which inherits values from an optional parent context.
     *
     * @param parentContext a context from which to inherit values
     */ function BaseContext(parentContext) {
        // for minification
        var self = this;
        self._currentContext = parentContext ? new Map(parentContext) : new Map();
        self.getValue = function(key) {
            return self._currentContext.get(key);
        };
        self.setValue = function(key, value) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.set(key, value);
            return context;
        };
        self.deleteValue = function(key) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.delete(key);
            return context;
        };
    }
    return BaseContext;
}();
/** The root context is used as the default parent context when there is no active context */ exports.ROOT_CONTEXT = new BaseContext(); //# sourceMappingURL=context.js.map


/***/ }),

/***/ 3487:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=types.js.map


/***/ }),

/***/ 1271:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DiagComponentLogger = void 0;
var global_utils_1 = __webpack_require__(6078);
/**
 * Component Logger which is meant to be used as part of any component which
 * will add automatically additional namespace in front of the log message.
 * It will then forward all message to global diag logger
 * @example
 * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
 * cLogger.debug('test');
 * // @opentelemetry/instrumentation-http test
 */ var DiagComponentLogger = /** @class */ function() {
    function DiagComponentLogger(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
    }
    DiagComponentLogger.prototype.debug = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy("debug", this._namespace, args);
    };
    DiagComponentLogger.prototype.error = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy("error", this._namespace, args);
    };
    DiagComponentLogger.prototype.info = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy("info", this._namespace, args);
    };
    DiagComponentLogger.prototype.warn = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy("warn", this._namespace, args);
    };
    DiagComponentLogger.prototype.verbose = function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        return logProxy("verbose", this._namespace, args);
    };
    return DiagComponentLogger;
}();
exports.DiagComponentLogger = DiagComponentLogger;
function logProxy(funcName, namespace, args) {
    var logger = global_utils_1.getGlobal("diag");
    // shortcut if logger not set
    if (!logger) {
        return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, args);
} //# sourceMappingURL=ComponentLogger.js.map


/***/ }),

/***/ 5379:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DiagConsoleLogger = void 0;
var consoleMap = [
    {
        n: "error",
        c: "error"
    },
    {
        n: "warn",
        c: "warn"
    },
    {
        n: "info",
        c: "info"
    },
    {
        n: "debug",
        c: "debug"
    },
    {
        n: "verbose",
        c: "trace"
    }
];
/**
 * A simple Immutable Console based diagnostic logger which will output any messages to the Console.
 * If you want to limit the amount of logging to a specific level or lower use the
 * {@link createLogLevelDiagLogger}
 */ var DiagConsoleLogger = /** @class */ function() {
    function DiagConsoleLogger() {
        function _consoleFunc(funcName) {
            return function() {
                var args = [];
                for(var _i = 0; _i < arguments.length; _i++){
                    args[_i] = arguments[_i];
                }
                if (console) {
                    // Some environments only expose the console when the F12 developer console is open
                    // eslint-disable-next-line no-console
                    var theFunc = console[funcName];
                    if (typeof theFunc !== "function") {
                        // Not all environments support all functions
                        // eslint-disable-next-line no-console
                        theFunc = console.log;
                    }
                    // One last final check
                    if (typeof theFunc === "function") {
                        return theFunc.apply(console, args);
                    }
                }
            };
        }
        for(var i = 0; i < consoleMap.length; i++){
            this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
    }
    return DiagConsoleLogger;
}();
exports.DiagConsoleLogger = DiagConsoleLogger; //# sourceMappingURL=consoleLogger.js.map


/***/ }),

/***/ 8421:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
__exportStar(__webpack_require__(5379), exports);
__exportStar(__webpack_require__(4524), exports); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 1312:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createLogLevelDiagLogger = void 0;
var types_1 = __webpack_require__(4524);
function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < types_1.DiagLogLevel.NONE) {
        maxLevel = types_1.DiagLogLevel.NONE;
    } else if (maxLevel > types_1.DiagLogLevel.ALL) {
        maxLevel = types_1.DiagLogLevel.ALL;
    }
    // In case the logger is null or undefined
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        var theFunc = logger[funcName];
        if (typeof theFunc === "function" && maxLevel >= theLevel) {
            return theFunc.bind(logger);
        }
        return function() {};
    }
    return {
        error: _filterFunc("error", types_1.DiagLogLevel.ERROR),
        warn: _filterFunc("warn", types_1.DiagLogLevel.WARN),
        info: _filterFunc("info", types_1.DiagLogLevel.INFO),
        debug: _filterFunc("debug", types_1.DiagLogLevel.DEBUG),
        verbose: _filterFunc("verbose", types_1.DiagLogLevel.VERBOSE)
    };
}
exports.createLogLevelDiagLogger = createLogLevelDiagLogger; //# sourceMappingURL=logLevelLogger.js.map


/***/ }),

/***/ 4524:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.DiagLogLevel = void 0;
/**
 * Defines the available internal logging levels for the diagnostic logger, the numeric values
 * of the levels are defined to match the original values from the initial LogLevel to avoid
 * compatibility/migration issues for any implementation that assume the numeric ordering.
 */ var DiagLogLevel;
(function(DiagLogLevel) {
    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */ DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
    /** Identifies an error scenario */ DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
    /** Identifies a warning scenario */ DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
    /** General informational log message */ DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
    /** General debug log message */ DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
    /**
     * Detailed trace level logging should only be used for development, should only be set
     * in a development environment.
     */ DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
    /** Used to set the logging level to include all logging */ DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel = exports.DiagLogLevel || (exports.DiagLogLevel = {})); //# sourceMappingURL=types.js.map


/***/ }),

/***/ 4235:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.diag = exports.propagation = exports.trace = exports.context = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = exports.isValidSpanId = exports.isValidTraceId = exports.isSpanContextValid = exports.createTraceState = exports.baggageEntryMetadataFromString = void 0;
__exportStar(__webpack_require__(1848), exports);
var utils_1 = __webpack_require__(32);
Object.defineProperty(exports, "baggageEntryMetadataFromString", ({
    enumerable: true,
    get: function() {
        return utils_1.baggageEntryMetadataFromString;
    }
}));
__exportStar(__webpack_require__(2482), exports);
__exportStar(__webpack_require__(3669), exports);
__exportStar(__webpack_require__(7007), exports);
__exportStar(__webpack_require__(8421), exports);
__exportStar(__webpack_require__(3458), exports);
__exportStar(__webpack_require__(3110), exports);
__exportStar(__webpack_require__(7266), exports);
__exportStar(__webpack_require__(6006), exports);
__exportStar(__webpack_require__(9766), exports);
__exportStar(__webpack_require__(623), exports);
__exportStar(__webpack_require__(2784), exports);
__exportStar(__webpack_require__(3418), exports);
__exportStar(__webpack_require__(1498), exports);
__exportStar(__webpack_require__(2176), exports);
__exportStar(__webpack_require__(9550), exports);
__exportStar(__webpack_require__(5013), exports);
__exportStar(__webpack_require__(4111), exports);
__exportStar(__webpack_require__(8699), exports);
var utils_2 = __webpack_require__(6937);
Object.defineProperty(exports, "createTraceState", ({
    enumerable: true,
    get: function() {
        return utils_2.createTraceState;
    }
}));
__exportStar(__webpack_require__(1430), exports);
__exportStar(__webpack_require__(7308), exports);
__exportStar(__webpack_require__(1990), exports);
var spancontext_utils_1 = __webpack_require__(7375);
Object.defineProperty(exports, "isSpanContextValid", ({
    enumerable: true,
    get: function() {
        return spancontext_utils_1.isSpanContextValid;
    }
}));
Object.defineProperty(exports, "isValidTraceId", ({
    enumerable: true,
    get: function() {
        return spancontext_utils_1.isValidTraceId;
    }
}));
Object.defineProperty(exports, "isValidSpanId", ({
    enumerable: true,
    get: function() {
        return spancontext_utils_1.isValidSpanId;
    }
}));
var invalid_span_constants_1 = __webpack_require__(7030);
Object.defineProperty(exports, "INVALID_SPANID", ({
    enumerable: true,
    get: function() {
        return invalid_span_constants_1.INVALID_SPANID;
    }
}));
Object.defineProperty(exports, "INVALID_TRACEID", ({
    enumerable: true,
    get: function() {
        return invalid_span_constants_1.INVALID_TRACEID;
    }
}));
Object.defineProperty(exports, "INVALID_SPAN_CONTEXT", ({
    enumerable: true,
    get: function() {
        return invalid_span_constants_1.INVALID_SPAN_CONTEXT;
    }
}));
__exportStar(__webpack_require__(1569), exports);
__exportStar(__webpack_require__(3487), exports);
var context_1 = __webpack_require__(1603);
/** Entrypoint for context API */ exports.context = context_1.ContextAPI.getInstance();
var trace_1 = __webpack_require__(4458);
/** Entrypoint for trace API */ exports.trace = trace_1.TraceAPI.getInstance();
var propagation_1 = __webpack_require__(2509);
/** Entrypoint for propagation API */ exports.propagation = propagation_1.PropagationAPI.getInstance();
var diag_1 = __webpack_require__(4306);
/**
 * Entrypoint for Diag API.
 * Defines Diagnostic handler used for internal diagnostic logging operations.
 * The default provides a Noop DiagLogger implementation which may be changed via the
 * diag.setLogger(logger: DiagLogger) function.
 */ exports.diag = diag_1.DiagAPI.instance();
exports["default"] = {
    trace: exports.trace,
    context: exports.context,
    propagation: exports.propagation,
    diag: exports.diag
}; //# sourceMappingURL=index.js.map


/***/ }),

/***/ 6078:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.unregisterGlobal = exports.getGlobal = exports.registerGlobal = void 0;
var platform_1 = __webpack_require__(479);
var version_1 = __webpack_require__(6031);
var semver_1 = __webpack_require__(9354);
var major = version_1.VERSION.split(".")[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = platform_1._globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
    var _a;
    if (allowOverride === void 0) {
        allowOverride = false;
    }
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: version_1.VERSION
    };
    if (!allowOverride && api[type]) {
        // already registered an API of this type
        var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
        diag.error(err.stack || err.message);
        return false;
    }
    if (api.version !== version_1.VERSION) {
        // All registered APIs must be of the same version exactly
        var err = new Error("@opentelemetry/api: All API registration versions must match");
        diag.error(err.stack || err.message);
        return false;
    }
    api[type] = instance;
    diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + version_1.VERSION + ".");
    return true;
}
exports.registerGlobal = registerGlobal;
function getGlobal(type) {
    var _a, _b;
    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
    if (!globalVersion || !semver_1.isCompatible(globalVersion)) {
        return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
exports.getGlobal = getGlobal;
function unregisterGlobal(type, diag) {
    diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + version_1.VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
        delete api[type];
    }
}
exports.unregisterGlobal = unregisterGlobal; //# sourceMappingURL=global-utils.js.map


/***/ }),

/***/ 9354:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isCompatible = exports._makeCompatibilityCheck = void 0;
var version_1 = __webpack_require__(6031);
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
 * Create a function to test an API version to see if it is compatible with the provided ownVersion.
 *
 * The returned function has the following semantics:
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param ownVersion version which should be checked against
 */ function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = new Set([
        ownVersion
    ]);
    var rejectedVersions = new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
        // we cannot guarantee compatibility so we always return noop
        return function() {
            return false;
        };
    }
    var ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4]
    };
    // if ownVersion has a prerelease tag, versions must match exactly
    if (ownVersionParsed.prerelease != null) {
        return function isExactmatch(globalVersion) {
            return globalVersion === ownVersion;
        };
    }
    function _reject(v) {
        rejectedVersions.add(v);
        return false;
    }
    function _accept(v) {
        acceptedVersions.add(v);
        return true;
    }
    return function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
            return true;
        }
        if (rejectedVersions.has(globalVersion)) {
            return false;
        }
        var globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
            // cannot parse other version
            // we cannot guarantee compatibility so we always noop
            return _reject(globalVersion);
        }
        var globalVersionParsed = {
            major: +globalVersionMatch[1],
            minor: +globalVersionMatch[2],
            patch: +globalVersionMatch[3],
            prerelease: globalVersionMatch[4]
        };
        // if globalVersion has a prerelease tag, versions must match exactly
        if (globalVersionParsed.prerelease != null) {
            return _reject(globalVersion);
        }
        // major versions must match
        if (ownVersionParsed.major !== globalVersionParsed.major) {
            return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
            if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
                return _accept(globalVersion);
            }
            return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
            return _accept(globalVersion);
        }
        return _reject(globalVersion);
    };
}
exports._makeCompatibilityCheck = _makeCompatibilityCheck;
/**
 * Test an API version to see if it is compatible with this API.
 *
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param version version of the API requesting an instance of the global API
 */ exports.isCompatible = _makeCompatibilityCheck(version_1.VERSION); //# sourceMappingURL=semver.js.map


/***/ }),

/***/ 479:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
__exportStar(__webpack_require__(3456), exports); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 6279:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports._globalThis = void 0;
/** only globals that common to node and browsers are allowed */ // eslint-disable-next-line node/no-unsupported-features/es-builtins
exports._globalThis = typeof globalThis === "object" ? globalThis : global; //# sourceMappingURL=globalThis.js.map


/***/ }),

/***/ 3456:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = (void 0) && (void 0).__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true,
        get: function() {
            return m[k];
        }
    });
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = (void 0) && (void 0).__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
__exportStar(__webpack_require__(6279), exports); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 978:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NoopTextMapPropagator = void 0;
/**
 * No-op implementations of {@link TextMapPropagator}.
 */ var NoopTextMapPropagator = /** @class */ function() {
    function NoopTextMapPropagator() {}
    /** Noop inject function does nothing */ NoopTextMapPropagator.prototype.inject = function(_context, _carrier) {};
    /** Noop extract function does nothing and returns the input context */ NoopTextMapPropagator.prototype.extract = function(context, _carrier) {
        return context;
    };
    NoopTextMapPropagator.prototype.fields = function() {
        return [];
    };
    return NoopTextMapPropagator;
}();
exports.NoopTextMapPropagator = NoopTextMapPropagator; //# sourceMappingURL=NoopTextMapPropagator.js.map


/***/ }),

/***/ 3458:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.defaultTextMapSetter = exports.defaultTextMapGetter = void 0;
exports.defaultTextMapGetter = {
    get: function(carrier, key) {
        if (carrier == null) {
            return undefined;
        }
        return carrier[key];
    },
    keys: function(carrier) {
        if (carrier == null) {
            return [];
        }
        return Object.keys(carrier);
    }
};
exports.defaultTextMapSetter = {
    set: function(carrier, key, value) {
        if (carrier == null) {
            return;
        }
        carrier[key] = value;
    }
}; //# sourceMappingURL=TextMapPropagator.js.map


/***/ }),

/***/ 1163:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NonRecordingSpan = void 0;
var invalid_span_constants_1 = __webpack_require__(7030);
/**
 * The NonRecordingSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */ var NonRecordingSpan = /** @class */ function() {
    function NonRecordingSpan(_spanContext) {
        if (_spanContext === void 0) {
            _spanContext = invalid_span_constants_1.INVALID_SPAN_CONTEXT;
        }
        this._spanContext = _spanContext;
    }
    // Returns a SpanContext.
    NonRecordingSpan.prototype.spanContext = function() {
        return this._spanContext;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttribute = function(_key, _value) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttributes = function(_attributes) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.addEvent = function(_name, _attributes) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setStatus = function(_status) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.updateName = function(_name) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.end = function(_endTime) {};
    // isRecording always returns false for NonRecordingSpan.
    NonRecordingSpan.prototype.isRecording = function() {
        return false;
    };
    // By default does nothing
    NonRecordingSpan.prototype.recordException = function(_exception, _time) {};
    return NonRecordingSpan;
}();
exports.NonRecordingSpan = NonRecordingSpan; //# sourceMappingURL=NonRecordingSpan.js.map


/***/ }),

/***/ 8903:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NoopTracer = void 0;
var context_1 = __webpack_require__(1603);
var context_utils_1 = __webpack_require__(6051);
var NonRecordingSpan_1 = __webpack_require__(1163);
var spancontext_utils_1 = __webpack_require__(7375);
var context = context_1.ContextAPI.getInstance();
/**
 * No-op implementations of {@link Tracer}.
 */ var NoopTracer = /** @class */ function() {
    function NoopTracer() {}
    // startSpan starts a noop span.
    NoopTracer.prototype.startSpan = function(name, options, context) {
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
            return new NonRecordingSpan_1.NonRecordingSpan();
        }
        var parentFromContext = context && context_utils_1.getSpanContext(context);
        if (isSpanContext(parentFromContext) && spancontext_utils_1.isSpanContextValid(parentFromContext)) {
            return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
        } else {
            return new NonRecordingSpan_1.NonRecordingSpan();
        }
    };
    NoopTracer.prototype.startActiveSpan = function(name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
            return;
        } else if (arguments.length === 2) {
            fn = arg2;
        } else if (arguments.length === 3) {
            opts = arg2;
            fn = arg3;
        } else {
            opts = arg2;
            ctx = arg3;
            fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : context.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = context_utils_1.setSpan(parentContext, span);
        return context.with(contextWithSpanSet, fn, undefined, span);
    };
    return NoopTracer;
}();
exports.NoopTracer = NoopTracer;
function isSpanContext(spanContext) {
    return typeof spanContext === "object" && typeof spanContext["spanId"] === "string" && typeof spanContext["traceId"] === "string" && typeof spanContext["traceFlags"] === "number";
} //# sourceMappingURL=NoopTracer.js.map


/***/ }),

/***/ 440:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.NoopTracerProvider = void 0;
var NoopTracer_1 = __webpack_require__(8903);
/**
 * An implementation of the {@link TracerProvider} which returns an impotent
 * Tracer for all calls to `getTracer`.
 *
 * All operations are no-op.
 */ var NoopTracerProvider = /** @class */ function() {
    function NoopTracerProvider() {}
    NoopTracerProvider.prototype.getTracer = function(_name, _version, _options) {
        return new NoopTracer_1.NoopTracer();
    };
    return NoopTracerProvider;
}();
exports.NoopTracerProvider = NoopTracerProvider; //# sourceMappingURL=NoopTracerProvider.js.map


/***/ }),

/***/ 6006:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ProxyTracer = void 0;
var NoopTracer_1 = __webpack_require__(8903);
var NOOP_TRACER = new NoopTracer_1.NoopTracer();
/**
 * Proxy tracer provided by the proxy tracer provider
 */ var ProxyTracer = /** @class */ function() {
    function ProxyTracer(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }
    ProxyTracer.prototype.startSpan = function(name, options, context) {
        return this._getTracer().startSpan(name, options, context);
    };
    ProxyTracer.prototype.startActiveSpan = function(_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    };
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */ ProxyTracer.prototype._getTracer = function() {
        if (this._delegate) {
            return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
            return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
    };
    return ProxyTracer;
}();
exports.ProxyTracer = ProxyTracer; //# sourceMappingURL=ProxyTracer.js.map


/***/ }),

/***/ 9766:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ProxyTracerProvider = void 0;
var ProxyTracer_1 = __webpack_require__(6006);
var NoopTracerProvider_1 = __webpack_require__(440);
var NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider();
/**
 * Tracer provider which provides {@link ProxyTracer}s.
 *
 * Before a delegate is set, tracers provided are NoOp.
 *   When a delegate is set, traces are provided from the delegate.
 *   When a delegate is set after tracers have already been provided,
 *   all tracers already provided will use the provided delegate implementation.
 */ var ProxyTracerProvider = /** @class */ function() {
    function ProxyTracerProvider() {}
    /**
     * Get a {@link ProxyTracer}
     */ ProxyTracerProvider.prototype.getTracer = function(name, version, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer_1.ProxyTracer(this, name, version, options);
    };
    ProxyTracerProvider.prototype.getDelegate = function() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    /**
     * Set the delegate tracer provider
     */ ProxyTracerProvider.prototype.setDelegate = function(delegate) {
        this._delegate = delegate;
    };
    ProxyTracerProvider.prototype.getDelegateTracer = function(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
    };
    return ProxyTracerProvider;
}();
exports.ProxyTracerProvider = ProxyTracerProvider; //# sourceMappingURL=ProxyTracerProvider.js.map


/***/ }),

/***/ 623:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=Sampler.js.map


/***/ }),

/***/ 2784:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SamplingDecision = void 0;
/**
 * A sampling decision that determines how a {@link Span} will be recorded
 * and collected.
 */ var SamplingDecision;
(function(SamplingDecision) {
    /**
     * `Span.isRecording() === false`, span will not be recorded and all events
     * and attributes will be dropped.
     */ SamplingDecision[SamplingDecision["NOT_RECORD"] = 0] = "NOT_RECORD";
    /**
     * `Span.isRecording() === true`, but `Sampled` flag in {@link TraceFlags}
     * MUST NOT be set.
     */ SamplingDecision[SamplingDecision["RECORD"] = 1] = "RECORD";
    /**
     * `Span.isRecording() === true` AND `Sampled` flag in {@link TraceFlags}
     * MUST be set.
     */ SamplingDecision[SamplingDecision["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
})(SamplingDecision = exports.SamplingDecision || (exports.SamplingDecision = {})); //# sourceMappingURL=SamplingResult.js.map


/***/ }),

/***/ 9550:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=SpanOptions.js.map


/***/ }),

/***/ 3110:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=attributes.js.map


/***/ }),

/***/ 6051:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getSpanContext = exports.setSpanContext = exports.deleteSpan = exports.setSpan = exports.getSpan = void 0;
var context_1 = __webpack_require__(1569);
var NonRecordingSpan_1 = __webpack_require__(1163);
/**
 * span key
 */ var SPAN_KEY = context_1.createContextKey("OpenTelemetry Context Key SPAN");
/**
 * Return the span if one exists
 *
 * @param context context to get span from
 */ function getSpan(context) {
    return context.getValue(SPAN_KEY) || undefined;
}
exports.getSpan = getSpan;
/**
 * Set the span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */ function setSpan(context, span) {
    return context.setValue(SPAN_KEY, span);
}
exports.setSpan = setSpan;
/**
 * Remove current span stored in the context
 *
 * @param context context to delete span from
 */ function deleteSpan(context) {
    return context.deleteValue(SPAN_KEY);
}
exports.deleteSpan = deleteSpan;
/**
 * Wrap span context in a NoopSpan and set as span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */ function setSpanContext(context, spanContext) {
    return setSpan(context, new NonRecordingSpan_1.NonRecordingSpan(spanContext));
}
exports.setSpanContext = setSpanContext;
/**
 * Get the span context of the span if it exists.
 *
 * @param context context to get values from
 */ function getSpanContext(context) {
    var _a;
    return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}
exports.getSpanContext = getSpanContext; //# sourceMappingURL=context-utils.js.map


/***/ }),

/***/ 5137:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TraceStateImpl = void 0;
var tracestate_validators_1 = __webpack_require__(3001);
var MAX_TRACE_STATE_ITEMS = 32;
var MAX_TRACE_STATE_LEN = 512;
var LIST_MEMBERS_SEPARATOR = ",";
var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
/**
 * TraceState must be a class and not a simple object type because of the spec
 * requirement (https://www.w3.org/TR/trace-context/#tracestate-field).
 *
 * Here is the list of allowed mutations:
 * - New key-value pair should be added into the beginning of the list
 * - The value of any key can be updated. Modified keys MUST be moved to the
 * beginning of the list.
 */ var TraceStateImpl = /** @class */ function() {
    function TraceStateImpl(rawTraceState) {
        this._internalState = new Map();
        if (rawTraceState) this._parse(rawTraceState);
    }
    TraceStateImpl.prototype.set = function(key, value) {
        // TODO: Benchmark the different approaches(map vs list) and
        // use the faster one.
        var traceState = this._clone();
        if (traceState._internalState.has(key)) {
            traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
    };
    TraceStateImpl.prototype.unset = function(key) {
        var traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
    };
    TraceStateImpl.prototype.get = function(key) {
        return this._internalState.get(key);
    };
    TraceStateImpl.prototype.serialize = function() {
        var _this = this;
        return this._keys().reduce(function(agg, key) {
            agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + _this.get(key));
            return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
    };
    TraceStateImpl.prototype._parse = function(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN) return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reverse() // Store in reverse so new keys (.set(...)) will be placed at the beginning
        .reduce(function(agg, part) {
            var listMember = part.trim(); // Optional Whitespace (OWS) handling
            var i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
            if (i !== -1) {
                var key = listMember.slice(0, i);
                var value = listMember.slice(i + 1, part.length);
                if (tracestate_validators_1.validateKey(key) && tracestate_validators_1.validateValue(value)) {
                    agg.set(key, value);
                } else {
                // TODO: Consider to add warning log
                }
            }
            return agg;
        }, new Map());
        // Because of the reverse() requirement, trunc must be done after map is created
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
            this._internalState = new Map(Array.from(this._internalState.entries()).reverse() // Use reverse same as original tracestate parse chain
            .slice(0, MAX_TRACE_STATE_ITEMS));
        }
    };
    TraceStateImpl.prototype._keys = function() {
        return Array.from(this._internalState.keys()).reverse();
    };
    TraceStateImpl.prototype._clone = function() {
        var traceState = new TraceStateImpl();
        traceState._internalState = new Map(this._internalState);
        return traceState;
    };
    return TraceStateImpl;
}();
exports.TraceStateImpl = TraceStateImpl; //# sourceMappingURL=tracestate-impl.js.map


/***/ }),

/***/ 3001:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.validateValue = exports.validateKey = void 0;
var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
var VALID_KEY = "[a-z]" + VALID_KEY_CHAR_RANGE + "{0,255}";
var VALID_VENDOR_KEY = "[a-z0-9]" + VALID_KEY_CHAR_RANGE + "{0,240}@[a-z]" + VALID_KEY_CHAR_RANGE + "{0,13}";
var VALID_KEY_REGEX = new RegExp("^(?:" + VALID_KEY + "|" + VALID_VENDOR_KEY + ")$");
var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
/**
 * Key is opaque string up to 256 characters printable. It MUST begin with a
 * lowercase letter, and can only contain lowercase letters a-z, digits 0-9,
 * underscores _, dashes -, asterisks *, and forward slashes /.
 * For multi-tenant vendor scenarios, an at sign (@) can be used to prefix the
 * vendor name. Vendors SHOULD set the tenant ID at the beginning of the key.
 * see https://www.w3.org/TR/trace-context/#key
 */ function validateKey(key) {
    return VALID_KEY_REGEX.test(key);
}
exports.validateKey = validateKey;
/**
 * Value is opaque string up to 256 characters printable ASCII RFC0020
 * characters (i.e., the range 0x20 to 0x7E) except comma , and =.
 */ function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
}
exports.validateValue = validateValue; //# sourceMappingURL=tracestate-validators.js.map


/***/ }),

/***/ 6937:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createTraceState = void 0;
var tracestate_impl_1 = __webpack_require__(5137);
function createTraceState(rawTraceState) {
    return new tracestate_impl_1.TraceStateImpl(rawTraceState);
}
exports.createTraceState = createTraceState; //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 7030:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
var trace_flags_1 = __webpack_require__(4111);
exports.INVALID_SPANID = "0000000000000000";
exports.INVALID_TRACEID = "00000000000000000000000000000000";
exports.INVALID_SPAN_CONTEXT = {
    traceId: exports.INVALID_TRACEID,
    spanId: exports.INVALID_SPANID,
    traceFlags: trace_flags_1.TraceFlags.NONE
}; //# sourceMappingURL=invalid-span-constants.js.map


/***/ }),

/***/ 7266:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=link.js.map


/***/ }),

/***/ 2176:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=span.js.map


/***/ }),

/***/ 3418:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=span_context.js.map


/***/ }),

/***/ 1498:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SpanKind = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var SpanKind;
(function(SpanKind) {
    /** Default value. Indicates that the span is used internally. */ SpanKind[SpanKind["INTERNAL"] = 0] = "INTERNAL";
    /**
     * Indicates that the span covers server-side handling of an RPC or other
     * remote request.
     */ SpanKind[SpanKind["SERVER"] = 1] = "SERVER";
    /**
     * Indicates that the span covers the client-side wrapper around an RPC or
     * other remote request.
     */ SpanKind[SpanKind["CLIENT"] = 2] = "CLIENT";
    /**
     * Indicates that the span describes producer sending a message to a
     * broker. Unlike client and server, there is no direct critical path latency
     * relationship between producer and consumer spans.
     */ SpanKind[SpanKind["PRODUCER"] = 3] = "PRODUCER";
    /**
     * Indicates that the span describes consumer receiving a message from a
     * broker. Unlike client and server, there is no direct critical path latency
     * relationship between producer and consumer spans.
     */ SpanKind[SpanKind["CONSUMER"] = 4] = "CONSUMER";
})(SpanKind = exports.SpanKind || (exports.SpanKind = {})); //# sourceMappingURL=span_kind.js.map


/***/ }),

/***/ 7375:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.wrapSpanContext = exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var invalid_span_constants_1 = __webpack_require__(7030);
var NonRecordingSpan_1 = __webpack_require__(1163);
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== invalid_span_constants_1.INVALID_TRACEID;
}
exports.isValidTraceId = isValidTraceId;
function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== invalid_span_constants_1.INVALID_SPANID;
}
exports.isValidSpanId = isValidSpanId;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */ function isSpanContextValid(spanContext) {
    return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
}
exports.isSpanContextValid = isSpanContextValid;
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */ function wrapSpanContext(spanContext) {
    return new NonRecordingSpan_1.NonRecordingSpan(spanContext);
}
exports.wrapSpanContext = wrapSpanContext; //# sourceMappingURL=spancontext-utils.js.map


/***/ }),

/***/ 5013:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SpanStatusCode = void 0;
/**
 * An enumeration of status codes.
 */ var SpanStatusCode;
(function(SpanStatusCode) {
    /**
     * The default status.
     */ SpanStatusCode[SpanStatusCode["UNSET"] = 0] = "UNSET";
    /**
     * The operation has been validated by an Application developer or
     * Operator to have completed successfully.
     */ SpanStatusCode[SpanStatusCode["OK"] = 1] = "OK";
    /**
     * The operation contains an error.
     */ SpanStatusCode[SpanStatusCode["ERROR"] = 2] = "ERROR";
})(SpanStatusCode = exports.SpanStatusCode || (exports.SpanStatusCode = {})); //# sourceMappingURL=status.js.map


/***/ }),

/***/ 4111:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.TraceFlags = void 0;
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var TraceFlags;
(function(TraceFlags) {
    /** Represents no flag set. */ TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
    /** Bit to represent whether trace is sampled in trace flags. */ TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags = exports.TraceFlags || (exports.TraceFlags = {})); //# sourceMappingURL=trace_flags.js.map


/***/ }),

/***/ 8699:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=trace_state.js.map


/***/ }),

/***/ 7308:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=tracer.js.map


/***/ }),

/***/ 1990:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=tracer_options.js.map


/***/ }),

/***/ 1430:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
})); //# sourceMappingURL=tracer_provider.js.map


/***/ }),

/***/ 6031:
/***/ ((__unused_webpack_module, exports) => {


/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.VERSION = void 0;
// this is autogenerated file, see scripts/version-update.js
exports.VERSION = "1.1.0"; //# sourceMappingURL=version.js.map


/***/ }),

/***/ 6490:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    prefixes: function() {
        return prefixes;
    },
    wait: function() {
        return wait;
    },
    error: function() {
        return error;
    },
    warn: function() {
        return warn;
    },
    ready: function() {
        return ready;
    },
    info: function() {
        return info;
    },
    event: function() {
        return event;
    },
    trace: function() {
        return trace;
    },
    warnOnce: function() {
        return warnOnce;
    }
});
const _chalk = /*#__PURE__*/ _interop_require_default(__webpack_require__(4701));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const prefixes = {
    wait: "- " + _chalk.default.cyan("wait"),
    error: "- " + _chalk.default.red("error"),
    warn: "- " + _chalk.default.yellow("warn"),
    ready: "- " + _chalk.default.green("ready"),
    info: "- " + _chalk.default.cyan("info"),
    event: "- " + _chalk.default.magenta("event"),
    trace: "- " + _chalk.default.magenta("trace")
};
function wait(...message) {
    console.log(prefixes.wait, ...message);
}
function error(...message) {
    console.error(prefixes.error, ...message);
}
function warn(...message) {
    console.warn(prefixes.warn, ...message);
}
function ready(...message) {
    console.log(prefixes.ready, ...message);
}
function info(...message) {
    console.log(prefixes.info, ...message);
}
function event(...message) {
    console.log(prefixes.event, ...message);
}
function trace(...message) {
    console.log(prefixes.trace, ...message);
}
const warnOnceMessages = new Set();
function warnOnce(...message) {
    if (!warnOnceMessages.has(message[0])) {
        warnOnceMessages.add(message.join(" "));
        warn(...message);
    }
} //# sourceMappingURL=log.js.map


/***/ }),

/***/ 189:
/***/ ((module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    RSC: function() {
        return RSC;
    },
    ACTION: function() {
        return ACTION;
    },
    NEXT_ROUTER_STATE_TREE: function() {
        return NEXT_ROUTER_STATE_TREE;
    },
    NEXT_ROUTER_PREFETCH: function() {
        return NEXT_ROUTER_PREFETCH;
    },
    NEXT_URL: function() {
        return NEXT_URL;
    },
    FETCH_CACHE_HEADER: function() {
        return FETCH_CACHE_HEADER;
    },
    RSC_CONTENT_TYPE_HEADER: function() {
        return RSC_CONTENT_TYPE_HEADER;
    },
    RSC_VARY_HEADER: function() {
        return RSC_VARY_HEADER;
    },
    FLIGHT_PARAMETERS: function() {
        return FLIGHT_PARAMETERS;
    }
});
const RSC = "RSC";
const ACTION = "Next-Action";
const NEXT_ROUTER_STATE_TREE = "Next-Router-State-Tree";
const NEXT_ROUTER_PREFETCH = "Next-Router-Prefetch";
const NEXT_URL = "Next-Url";
const FETCH_CACHE_HEADER = "x-vercel-sc-headers";
const RSC_CONTENT_TYPE_HEADER = "text/x-component";
const RSC_VARY_HEADER = RSC + ", " + NEXT_ROUTER_STATE_TREE + ", " + NEXT_ROUTER_PREFETCH;
const FLIGHT_PARAMETERS = [
    [
        RSC
    ],
    [
        NEXT_ROUTER_STATE_TREE
    ],
    [
        NEXT_ROUTER_PREFETCH
    ]
];
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-router-headers.js.map


/***/ }),

/***/ 6337:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "DraftMode", ({
    enumerable: true,
    get: function() {
        return DraftMode;
    }
}));
const _staticgenerationbailout = __webpack_require__(9282);
class DraftMode {
    get isEnabled() {
        return this._provider.isEnabled;
    }
    enable() {
        if ((0, _staticgenerationbailout.staticGenerationBailout)("draftMode().enable()")) {
            return;
        }
        return this._provider.enable();
    }
    disable() {
        if ((0, _staticgenerationbailout.staticGenerationBailout)("draftMode().disable()")) {
            return;
        }
        return this._provider.disable();
    }
    constructor(provider){
        this._provider = provider;
    }
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=draft-mode.js.map


/***/ }),

/***/ 904:
/***/ ((module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    headers: function() {
        return headers;
    },
    cookies: function() {
        return cookies;
    },
    draftMode: function() {
        return draftMode;
    }
});
const _requestcookies = __webpack_require__(127);
const _headers = __webpack_require__(1778);
const _cookies = __webpack_require__(8306);
const _requestasyncstorage = __webpack_require__(8214);
const _actionasyncstorage = __webpack_require__(7797);
const _staticgenerationbailout = __webpack_require__(9282);
const _draftmode = __webpack_require__(6337);
function headers() {
    if ((0, _staticgenerationbailout.staticGenerationBailout)("headers")) {
        return _headers.HeadersAdapter.seal(new Headers({}));
    }
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error("Invariant: Method expects to have requestAsyncStorage, none available");
    }
    return requestStore.headers;
}
function cookies() {
    if ((0, _staticgenerationbailout.staticGenerationBailout)("cookies")) {
        return _requestcookies.RequestCookiesAdapter.seal(new _cookies.RequestCookies(new Headers({})));
    }
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error("Invariant: Method expects to have requestAsyncStorage, none available");
    }
    const asyncActionStore = _actionasyncstorage.actionAsyncStorage.getStore();
    if (asyncActionStore && (asyncActionStore.isAction || asyncActionStore.isAppRoute)) {
        // We can't conditionally return different types here based on the context.
        // To avoid confusion, we always return the readonly type here.
        return requestStore.mutableCookies;
    }
    return requestStore.cookies;
}
function draftMode() {
    const requestStore = _requestasyncstorage.requestAsyncStorage.getStore();
    if (!requestStore) {
        throw new Error("Invariant: Method expects to have requestAsyncStorage, none available");
    }
    return new _draftmode.DraftMode(requestStore.draftMode);
}
if ((typeof exports.default === "function" || typeof exports.default === "object" && exports.default !== null) && typeof exports.default.__esModule === "undefined") {
    Object.defineProperty(exports.default, "__esModule", {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=headers.js.map


/***/ }),

/***/ 4701:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return _default;
    }
}));
let chalk;
if (false) {} else {
    chalk = __webpack_require__(4426);
}
const _default = chalk; //# sourceMappingURL=chalk.js.map


/***/ }),

/***/ 6593:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getCookieParser: function() {
        return getCookieParser;
    },
    sendStatusCode: function() {
        return sendStatusCode;
    },
    redirect: function() {
        return redirect;
    },
    checkIsOnDemandRevalidate: function() {
        return checkIsOnDemandRevalidate;
    },
    COOKIE_NAME_PRERENDER_BYPASS: function() {
        return COOKIE_NAME_PRERENDER_BYPASS;
    },
    COOKIE_NAME_PRERENDER_DATA: function() {
        return COOKIE_NAME_PRERENDER_DATA;
    },
    RESPONSE_LIMIT_DEFAULT: function() {
        return RESPONSE_LIMIT_DEFAULT;
    },
    SYMBOL_PREVIEW_DATA: function() {
        return SYMBOL_PREVIEW_DATA;
    },
    SYMBOL_CLEARED_COOKIES: function() {
        return SYMBOL_CLEARED_COOKIES;
    },
    clearPreviewData: function() {
        return clearPreviewData;
    },
    ApiError: function() {
        return ApiError;
    },
    sendError: function() {
        return sendError;
    },
    setLazyProp: function() {
        return setLazyProp;
    }
});
const _headers = __webpack_require__(1778);
const _constants = __webpack_require__(2523);
function getCookieParser(headers) {
    return function parseCookie() {
        const { cookie  } = headers;
        if (!cookie) {
            return {};
        }
        const { parse: parseCookieFn  } = __webpack_require__(252);
        return parseCookieFn(Array.isArray(cookie) ? cookie.join("; ") : cookie);
    };
}
function sendStatusCode(res, statusCode) {
    res.statusCode = statusCode;
    return res;
}
function redirect(res, statusOrUrl, url) {
    if (typeof statusOrUrl === "string") {
        url = statusOrUrl;
        statusOrUrl = 307;
    }
    if (typeof statusOrUrl !== "number" || typeof url !== "string") {
        throw new Error(`Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`);
    }
    res.writeHead(statusOrUrl, {
        Location: url
    });
    res.write(url);
    res.end();
    return res;
}
function checkIsOnDemandRevalidate(req, previewProps) {
    const headers = _headers.HeadersAdapter.from(req.headers);
    const previewModeId = headers.get(_constants.PRERENDER_REVALIDATE_HEADER);
    const isOnDemandRevalidate = previewModeId === previewProps.previewModeId;
    const revalidateOnlyGenerated = headers.has(_constants.PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER);
    return {
        isOnDemandRevalidate,
        revalidateOnlyGenerated
    };
}
const COOKIE_NAME_PRERENDER_BYPASS = `__prerender_bypass`;
const COOKIE_NAME_PRERENDER_DATA = `__next_preview_data`;
const RESPONSE_LIMIT_DEFAULT = 4 * 1024 * 1024;
const SYMBOL_PREVIEW_DATA = Symbol(COOKIE_NAME_PRERENDER_DATA);
const SYMBOL_CLEARED_COOKIES = Symbol(COOKIE_NAME_PRERENDER_BYPASS);
function clearPreviewData(res, options = {}) {
    if (SYMBOL_CLEARED_COOKIES in res) {
        return res;
    }
    const { serialize  } = __webpack_require__(252);
    const previous = res.getHeader("Set-Cookie");
    res.setHeader(`Set-Cookie`, [
        ...typeof previous === "string" ? [
            previous
        ] : Array.isArray(previous) ? previous : [],
        serialize(COOKIE_NAME_PRERENDER_BYPASS, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        }),
        serialize(COOKIE_NAME_PRERENDER_DATA, "", {
            // To delete a cookie, set `expires` to a date in the past:
            // https://tools.ietf.org/html/rfc6265#section-4.1.1
            // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
            expires: new Date(0),
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            ...options.path !== undefined ? {
                path: options.path
            } : undefined
        })
    ]);
    Object.defineProperty(res, SYMBOL_CLEARED_COOKIES, {
        value: true,
        enumerable: false
    });
    return res;
}
class ApiError extends Error {
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode;
    }
}
function sendError(res, statusCode, message) {
    res.statusCode = statusCode;
    res.statusMessage = message;
    res.end(message);
}
function setLazyProp({ req  }, prop, getter) {
    const opts = {
        configurable: true,
        enumerable: true
    };
    const optsReset = {
        ...opts,
        writable: true
    };
    Object.defineProperty(req, prop, {
        ...opts,
        get: ()=>{
            const value = getter();
            // we set the property on the object to avoid recalculating it
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
            return value;
        },
        set: (value)=>{
            Object.defineProperty(req, prop, {
                ...optsReset,
                value
            });
        }
    });
} //# sourceMappingURL=index.js.map


/***/ }),

/***/ 2484:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "DraftModeProvider", ({
    enumerable: true,
    get: function() {
        return DraftModeProvider;
    }
}));
const _apiutils = __webpack_require__(6593);
class DraftModeProvider {
    constructor(previewProps, req, cookies, mutableCookies){
        var _cookies_get;
        // The logic for draftMode() is very similar to tryGetPreviewData()
        // but Draft Mode does not have any data associated with it.
        const isOnDemandRevalidate = previewProps && (0, _apiutils.checkIsOnDemandRevalidate)(req, previewProps).isOnDemandRevalidate;
        const cookieValue = (_cookies_get = cookies.get(_apiutils.COOKIE_NAME_PRERENDER_BYPASS)) == null ? void 0 : _cookies_get.value;
        this.isEnabled = Boolean(!isOnDemandRevalidate && cookieValue && previewProps && cookieValue === previewProps.previewModeId);
        this._previewModeId = previewProps == null ? void 0 : previewProps.previewModeId;
        this._mutableCookies = mutableCookies;
    }
    enable() {
        if (!this._previewModeId) {
            throw new Error("Invariant: previewProps missing previewModeId this should never happen");
        }
        this._mutableCookies.set({
            name: _apiutils.COOKIE_NAME_PRERENDER_BYPASS,
            value: this._previewModeId,
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/"
        });
    }
    disable() {
        // To delete a cookie, set `expires` to a date in the past:
        // https://tools.ietf.org/html/rfc6265#section-4.1.1
        // `Max-Age: 0` is not valid, thus ignored, and the cookie is persisted.
        this._mutableCookies.set({
            name: _apiutils.COOKIE_NAME_PRERENDER_BYPASS,
            value: "",
            httpOnly: true,
            sameSite:  true ? "none" : 0,
            secure: "production" !== "development",
            path: "/",
            expires: new Date(0)
        });
    }
} //# sourceMappingURL=draft-mode-provider.js.map


/***/ }),

/***/ 9030:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "RequestAsyncStorageWrapper", ({
    enumerable: true,
    get: function() {
        return RequestAsyncStorageWrapper;
    }
}));
const _approuterheaders = __webpack_require__(189);
const _headers = __webpack_require__(1778);
const _requestcookies = __webpack_require__(127);
const _cookies = __webpack_require__(8306);
const _draftmodeprovider = __webpack_require__(2484);
function getHeaders(headers) {
    const cleaned = _headers.HeadersAdapter.from(headers);
    for (const param of _approuterheaders.FLIGHT_PARAMETERS){
        cleaned.delete(param.toString().toLowerCase());
    }
    return _headers.HeadersAdapter.seal(cleaned);
}
function getCookies(headers) {
    const cookies = new _cookies.RequestCookies(_headers.HeadersAdapter.from(headers));
    return _requestcookies.RequestCookiesAdapter.seal(cookies);
}
function getMutableCookies(headers, res) {
    const cookies = new _cookies.RequestCookies(_headers.HeadersAdapter.from(headers));
    return _requestcookies.MutableRequestCookiesAdapter.wrap(cookies, res);
}
const RequestAsyncStorageWrapper = {
    /**
   * Wrap the callback with the given store so it can access the underlying
   * store using hooks.
   *
   * @param storage underlying storage object returned by the module
   * @param context context to seed the store
   * @param callback function to call within the scope of the context
   * @returns the result returned by the callback
   */ wrap (storage, { req , res , renderOpts  }, callback) {
        let previewProps = undefined;
        if (renderOpts && "previewProps" in renderOpts) {
            // TODO: investigate why previewProps isn't on RenderOpts
            previewProps = renderOpts.previewProps;
        }
        const cache = {};
        const store = {
            get headers () {
                if (!cache.headers) {
                    // Seal the headers object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.headers = getHeaders(req.headers);
                }
                return cache.headers;
            },
            get cookies () {
                if (!cache.cookies) {
                    // Seal the cookies object that'll freeze out any methods that could
                    // mutate the underlying data.
                    cache.cookies = getCookies(req.headers);
                }
                return cache.cookies;
            },
            get mutableCookies () {
                if (!cache.mutableCookies) {
                    cache.mutableCookies = getMutableCookies(req.headers, res);
                }
                return cache.mutableCookies;
            },
            get draftMode () {
                if (!cache.draftMode) {
                    cache.draftMode = new _draftmodeprovider.DraftModeProvider(previewProps, req, this.cookies, this.mutableCookies);
                }
                return cache.draftMode;
            }
        };
        return storage.run(store, callback, store);
    }
}; //# sourceMappingURL=request-async-storage-wrapper.js.map


/***/ }),

/***/ 3959:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "StaticGenerationAsyncStorageWrapper", ({
    enumerable: true,
    get: function() {
        return StaticGenerationAsyncStorageWrapper;
    }
}));
const StaticGenerationAsyncStorageWrapper = {
    wrap (storage, { pathname , renderOpts  }, callback) {
        /**
     * Rules of Static & Dynamic HTML:
     *
     *    1.) We must generate static HTML unless the caller explicitly opts
     *        in to dynamic HTML support.
     *
     *    2.) If dynamic HTML support is requested, we must honor that request
     *        or throw an error. It is the sole responsibility of the caller to
     *        ensure they aren't e.g. requesting dynamic HTML for an AMP page.
     *
     * These rules help ensure that other existing features like request caching,
     * coalescing, and ISR continue working as intended.
     */ const isStaticGeneration = !renderOpts.supportsDynamicHTML && !renderOpts.isBot;
        const store = {
            isStaticGeneration,
            pathname,
            originalPathname: renderOpts.originalPathname,
            incrementalCache: // so that it can access the fs cache without mocks
            renderOpts.incrementalCache || globalThis.__incrementalCache,
            isRevalidate: renderOpts.isRevalidate,
            isPrerendering: renderOpts.nextExport,
            fetchCache: renderOpts.fetchCache,
            isOnDemandRevalidate: renderOpts.isOnDemandRevalidate
        };
        // TODO: remove this when we resolve accessing the store outside the execution context
        renderOpts.store = store;
        return storage.run(store, callback, store);
    }
}; //# sourceMappingURL=static-generation-async-storage-wrapper.js.map


/***/ }),

/***/ 3624:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "RouteKind", ({
    enumerable: true,
    get: function() {
        return RouteKind;
    }
}));
var RouteKind;
(function(RouteKind) {
    RouteKind[/**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ "PAGES"] = "PAGES";
    RouteKind[/**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ "PAGES_API"] = "PAGES_API";
    RouteKind[/**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ "APP_PAGE"] = "APP_PAGE";
    RouteKind[/**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ "APP_ROUTE"] = "APP_ROUTE";
})(RouteKind || (RouteKind = {})); //# sourceMappingURL=route-kind.js.map


/***/ }),

/***/ 9019:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "autoImplementMethods", ({
    enumerable: true,
    get: function() {
        return autoImplementMethods;
    }
}));
const _http = __webpack_require__(6855);
const _responsehandlers = __webpack_require__(8905);
const AUTOMATIC_ROUTE_METHODS = [
    "HEAD",
    "OPTIONS"
];
function autoImplementMethods(handlers) {
    // Loop through all the HTTP methods to create the initial methods object.
    // Each of the methods will be set to the the 405 response handler.
    const methods = _http.HTTP_METHODS.reduce((acc, method)=>({
            ...acc,
            // If the userland module implements the method, then use it. Otherwise,
            // use the 405 response handler.
            [method]: handlers[method] ?? _responsehandlers.handleMethodNotAllowedResponse
        }), {});
    // Get all the methods that could be automatically implemented that were not
    // implemented by the userland module.
    const implemented = new Set(_http.HTTP_METHODS.filter((method)=>handlers[method]));
    const missing = AUTOMATIC_ROUTE_METHODS.filter((method)=>!implemented.has(method));
    // Loop over the missing methods to automatically implement them if we can.
    for (const method of missing){
        // If the userland module doesn't implement the HEAD method, then
        // we'll automatically implement it by calling the GET method (if it
        // exists).
        if (method === "HEAD") {
            // If the userland module doesn't implement the GET method, then
            // we're done.
            if (!handlers.GET) break;
            // Implement the HEAD method by calling the GET method.
            methods.HEAD = handlers.GET;
            // Mark it as implemented.
            implemented.add("HEAD");
            continue;
        }
        // If OPTIONS is not provided then implement it.
        if (method === "OPTIONS") {
            // TODO: check if HEAD is implemented, if so, use it to add more headers
            // Get all the methods that were implemented by the userland module.
            const allow = [
                "OPTIONS",
                ...implemented
            ];
            // If the list of methods doesn't include HEAD, but it includes GET, then
            // add HEAD as it's automatically implemented.
            if (!implemented.has("HEAD") && implemented.has("GET")) {
                allow.push("HEAD");
            }
            // Sort and join the list with commas to create the `Allow` header. See:
            // https://httpwg.org/specs/rfc9110.html#field.allow
            const headers = {
                Allow: allow.sort().join(", ")
            };
            // Implement the OPTIONS method by returning a 204 response with the
            // `Allow` header.
            methods.OPTIONS = ()=>new Response(null, {
                    status: 204,
                    headers
                });
            // Mark this method as implemented.
            implemented.add("OPTIONS");
            continue;
        }
        throw new Error(`Invariant: should handle all automatic implementable methods, got method: ${method}`);
    }
    return methods;
} //# sourceMappingURL=auto-implement-methods.js.map


/***/ }),

/***/ 8406:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Cleans a URL by stripping the protocol, host, and search params.
 *
 * @param urlString the url to clean
 * @returns the cleaned url
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "cleanURL", ({
    enumerable: true,
    get: function() {
        return cleanURL;
    }
}));
function cleanURL(urlString) {
    const url = new URL(urlString);
    url.host = "localhost:3000";
    url.search = "";
    url.protocol = "http";
    return url.toString();
} //# sourceMappingURL=clean-url.js.map


/***/ }),

/***/ 6850:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getNonStaticMethods", ({
    enumerable: true,
    get: function() {
        return getNonStaticMethods;
    }
}));
const NON_STATIC_METHODS = [
    "OPTIONS",
    "POST",
    "PUT",
    "DELETE",
    "PATCH"
];
function getNonStaticMethods(handlers) {
    // We can currently only statically optimize if only GET/HEAD are used as
    // prerender can't be used conditionally based on the method currently.
    const methods = NON_STATIC_METHODS.filter((method)=>handlers[method]);
    if (methods.length === 0) return false;
    return methods;
} //# sourceMappingURL=get-non-static-methods.js.map


/***/ }),

/***/ 1899:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Get pathname from absolute path.
 *
 * @param absolutePath the absolute path
 * @returns the pathname
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getPathnameFromAbsolutePath", ({
    enumerable: true,
    get: function() {
        return getPathnameFromAbsolutePath;
    }
}));
function getPathnameFromAbsolutePath(absolutePath) {
    // Remove prefix including app dir
    let appDir = "/app/";
    if (!absolutePath.includes(appDir)) {
        appDir = "\\app\\";
    }
    const [, ...parts] = absolutePath.split(appDir);
    const relativePath = appDir[0] + parts.join(appDir);
    // remove extension
    const pathname = relativePath.split(".").slice(0, -1).join(".");
    return pathname;
} //# sourceMappingURL=get-pathname-from-absolute-path.js.map


/***/ }),

/***/ 7616:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "proxyRequest", ({
    enumerable: true,
    get: function() {
        return proxyRequest;
    }
}));
const _cookies = __webpack_require__(7783);
const _nexturl = __webpack_require__(4576);
const _cleanurl = __webpack_require__(8406);
function proxyRequest(request, { dynamic  }, hooks) {
    function handleNextUrlBailout(prop) {
        switch(prop){
            case "search":
            case "searchParams":
            case "toString":
            case "href":
            case "origin":
                hooks.staticGenerationBailout(`nextUrl.${prop}`);
                return;
            default:
                return;
        }
    }
    const cache = {};
    const handleForceStatic = (url, prop)=>{
        switch(prop){
            case "search":
                return "";
            case "searchParams":
                if (!cache.searchParams) cache.searchParams = new URLSearchParams();
                return cache.searchParams;
            case "url":
            case "href":
                if (!cache.url) cache.url = (0, _cleanurl.cleanURL)(url);
                return cache.url;
            case "toJSON":
            case "toString":
                if (!cache.url) cache.url = (0, _cleanurl.cleanURL)(url);
                if (!cache.toString) cache.toString = ()=>cache.url;
                return cache.toString;
            case "headers":
                if (!cache.headers) cache.headers = new Headers();
                return cache.headers;
            case "cookies":
                if (!cache.headers) cache.headers = new Headers();
                if (!cache.cookies) cache.cookies = new _cookies.RequestCookies(cache.headers);
                return cache.cookies;
            case "clone":
                if (!cache.url) cache.url = (0, _cleanurl.cleanURL)(url);
                return ()=>new _nexturl.NextURL(cache.url);
            default:
                break;
        }
    };
    const wrappedNextUrl = new Proxy(request.nextUrl, {
        get (target, prop) {
            handleNextUrlBailout(prop);
            if (dynamic === "force-static" && typeof prop === "string") {
                const result = handleForceStatic(target.href, prop);
                if (result !== undefined) return result;
            }
            const value = target[prop];
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        },
        set (target, prop, value) {
            handleNextUrlBailout(prop);
            target[prop] = value;
            return true;
        }
    });
    const handleReqBailout = (prop)=>{
        switch(prop){
            case "headers":
                hooks.headerHooks.headers();
                return;
            // if request.url is accessed directly instead of
            // request.nextUrl we bail since it includes query
            // values that can be relied on dynamically
            case "url":
            case "body":
            case "blob":
            case "json":
            case "text":
            case "arrayBuffer":
            case "formData":
                hooks.staticGenerationBailout(`request.${prop}`);
                return;
            default:
                return;
        }
    };
    return new Proxy(request, {
        get (target, prop) {
            handleReqBailout(prop);
            if (prop === "nextUrl") {
                return wrappedNextUrl;
            }
            if (dynamic === "force-static" && typeof prop === "string") {
                const result = handleForceStatic(target.url, prop);
                if (result !== undefined) return result;
            }
            const value = target[prop];
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        },
        set (target, prop, value) {
            handleReqBailout(prop);
            target[prop] = value;
            return true;
        }
    });
} //# sourceMappingURL=proxy-request.js.map


/***/ }),

/***/ 5580:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "resolveHandlerError", ({
    enumerable: true,
    get: function() {
        return resolveHandlerError;
    }
}));
const _notfound = __webpack_require__(3716);
const _redirect = __webpack_require__(8295);
const _responsehandlers = __webpack_require__(8905);
function resolveHandlerError(err) {
    if ((0, _redirect.isRedirectError)(err)) {
        const redirect = (0, _redirect.getURLFromRedirectError)(err);
        if (!redirect) {
            throw new Error("Invariant: Unexpected redirect url format");
        }
        // This is a redirect error! Send the redirect response.
        return (0, _responsehandlers.handleTemporaryRedirectResponse)(redirect, err.mutableCookies);
    }
    if ((0, _notfound.isNotFoundError)(err)) {
        // This is a not found error! Send the not found response.
        return (0, _responsehandlers.handleNotFoundResponse)();
    }
    // Return false to indicate that this is not a handled error.
    return false;
} //# sourceMappingURL=resolve-handler-error.js.map


/***/ }),

/***/ 9532:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AppRouteRouteModule: function() {
        return AppRouteRouteModule;
    },
    default: function() {
        return _default;
    }
});
const _routemodule = __webpack_require__(6669);
const _requestasyncstoragewrapper = __webpack_require__(9030);
const _staticgenerationasyncstoragewrapper = __webpack_require__(3959);
const _responsehandlers = __webpack_require__(8905);
const _http = __webpack_require__(6855);
const _patchfetch = __webpack_require__(5110);
const _tracer = __webpack_require__(6730);
const _constants = __webpack_require__(5511);
const _getpathnamefromabsolutepath = __webpack_require__(1899);
const _proxyrequest = __webpack_require__(7616);
const _resolvehandlererror = __webpack_require__(5580);
const _routekind = __webpack_require__(3624);
const _log = /*#__PURE__*/ _interop_require_wildcard(__webpack_require__(6490));
const _autoimplementmethods = __webpack_require__(9019);
const _getnonstaticmethods = __webpack_require__(6850);
const _requestcookies = __webpack_require__(127);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
class AppRouteRouteModule extends _routemodule.RouteModule {
    constructor({ userland , pathname , resolvedPagePath , nextConfigOutput  }){
        super({
            userland
        });
        /**
   * When true, indicates that the global interfaces have been patched via the
   * `patch()` method.
   */ this.hasSetup = false;
        this.definition = {
            kind: _routekind.RouteKind.APP_ROUTE,
            pathname,
            // The following aren't needed for the route handler.
            page: "",
            bundlePath: "",
            filename: ""
        };
        this.pathname = pathname;
        this.resolvedPagePath = resolvedPagePath;
        this.nextConfigOutput = nextConfigOutput;
        // Automatically implement some methods if they aren't implemented by the
        // userland module.
        this.methods = (0, _autoimplementmethods.autoImplementMethods)(userland);
        // Get the non-static methods for this route.
        this.nonStaticMethods = (0, _getnonstaticmethods.getNonStaticMethods)(userland);
        // Get the dynamic property from the userland module.
        this.dynamic = this.userland.dynamic;
        if (this.nextConfigOutput === "export") {
            if (!this.dynamic || this.dynamic === "auto") {
                this.dynamic = "error";
            } else if (this.dynamic === "force-dynamic") {
                throw new Error(`export const dynamic = "force-dynamic" on page "${pathname}" cannot be used with "output: export". See more info here: https://nextjs.org/docs/advanced-features/static-html-export`);
            }
        }
    }
    /**
   * Validates the userland module to ensure the exported methods and properties
   * are valid.
   */ async setup() {
        // If we've already setup, then return.
        if (this.hasSetup) return;
        // Mark the module as setup. The following warnings about the userland
        // module will run if we're in development. If the module files are modified
        // when in development, then the require cache will be busted for it and
        // this method will be called again (resetting the `hasSetup` flag).
        this.hasSetup = true;
        // We only warn in development after here, so return if we're not in
        // development.
        if (false) {}
    }
    /**
   * Resolves the handler function for the given method.
   *
   * @param method the requested method
   * @returns the handler function for the given method
   */ resolve(method) {
        // Ensure that the requested method is a valid method (to prevent RCE's).
        if (!(0, _http.isHTTPMethod)(method)) return _responsehandlers.handleBadRequestResponse;
        // Return the handler.
        return this.methods[method];
    }
    /**
   * Executes the route handler.
   */ async execute(request, context) {
        // Get the handler function for the given method.
        const handler = this.resolve(request.method);
        // Get the context for the request.
        const requestContext = {
            req: request
        };
        requestContext.renderOpts = {
            previewProps: context.prerenderManifest.preview
        };
        // Get the context for the static generation.
        const staticGenerationContext = {
            pathname: this.definition.pathname,
            renderOpts: // the default values.
            context.staticGenerationContext ?? {
                supportsDynamicHTML: false
            }
        };
        // Add the fetchCache option to the renderOpts.
        staticGenerationContext.renderOpts.fetchCache = this.userland.fetchCache;
        // Run the handler with the request AsyncLocalStorage to inject the helper
        // support. We set this to `unknown` because the type is not known until
        // runtime when we do a instanceof check below.
        const response = await this.actionAsyncStorage.run({
            isAppRoute: true
        }, ()=>{
            return _requestasyncstoragewrapper.RequestAsyncStorageWrapper.wrap(this.requestAsyncStorage, requestContext, ()=>{
                return _staticgenerationasyncstoragewrapper.StaticGenerationAsyncStorageWrapper.wrap(this.staticGenerationAsyncStorage, staticGenerationContext, (staticGenerationStore)=>{
                    var _getTracer_getRootSpanAttributes;
                    // Check to see if we should bail out of static generation based on
                    // having non-static methods.
                    if (this.nonStaticMethods) {
                        this.staticGenerationBailout(`non-static methods used ${this.nonStaticMethods.join(", ")}`);
                    }
                    // Update the static generation store based on the dynamic property.
                    switch(this.dynamic){
                        case "force-dynamic":
                            // The dynamic property is set to force-dynamic, so we should
                            // force the page to be dynamic.
                            staticGenerationStore.forceDynamic = true;
                            this.staticGenerationBailout(`force-dynamic`, {
                                dynamic: this.dynamic
                            });
                            break;
                        case "force-static":
                            // The dynamic property is set to force-static, so we should
                            // force the page to be static.
                            staticGenerationStore.forceStatic = true;
                            break;
                        case "error":
                            // The dynamic property is set to error, so we should throw an
                            // error if the page is being statically generated.
                            staticGenerationStore.dynamicShouldError = true;
                            break;
                        default:
                            break;
                    }
                    // If the static generation store does not have a revalidate value
                    // set, then we should set it the revalidate value from the userland
                    // module or default to false.
                    staticGenerationStore.revalidate ??= this.userland.revalidate ?? false;
                    // Wrap the request so we can add additional functionality to cases
                    // that might change it's output or affect the rendering.
                    const wrappedRequest = (0, _proxyrequest.proxyRequest)(request, {
                        dynamic: this.dynamic
                    }, {
                        headerHooks: this.headerHooks,
                        serverHooks: this.serverHooks,
                        staticGenerationBailout: this.staticGenerationBailout
                    });
                    // TODO: propagate this pathname from route matcher
                    const route = (0, _getpathnamefromabsolutepath.getPathnameFromAbsolutePath)(this.resolvedPagePath);
                    (_getTracer_getRootSpanAttributes = (0, _tracer.getTracer)().getRootSpanAttributes()) == null ? void 0 : _getTracer_getRootSpanAttributes.set("next.route", route);
                    return (0, _tracer.getTracer)().trace(_constants.AppRouteRouteHandlersSpan.runHandler, {
                        spanName: `executing api route (app) ${route}`,
                        attributes: {
                            "next.route": route
                        }
                    }, async ()=>{
                        var _staticGenerationStore_tags;
                        // Patch the global fetch.
                        (0, _patchfetch.patchFetch)({
                            serverHooks: this.serverHooks,
                            staticGenerationAsyncStorage: this.staticGenerationAsyncStorage
                        });
                        const res = await handler(wrappedRequest, {
                            params: context.params
                        });
                        context.staticGenerationContext.fetchMetrics = staticGenerationStore.fetchMetrics;
                        await Promise.all(staticGenerationStore.pendingRevalidates || []);
                        (0, _patchfetch.addImplicitTags)(staticGenerationStore);
                        context.staticGenerationContext.fetchTags = (_staticGenerationStore_tags = staticGenerationStore.tags) == null ? void 0 : _staticGenerationStore_tags.join(",");
                        // It's possible cookies were set in the handler, so we need
                        // to merge the modified cookies and the returned response
                        // here.
                        const requestStore = this.requestAsyncStorage.getStore();
                        if (requestStore && requestStore.mutableCookies) {
                            const headers = new Headers(res.headers);
                            if ((0, _requestcookies.appendMutableCookies)(headers, requestStore.mutableCookies)) {
                                return new Response(res.body, {
                                    status: res.status,
                                    statusText: res.statusText,
                                    headers
                                });
                            }
                        }
                        return res;
                    });
                });
            });
        });
        // If the handler did't return a valid response, then return the internal
        // error response.
        if (!(response instanceof Response)) {
            // TODO: validate the correct handling behavior, maybe log something?
            return (0, _responsehandlers.handleInternalServerErrorResponse)();
        }
        if (response.headers.has("x-middleware-rewrite")) {
            // TODO: move this error into the `NextResponse.rewrite()` function.
            // TODO-APP: re-enable support below when we can proxy these type of requests
            throw new Error("NextResponse.rewrite() was used in a app route handler, this is not currently supported. Please remove the invocation to continue.");
        // // This is a rewrite created via `NextResponse.rewrite()`. We need to send
        // // the response up so it can be handled by the backing server.
        // // If the server is running in minimal mode, we just want to forward the
        // // response (including the rewrite headers) upstream so it can perform the
        // // redirect for us, otherwise return with the special condition so this
        // // server can perform a rewrite.
        // if (!minimalMode) {
        //   return { response, condition: 'rewrite' }
        // }
        // // Relativize the url so it's relative to the base url. This is so the
        // // outgoing headers upstream can be relative.
        // const rewritePath = response.headers.get('x-middleware-rewrite')!
        // const initUrl = getRequestMeta(req, '__NEXT_INIT_URL')!
        // const { pathname } = parseUrl(relativizeURL(rewritePath, initUrl))
        // response.headers.set('x-middleware-rewrite', pathname)
        }
        if (response.headers.get("x-middleware-next") === "1") {
            // TODO: move this error into the `NextResponse.next()` function.
            throw new Error("NextResponse.next() was used in a app route handler, this is not supported. See here for more info: https://nextjs.org/docs/messages/next-response-next-in-app-route-handler");
        }
        return response;
    }
    async handle(request, context) {
        try {
            // Execute the route to get the response.
            const response = await this.execute(request, context);
            // The response was handled, return it.
            return response;
        } catch (err) {
            // Try to resolve the error to a response, else throw it again.
            const response = (0, _resolvehandlererror.resolveHandlerError)(err);
            if (!response) throw err;
            // The response was resolved, return it.
            return response;
        }
    }
}
const _default = AppRouteRouteModule; //# sourceMappingURL=module.js.map


/***/ }),

/***/ 8905:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    handleTemporaryRedirectResponse: function() {
        return handleTemporaryRedirectResponse;
    },
    handleBadRequestResponse: function() {
        return handleBadRequestResponse;
    },
    handleNotFoundResponse: function() {
        return handleNotFoundResponse;
    },
    handleMethodNotAllowedResponse: function() {
        return handleMethodNotAllowedResponse;
    },
    handleInternalServerErrorResponse: function() {
        return handleInternalServerErrorResponse;
    }
});
const _requestcookies = __webpack_require__(127);
function handleTemporaryRedirectResponse(url, mutableCookies) {
    const headers = new Headers({
        location: url
    });
    (0, _requestcookies.appendMutableCookies)(headers, mutableCookies);
    return new Response(null, {
        status: 307,
        headers
    });
}
function handleBadRequestResponse() {
    return new Response(null, {
        status: 400
    });
}
function handleNotFoundResponse() {
    return new Response(null, {
        status: 404
    });
}
function handleMethodNotAllowedResponse() {
    return new Response(null, {
        status: 405
    });
}
function handleInternalServerErrorResponse() {
    return new Response(null, {
        status: 500
    });
} //# sourceMappingURL=response-handlers.js.map


/***/ }),

/***/ 6669:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "RouteModule", ({
    enumerable: true,
    get: function() {
        return RouteModule;
    }
}));
// These are imported weirdly like this because of the way that the bundling
// works. We need to import the built files from the dist directory, but we
// can't do that directly because we need types from the source files. So we
// import the types from the source files and then import the built files.
const { requestAsyncStorage  } = __webpack_require__(8214);
const { staticGenerationAsyncStorage  } = __webpack_require__(1839);
const serverHooks = __webpack_require__(5815);
const headerHooks = __webpack_require__(904);
const { staticGenerationBailout  } = __webpack_require__(9282);
const { actionAsyncStorage  } = __webpack_require__(7797);
class RouteModule {
    constructor({ userland  }){
        /**
   * A reference to the request async storage.
   */ this.requestAsyncStorage = requestAsyncStorage;
        /**
   * A reference to the static generation async storage.
   */ this.staticGenerationAsyncStorage = staticGenerationAsyncStorage;
        /**
   * An interface to call server hooks which interact with the underlying
   * storage.
   */ this.serverHooks = serverHooks;
        /**
   * An interface to call header hooks which interact with the underlying
   * request storage.
   */ this.headerHooks = headerHooks;
        /**
   * An interface to call static generation bailout hooks which interact with
   * the underlying static generation storage.
   */ this.staticGenerationBailout = staticGenerationBailout;
        /**
   * A reference to the mutation related async storage, such as mutations of
   * cookies.
   */ this.actionAsyncStorage = actionAsyncStorage;
        this.userland = userland;
    }
} //# sourceMappingURL=route-module.js.map


/***/ }),

/***/ 5110:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    addImplicitTags: function() {
        return addImplicitTags;
    },
    patchFetch: function() {
        return patchFetch;
    }
});
const _constants = __webpack_require__(5511);
const _tracer = __webpack_require__(6730);
const _constants1 = __webpack_require__(2523);
const isEdgeRuntime = "nodejs" === "edge";
function addImplicitTags(staticGenerationStore) {
    const newTags = [];
    const pathname = staticGenerationStore == null ? void 0 : staticGenerationStore.originalPathname;
    if (!pathname) {
        return newTags;
    }
    if (!Array.isArray(staticGenerationStore.tags)) {
        staticGenerationStore.tags = [];
    }
    if (!staticGenerationStore.tags.includes(pathname)) {
        staticGenerationStore.tags.push(pathname);
    }
    newTags.push(pathname);
    return newTags;
}
function trackFetchMetric(staticGenerationStore, ctx) {
    if (!staticGenerationStore) return;
    if (!staticGenerationStore.fetchMetrics) {
        staticGenerationStore.fetchMetrics = [];
    }
    const dedupeFields = [
        "url",
        "status",
        "method"
    ];
    // don't add metric if one already exists for the fetch
    if (staticGenerationStore.fetchMetrics.some((metric)=>{
        return dedupeFields.every((field)=>metric[field] === ctx[field]);
    })) {
        return;
    }
    staticGenerationStore.fetchMetrics.push({
        url: ctx.url,
        cacheStatus: ctx.cacheStatus,
        status: ctx.status,
        method: ctx.method,
        start: ctx.start,
        end: Date.now(),
        idx: staticGenerationStore.nextFetchId || 0
    });
}
function patchFetch({ serverHooks , staticGenerationAsyncStorage  }) {
    if (globalThis.fetch.__nextPatched) return;
    const { DynamicServerError  } = serverHooks;
    const originFetch = globalThis.fetch;
    globalThis.fetch = async (input, init)=>{
        var _init_method;
        let url;
        try {
            url = new URL(input instanceof Request ? input.url : input);
            url.username = "";
            url.password = "";
        } catch  {
            // Error caused by malformed URL should be handled by native fetch
            url = undefined;
        }
        const fetchUrl = (url == null ? void 0 : url.href) ?? "";
        const fetchStart = Date.now();
        const method = (init == null ? void 0 : (_init_method = init.method) == null ? void 0 : _init_method.toUpperCase()) || "GET";
        return await (0, _tracer.getTracer)().trace(_constants.AppRenderSpan.fetch, {
            kind: _tracer.SpanKind.CLIENT,
            spanName: [
                "fetch",
                method,
                fetchUrl
            ].filter(Boolean).join(" "),
            attributes: {
                "http.url": fetchUrl,
                "http.method": method,
                "net.peer.name": url == null ? void 0 : url.hostname,
                "net.peer.port": (url == null ? void 0 : url.port) || undefined
            }
        }, async ()=>{
            var _ref, _getRequestMeta;
            const staticGenerationStore = staticGenerationAsyncStorage.getStore();
            const isRequestInput = input && typeof input === "object" && typeof input.method === "string";
            const getRequestMeta = (field)=>{
                let value = isRequestInput ? input[field] : null;
                return value || (init == null ? void 0 : init[field]);
            };
            // If the staticGenerationStore is not available, we can't do any
            // special treatment of fetch, therefore fallback to the original
            // fetch implementation.
            if (!staticGenerationStore || ((_ref = init == null ? void 0 : init.next) == null ? void 0 : _ref.internal)) {
                return originFetch(input, init);
            }
            let revalidate = undefined;
            const getNextField = (field)=>{
                var _init_next, _init_next1, _input_next;
                return typeof (init == null ? void 0 : (_init_next = init.next) == null ? void 0 : _init_next[field]) !== "undefined" ? init == null ? void 0 : (_init_next1 = init.next) == null ? void 0 : _init_next1[field] : isRequestInput ? (_input_next = input.next) == null ? void 0 : _input_next[field] : undefined;
            };
            // RequestInit doesn't keep extra fields e.g. next so it's
            // only available if init is used separate
            let curRevalidate = getNextField("revalidate");
            const tags = getNextField("tags") || [];
            if (Array.isArray(tags)) {
                if (!staticGenerationStore.tags) {
                    staticGenerationStore.tags = [];
                }
                for (const tag of tags){
                    if (!staticGenerationStore.tags.includes(tag)) {
                        staticGenerationStore.tags.push(tag);
                    }
                }
            }
            const implicitTags = addImplicitTags(staticGenerationStore);
            for (const tag of implicitTags || []){
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            }
            const isOnlyCache = staticGenerationStore.fetchCache === "only-cache";
            const isForceCache = staticGenerationStore.fetchCache === "force-cache";
            const isDefaultCache = staticGenerationStore.fetchCache === "default-cache";
            const isDefaultNoStore = staticGenerationStore.fetchCache === "default-no-store";
            const isOnlyNoStore = staticGenerationStore.fetchCache === "only-no-store";
            const isForceNoStore = staticGenerationStore.fetchCache === "force-no-store";
            let _cache = getRequestMeta("cache");
            if (typeof _cache === "string" && typeof curRevalidate !== "undefined") {
                console.warn(`Warning: fetch for ${fetchUrl} on ${staticGenerationStore.pathname} specified "cache: ${_cache}" and "revalidate: ${curRevalidate}", only one should be specified.`);
                _cache = undefined;
            }
            if (_cache === "force-cache") {
                curRevalidate = false;
            }
            if ([
                "no-cache",
                "no-store"
            ].includes(_cache || "")) {
                curRevalidate = 0;
            }
            if (typeof curRevalidate === "number" || curRevalidate === false) {
                revalidate = curRevalidate;
            }
            let cacheReason = "";
            const _headers = getRequestMeta("headers");
            const initHeaders = typeof (_headers == null ? void 0 : _headers.get) === "function" ? _headers : new Headers(_headers || {});
            const hasUnCacheableHeader = initHeaders.get("authorization") || initHeaders.get("cookie");
            const isUnCacheableMethod = ![
                "get",
                "head"
            ].includes(((_getRequestMeta = getRequestMeta("method")) == null ? void 0 : _getRequestMeta.toLowerCase()) || "get");
            // if there are authorized headers or a POST method and
            // dynamic data usage was present above the tree we bail
            // e.g. if cookies() is used before an authed/POST fetch
            const autoNoCache = (hasUnCacheableHeader || isUnCacheableMethod) && staticGenerationStore.revalidate === 0;
            if (isForceNoStore) {
                revalidate = 0;
                cacheReason = "fetchCache = force-no-store";
            }
            if (isOnlyNoStore) {
                if (_cache === "force-cache" || revalidate === 0) {
                    throw new Error(`cache: 'force-cache' used on fetch for ${fetchUrl} with 'export const fetchCache = 'only-no-store'`);
                }
                revalidate = 0;
                cacheReason = "fetchCache = only-no-store";
            }
            if (isOnlyCache && _cache === "no-store") {
                throw new Error(`cache: 'no-store' used on fetch for ${fetchUrl} with 'export const fetchCache = 'only-cache'`);
            }
            if (isForceCache && (typeof curRevalidate === "undefined" || curRevalidate === 0)) {
                cacheReason = "fetchCache = force-cache";
                revalidate = false;
            }
            if (typeof revalidate === "undefined") {
                if (isDefaultCache) {
                    revalidate = false;
                    cacheReason = "fetchCache = default-cache";
                } else if (autoNoCache) {
                    revalidate = 0;
                    cacheReason = "auto no cache";
                } else if (isDefaultNoStore) {
                    revalidate = 0;
                    cacheReason = "fetchCache = default-no-store";
                } else {
                    cacheReason = "auto cache";
                    revalidate = typeof staticGenerationStore.revalidate === "boolean" || typeof staticGenerationStore.revalidate === "undefined" ? false : staticGenerationStore.revalidate;
                }
            } else if (!cacheReason) {
                cacheReason = `revalidate: ${revalidate}`;
            }
            if (// revalidate although if it occurs during build we do
            !autoNoCache && (typeof staticGenerationStore.revalidate === "undefined" || typeof revalidate === "number" && (staticGenerationStore.revalidate === false || typeof staticGenerationStore.revalidate === "number" && revalidate < staticGenerationStore.revalidate))) {
                staticGenerationStore.revalidate = revalidate;
            }
            const isCacheableRevalidate = typeof revalidate === "number" && revalidate > 0 || revalidate === false;
            let cacheKey;
            if (staticGenerationStore.incrementalCache && isCacheableRevalidate) {
                try {
                    cacheKey = await staticGenerationStore.incrementalCache.fetchCacheKey(fetchUrl, isRequestInput ? input : init);
                } catch (err) {
                    console.error(`Failed to generate cache key for`, input);
                }
            }
            const requestInputFields = [
                "cache",
                "credentials",
                "headers",
                "integrity",
                "keepalive",
                "method",
                "mode",
                "redirect",
                "referrer",
                "referrerPolicy",
                "signal",
                "window",
                "duplex"
            ];
            if (isRequestInput) {
                const reqInput = input;
                const reqOptions = {
                    body: reqInput._ogBody || reqInput.body
                };
                for (const field of requestInputFields){
                    // @ts-expect-error custom fields
                    reqOptions[field] = reqInput[field];
                }
                input = new Request(reqInput.url, reqOptions);
            } else if (init) {
                const initialInit = init;
                init = {
                    body: init._ogBody || init.body
                };
                for (const field of requestInputFields){
                    // @ts-expect-error custom fields
                    init[field] = initialInit[field];
                }
            }
            const fetchIdx = staticGenerationStore.nextFetchId ?? 1;
            staticGenerationStore.nextFetchId = fetchIdx + 1;
            const normalizedRevalidate = typeof revalidate !== "number" ? _constants1.CACHE_ONE_YEAR : revalidate;
            const doOriginalFetch = async (isStale)=>{
                // add metadata to init without editing the original
                const clonedInit = {
                    ...init,
                    next: {
                        ...init == null ? void 0 : init.next,
                        fetchType: "origin",
                        fetchIdx
                    }
                };
                return originFetch(input, clonedInit).then(async (res)=>{
                    if (!isStale) {
                        trackFetchMetric(staticGenerationStore, {
                            start: fetchStart,
                            url: fetchUrl,
                            cacheReason,
                            cacheStatus: "miss",
                            status: res.status,
                            method: clonedInit.method || "GET"
                        });
                    }
                    if (res.status === 200 && staticGenerationStore.incrementalCache && cacheKey && isCacheableRevalidate) {
                        const bodyBuffer = Buffer.from(await res.arrayBuffer());
                        try {
                            await staticGenerationStore.incrementalCache.set(cacheKey, {
                                kind: "FETCH",
                                data: {
                                    headers: Object.fromEntries(res.headers.entries()),
                                    body: bodyBuffer.toString("base64"),
                                    status: res.status,
                                    tags
                                },
                                revalidate: normalizedRevalidate
                            }, revalidate, true, fetchUrl, fetchIdx);
                        } catch (err) {
                            console.warn(`Failed to set fetch cache`, input, err);
                        }
                        return new Response(bodyBuffer, {
                            headers: new Headers(res.headers),
                            status: res.status
                        });
                    }
                    return res;
                });
            };
            if (cacheKey && (staticGenerationStore == null ? void 0 : staticGenerationStore.incrementalCache)) {
                const entry = staticGenerationStore.isOnDemandRevalidate ? null : await staticGenerationStore.incrementalCache.get(cacheKey, true, revalidate, fetchUrl, fetchIdx);
                if ((entry == null ? void 0 : entry.value) && entry.value.kind === "FETCH") {
                    const currentTags = entry.value.data.tags;
                    // when stale and is revalidating we wait for fresh data
                    // so the revalidated entry has the updated data
                    if (!(staticGenerationStore.isRevalidate && entry.isStale)) {
                        if (entry.isStale) {
                            if (!staticGenerationStore.pendingRevalidates) {
                                staticGenerationStore.pendingRevalidates = [];
                            }
                            staticGenerationStore.pendingRevalidates.push(doOriginalFetch(true).catch(console.error));
                        } else if (tags && !tags.every((tag)=>{
                            return currentTags == null ? void 0 : currentTags.includes(tag);
                        })) {
                            var _staticGenerationStore_incrementalCache;
                            // if new tags are being added we need to set even if
                            // the data isn't stale
                            if (!entry.value.data.tags) {
                                entry.value.data.tags = [];
                            }
                            for (const tag of tags){
                                if (!entry.value.data.tags.includes(tag)) {
                                    entry.value.data.tags.push(tag);
                                }
                            }
                            (_staticGenerationStore_incrementalCache = staticGenerationStore.incrementalCache) == null ? void 0 : _staticGenerationStore_incrementalCache.set(cacheKey, entry.value, revalidate, true, fetchUrl, fetchIdx);
                        }
                        const resData = entry.value.data;
                        let decodedBody;
                        if (false) {} else {
                            decodedBody = Buffer.from(resData.body, "base64").subarray();
                        }
                        trackFetchMetric(staticGenerationStore, {
                            start: fetchStart,
                            url: fetchUrl,
                            cacheReason,
                            cacheStatus: "hit",
                            status: resData.status || 200,
                            method: (init == null ? void 0 : init.method) || "GET"
                        });
                        return new Response(decodedBody, {
                            headers: resData.headers,
                            status: resData.status
                        });
                    }
                }
            }
            if (staticGenerationStore.isStaticGeneration) {
                if (init && typeof init === "object") {
                    const cache = init.cache;
                    // Delete `cache` property as Cloudflare Workers will throw an error
                    if (isEdgeRuntime) {
                        delete init.cache;
                    }
                    if (cache === "no-store") {
                        staticGenerationStore.revalidate = 0;
                        // TODO: ensure this error isn't logged to the user
                        // seems it's slipping through currently
                        const dynamicUsageReason = `no-store fetch ${input}${staticGenerationStore.pathname ? ` ${staticGenerationStore.pathname}` : ""}`;
                        const err = new DynamicServerError(dynamicUsageReason);
                        staticGenerationStore.dynamicUsageStack = err.stack;
                        staticGenerationStore.dynamicUsageDescription = dynamicUsageReason;
                        throw err;
                    }
                    const hasNextConfig = "next" in init;
                    const next = init.next || {};
                    if (typeof next.revalidate === "number" && (typeof staticGenerationStore.revalidate === "undefined" || next.revalidate < staticGenerationStore.revalidate)) {
                        const forceDynamic = staticGenerationStore.forceDynamic;
                        if (!forceDynamic || next.revalidate !== 0) {
                            staticGenerationStore.revalidate = next.revalidate;
                        }
                        if (!forceDynamic && next.revalidate === 0) {
                            const dynamicUsageReason = `revalidate: ${next.revalidate} fetch ${input}${staticGenerationStore.pathname ? ` ${staticGenerationStore.pathname}` : ""}`;
                            const err = new DynamicServerError(dynamicUsageReason);
                            staticGenerationStore.dynamicUsageStack = err.stack;
                            staticGenerationStore.dynamicUsageDescription = dynamicUsageReason;
                            throw err;
                        }
                    }
                    if (hasNextConfig) delete init.next;
                }
            }
            return doOriginalFetch();
        });
    };
    fetch.__nextGetStaticStore = ()=>{
        return staticGenerationAsyncStorage;
    };
    fetch.__nextPatched = true;
} //# sourceMappingURL=patch-fetch.js.map


/***/ }),

/***/ 5511:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Contains predefined constants for the trace span name in next/server.
 *
 * Currently, next/server/tracer is internal implementation only for tracking
 * next.js's implementation only with known span names defined here.
 **/ // eslint typescript has a bug with TS enums
/* eslint-disable no-shadow */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    NextVanillaSpanAllowlist: function() {
        return NextVanillaSpanAllowlist;
    },
    BaseServerSpan: function() {
        return BaseServerSpan;
    },
    LoadComponentsSpan: function() {
        return LoadComponentsSpan;
    },
    NextServerSpan: function() {
        return NextServerSpan;
    },
    NextNodeServerSpan: function() {
        return NextNodeServerSpan;
    },
    StartServerSpan: function() {
        return StartServerSpan;
    },
    RenderSpan: function() {
        return RenderSpan;
    },
    RouterSpan: function() {
        return RouterSpan;
    },
    AppRenderSpan: function() {
        return AppRenderSpan;
    },
    NodeSpan: function() {
        return NodeSpan;
    },
    AppRouteRouteHandlersSpan: function() {
        return AppRouteRouteHandlersSpan;
    },
    ResolveMetadataSpan: function() {
        return ResolveMetadataSpan;
    }
});
var BaseServerSpan;
(function(BaseServerSpan) {
    BaseServerSpan["handleRequest"] = "BaseServer.handleRequest";
    BaseServerSpan["run"] = "BaseServer.run";
    BaseServerSpan["pipe"] = "BaseServer.pipe";
    BaseServerSpan["getStaticHTML"] = "BaseServer.getStaticHTML";
    BaseServerSpan["render"] = "BaseServer.render";
    BaseServerSpan["renderToResponseWithComponents"] = "BaseServer.renderToResponseWithComponents";
    BaseServerSpan["renderToResponse"] = "BaseServer.renderToResponse";
    BaseServerSpan["renderToHTML"] = "BaseServer.renderToHTML";
    BaseServerSpan["renderError"] = "BaseServer.renderError";
    BaseServerSpan["renderErrorToResponse"] = "BaseServer.renderErrorToResponse";
    BaseServerSpan["renderErrorToHTML"] = "BaseServer.renderErrorToHTML";
    BaseServerSpan["render404"] = "BaseServer.render404";
})(BaseServerSpan || (BaseServerSpan = {}));
var LoadComponentsSpan;
(function(LoadComponentsSpan) {
    LoadComponentsSpan["loadDefaultErrorComponents"] = "LoadComponents.loadDefaultErrorComponents";
    LoadComponentsSpan["loadComponents"] = "LoadComponents.loadComponents";
})(LoadComponentsSpan || (LoadComponentsSpan = {}));
var NextServerSpan;
(function(NextServerSpan) {
    NextServerSpan["getRequestHandler"] = "NextServer.getRequestHandler";
    NextServerSpan["getServer"] = "NextServer.getServer";
    NextServerSpan["getServerRequestHandler"] = "NextServer.getServerRequestHandler";
    NextServerSpan["createServer"] = "createServer.createServer";
})(NextServerSpan || (NextServerSpan = {}));
var NextNodeServerSpan;
(function(NextNodeServerSpan) {
    NextNodeServerSpan["compression"] = "NextNodeServer.compression";
    NextNodeServerSpan["getBuildId"] = "NextNodeServer.getBuildId";
    NextNodeServerSpan["generateStaticRoutes"] = "NextNodeServer.generateStaticRoutes";
    NextNodeServerSpan["generateFsStaticRoutes"] = "NextNodeServer.generateFsStaticRoutes";
    NextNodeServerSpan["generatePublicRoutes"] = "NextNodeServer.generatePublicRoutes";
    NextNodeServerSpan["generateImageRoutes"] = "NextNodeServer.generateImageRoutes.route";
    NextNodeServerSpan["sendRenderResult"] = "NextNodeServer.sendRenderResult";
    NextNodeServerSpan["sendStatic"] = "NextNodeServer.sendStatic";
    NextNodeServerSpan["proxyRequest"] = "NextNodeServer.proxyRequest";
    NextNodeServerSpan["runApi"] = "NextNodeServer.runApi";
    NextNodeServerSpan["render"] = "NextNodeServer.render";
    NextNodeServerSpan["renderHTML"] = "NextNodeServer.renderHTML";
    NextNodeServerSpan["imageOptimizer"] = "NextNodeServer.imageOptimizer";
    NextNodeServerSpan["getPagePath"] = "NextNodeServer.getPagePath";
    NextNodeServerSpan["getRoutesManifest"] = "NextNodeServer.getRoutesManifest";
    NextNodeServerSpan["findPageComponents"] = "NextNodeServer.findPageComponents";
    NextNodeServerSpan["getFontManifest"] = "NextNodeServer.getFontManifest";
    NextNodeServerSpan["getServerComponentManifest"] = "NextNodeServer.getServerComponentManifest";
    NextNodeServerSpan["getRequestHandler"] = "NextNodeServer.getRequestHandler";
    NextNodeServerSpan["renderToHTML"] = "NextNodeServer.renderToHTML";
    NextNodeServerSpan["renderError"] = "NextNodeServer.renderError";
    NextNodeServerSpan["renderErrorToHTML"] = "NextNodeServer.renderErrorToHTML";
    NextNodeServerSpan["render404"] = "NextNodeServer.render404";
    NextNodeServerSpan["route"] = "route";
    NextNodeServerSpan["onProxyReq"] = "onProxyReq";
    NextNodeServerSpan["apiResolver"] = "apiResolver";
})(NextNodeServerSpan || (NextNodeServerSpan = {}));
var StartServerSpan;
(function(StartServerSpan) {
    StartServerSpan["startServer"] = "startServer.startServer";
})(StartServerSpan || (StartServerSpan = {}));
var RenderSpan;
(function(RenderSpan) {
    RenderSpan["getServerSideProps"] = "Render.getServerSideProps";
    RenderSpan["getStaticProps"] = "Render.getStaticProps";
    RenderSpan["renderToString"] = "Render.renderToString";
    RenderSpan["renderDocument"] = "Render.renderDocument";
    RenderSpan["createBodyResult"] = "Render.createBodyResult";
})(RenderSpan || (RenderSpan = {}));
var AppRenderSpan;
(function(AppRenderSpan) {
    AppRenderSpan["renderToString"] = "AppRender.renderToString";
    AppRenderSpan["renderToReadableStream"] = "AppRender.renderToReadableStream";
    AppRenderSpan["getBodyResult"] = "AppRender.getBodyResult";
    AppRenderSpan["fetch"] = "AppRender.fetch";
})(AppRenderSpan || (AppRenderSpan = {}));
var RouterSpan;
(function(RouterSpan) {
    RouterSpan["executeRoute"] = "Router.executeRoute";
})(RouterSpan || (RouterSpan = {}));
var NodeSpan;
(function(NodeSpan) {
    NodeSpan["runHandler"] = "Node.runHandler";
})(NodeSpan || (NodeSpan = {}));
var AppRouteRouteHandlersSpan;
(function(AppRouteRouteHandlersSpan) {
    AppRouteRouteHandlersSpan["runHandler"] = "AppRouteRouteHandlers.runHandler";
})(AppRouteRouteHandlersSpan || (AppRouteRouteHandlersSpan = {}));
var ResolveMetadataSpan;
(function(ResolveMetadataSpan) {
    ResolveMetadataSpan["generateMetadata"] = "ResolveMetadata.generateMetadata";
})(ResolveMetadataSpan || (ResolveMetadataSpan = {}));
const NextVanillaSpanAllowlist = [
    "BaseServer.handleRequest",
    "Render.getServerSideProps",
    "Render.getStaticProps",
    "AppRender.fetch",
    "AppRender.getBodyResult",
    "Render.renderDocument",
    "Node.runHandler",
    "AppRouteRouteHandlers.runHandler",
    "ResolveMetadata.generateMetadata"
]; //# sourceMappingURL=constants.js.map


/***/ }),

/***/ 6730:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getTracer: function() {
        return getTracer;
    },
    SpanStatusCode: function() {
        return SpanStatusCode;
    },
    SpanKind: function() {
        return SpanKind;
    }
});
const _constants = __webpack_require__(5511);
let api;
// we want to allow users to use their own version of @opentelemetry/api if they
// want to, so we try to require it first, and if it fails we fall back to the
// version that is bundled with Next.js
// this is because @opentelemetry/api has to be synced with the version of
// @opentelemetry/tracing that is used, and we don't want to force users to use
// the version that is bundled with Next.js.
// the API is ~stable, so this should be fine
try {
    api = __webpack_require__(4235);
} catch (err) {
    api = __webpack_require__(8530);
}
const { context , trace , SpanStatusCode , SpanKind  } = api;
const isPromise = (p)=>{
    return p !== null && typeof p === "object" && typeof p.then === "function";
};
const closeSpanWithError = (span, error)=>{
    if (error) {
        span.recordException(error);
    }
    span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error == null ? void 0 : error.message
    });
    span.end();
};
/** we use this map to propagate attributes from nested spans to the top span */ const rootSpanAttributesStore = new Map();
const rootSpanIdKey = api.createContextKey("next.rootSpanId");
let lastSpanId = 0;
const getSpanId = ()=>lastSpanId++;
class NextTracerImpl {
    /**
   * Returns an instance to the trace with configured name.
   * Since wrap / trace can be defined in any place prior to actual trace subscriber initialization,
   * This should be lazily evaluated.
   */ getTracerInstance() {
        return trace.getTracer("next.js", "0.0.1");
    }
    getContext() {
        return context;
    }
    getActiveScopeSpan() {
        return trace.getSpan(context == null ? void 0 : context.active());
    }
    trace(...args) {
        const [type, fnOrOptions, fnOrEmpty] = args;
        // coerce options form overload
        const { fn , options  } = typeof fnOrOptions === "function" ? {
            fn: fnOrOptions,
            options: {}
        } : {
            fn: fnOrEmpty,
            options: {
                ...fnOrOptions
            }
        };
        if (!_constants.NextVanillaSpanAllowlist.includes(type) && process.env.NEXT_OTEL_VERBOSE !== "1" || options.hideSpan) {
            return fn();
        }
        const spanName = options.spanName ?? type;
        // Trying to get active scoped span to assign parent. If option specifies parent span manually, will try to use it.
        let spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        let isRootSpan = false;
        if (!spanContext) {
            spanContext = api.ROOT_CONTEXT;
            isRootSpan = true;
        }
        const spanId = getSpanId();
        options.attributes = {
            "next.span_name": spanName,
            "next.span_type": type,
            ...options.attributes
        };
        return api.context.with(spanContext.setValue(rootSpanIdKey, spanId), ()=>this.getTracerInstance().startActiveSpan(spanName, options, (span)=>{
                const onCleanup = ()=>{
                    rootSpanAttributesStore.delete(spanId);
                };
                if (isRootSpan) {
                    rootSpanAttributesStore.set(spanId, new Map(Object.entries(options.attributes ?? {})));
                }
                try {
                    if (fn.length > 1) {
                        return fn(span, (err)=>closeSpanWithError(span, err));
                    }
                    const result = fn(span);
                    if (isPromise(result)) {
                        result.then(()=>span.end(), (err)=>closeSpanWithError(span, err)).finally(onCleanup);
                    } else {
                        span.end();
                        onCleanup();
                    }
                    return result;
                } catch (err) {
                    closeSpanWithError(span, err);
                    onCleanup();
                    throw err;
                }
            }));
    }
    wrap(...args) {
        const tracer = this;
        const [name, options, fn] = args.length === 3 ? args : [
            args[0],
            {},
            args[1]
        ];
        if (!_constants.NextVanillaSpanAllowlist.includes(name) && process.env.NEXT_OTEL_VERBOSE !== "1") {
            return fn;
        }
        return function() {
            let optionsObj = options;
            if (typeof optionsObj === "function" && typeof fn === "function") {
                optionsObj = optionsObj.apply(this, arguments);
            }
            const lastArgId = arguments.length - 1;
            const cb = arguments[lastArgId];
            if (typeof cb === "function") {
                const scopeBoundCb = tracer.getContext().bind(context.active(), cb);
                return tracer.trace(name, optionsObj, (_span, done)=>{
                    arguments[lastArgId] = function(err) {
                        done == null ? void 0 : done(err);
                        return scopeBoundCb.apply(this, arguments);
                    };
                    return fn.apply(this, arguments);
                });
            } else {
                return tracer.trace(name, optionsObj, ()=>fn.apply(this, arguments));
            }
        };
    }
    startSpan(...args) {
        const [type, options] = args;
        const spanContext = this.getSpanContext((options == null ? void 0 : options.parentSpan) ?? this.getActiveScopeSpan());
        return this.getTracerInstance().startSpan(type, options, spanContext);
    }
    getSpanContext(parentSpan) {
        const spanContext = parentSpan ? trace.setSpan(context.active(), parentSpan) : undefined;
        return spanContext;
    }
    getRootSpanAttributes() {
        const spanId = context.active().getValue(rootSpanIdKey);
        return rootSpanAttributesStore.get(spanId);
    }
}
const getTracer = (()=>{
    const tracer = new NextTracerImpl();
    return ()=>tracer;
})(); //# sourceMappingURL=tracer.js.map


/***/ }),

/***/ 6145:
/***/ (() => {

/**
 * Polyfills the `Headers.getAll(name)` method so it'll work in the edge
 * runtime.
 */ 
if (!("getAll" in Headers.prototype)) {
    // @ts-expect-error - this is polyfilling this method so it doesn't exist yet
    Headers.prototype.getAll = function(name) {
        name = name.toLowerCase();
        if (name !== "set-cookie") throw new Error("Headers.getAll is only supported for Set-Cookie header");
        const headers = [
            ...this.entries()
        ].filter(([key])=>key === name);
        return headers.map(([, value])=>value);
    };
} //# sourceMappingURL=node-polyfill-headers.js.map


/***/ }),

/***/ 300:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PageSignatureError: function() {
        return PageSignatureError;
    },
    RemovedPageError: function() {
        return RemovedPageError;
    },
    RemovedUAError: function() {
        return RemovedUAError;
    }
});
class PageSignatureError extends Error {
    constructor({ page  }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
class RemovedPageError extends Error {
    constructor(){
        super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
    }
}
class RemovedUAError extends Error {
    constructor(){
        super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
    }
} //# sourceMappingURL=error.js.map


/***/ }),

/***/ 6855:
/***/ ((__unused_webpack_module, exports) => {

/**
 * List of valid HTTP methods that can be implemented by Next.js's Custom App
 * Routes.
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTTP_METHODS: function() {
        return HTTP_METHODS;
    },
    isHTTPMethod: function() {
        return isHTTPMethod;
    }
});
const HTTP_METHODS = [
    "GET",
    "HEAD",
    "OPTIONS",
    "POST",
    "PUT",
    "DELETE",
    "PATCH"
];
function isHTTPMethod(maybeMethod) {
    return HTTP_METHODS.includes(maybeMethod);
} //# sourceMappingURL=http.js.map


/***/ }),

/***/ 4576:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "NextURL", ({
    enumerable: true,
    get: function() {
        return NextURL;
    }
}));
const _detectdomainlocale = __webpack_require__(5490);
const _formatnextpathnameinfo = __webpack_require__(182);
const _gethostname = __webpack_require__(3196);
const _getnextpathnameinfo = __webpack_require__(9269);
const REGEX_LOCALHOST_HOSTNAME = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|::1|localhost)/;
function parseURL(url, base) {
    return new URL(String(url).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"), base && String(base).replace(REGEX_LOCALHOST_HOSTNAME, "localhost"));
}
const Internal = Symbol("NextURLInternal");
class NextURL {
    constructor(input, baseOrOpts, opts){
        let base;
        let options;
        if (typeof baseOrOpts === "object" && "pathname" in baseOrOpts || typeof baseOrOpts === "string") {
            base = baseOrOpts;
            options = opts || {};
        } else {
            options = opts || baseOrOpts || {};
        }
        this[Internal] = {
            url: parseURL(input, base ?? options.base),
            options: options,
            basePath: ""
        };
        this.analyze();
    }
    analyze() {
        var _this_Internal_options_nextConfig, _this_Internal_options_nextConfig_i18n, _this_Internal_domainLocale, _this_Internal_options_nextConfig1, _this_Internal_options_nextConfig_i18n1;
        const info = (0, _getnextpathnameinfo.getNextPathnameInfo)(this[Internal].url.pathname, {
            nextConfig: this[Internal].options.nextConfig,
            parseData: !undefined,
            i18nProvider: this[Internal].options.i18nProvider
        });
        const hostname = (0, _gethostname.getHostname)(this[Internal].url, this[Internal].options.headers);
        this[Internal].domainLocale = this[Internal].options.i18nProvider ? this[Internal].options.i18nProvider.detectDomainLocale(hostname) : (0, _detectdomainlocale.detectDomainLocale)((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.domains, hostname);
        const defaultLocale = ((_this_Internal_domainLocale = this[Internal].domainLocale) == null ? void 0 : _this_Internal_domainLocale.defaultLocale) || ((_this_Internal_options_nextConfig1 = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n1 = _this_Internal_options_nextConfig1.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n1.defaultLocale);
        this[Internal].url.pathname = info.pathname;
        this[Internal].defaultLocale = defaultLocale;
        this[Internal].basePath = info.basePath ?? "";
        this[Internal].buildId = info.buildId;
        this[Internal].locale = info.locale ?? defaultLocale;
        this[Internal].trailingSlash = info.trailingSlash;
    }
    formatPathname() {
        return (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
            basePath: this[Internal].basePath,
            buildId: this[Internal].buildId,
            defaultLocale: !this[Internal].options.forceLocale ? this[Internal].defaultLocale : undefined,
            locale: this[Internal].locale,
            pathname: this[Internal].url.pathname,
            trailingSlash: this[Internal].trailingSlash
        });
    }
    formatSearch() {
        return this[Internal].url.search;
    }
    get buildId() {
        return this[Internal].buildId;
    }
    set buildId(buildId) {
        this[Internal].buildId = buildId;
    }
    get locale() {
        return this[Internal].locale ?? "";
    }
    set locale(locale) {
        var _this_Internal_options_nextConfig, _this_Internal_options_nextConfig_i18n;
        if (!this[Internal].locale || !((_this_Internal_options_nextConfig = this[Internal].options.nextConfig) == null ? void 0 : (_this_Internal_options_nextConfig_i18n = _this_Internal_options_nextConfig.i18n) == null ? void 0 : _this_Internal_options_nextConfig_i18n.locales.includes(locale))) {
            throw new TypeError(`The NextURL configuration includes no locale "${locale}"`);
        }
        this[Internal].locale = locale;
    }
    get defaultLocale() {
        return this[Internal].defaultLocale;
    }
    get domainLocale() {
        return this[Internal].domainLocale;
    }
    get searchParams() {
        return this[Internal].url.searchParams;
    }
    get host() {
        return this[Internal].url.host;
    }
    set host(value) {
        this[Internal].url.host = value;
    }
    get hostname() {
        return this[Internal].url.hostname;
    }
    set hostname(value) {
        this[Internal].url.hostname = value;
    }
    get port() {
        return this[Internal].url.port;
    }
    set port(value) {
        this[Internal].url.port = value;
    }
    get protocol() {
        return this[Internal].url.protocol;
    }
    set protocol(value) {
        this[Internal].url.protocol = value;
    }
    get href() {
        const pathname = this.formatPathname();
        const search = this.formatSearch();
        return `${this.protocol}//${this.host}${pathname}${search}${this.hash}`;
    }
    set href(url) {
        this[Internal].url = parseURL(url);
        this.analyze();
    }
    get origin() {
        return this[Internal].url.origin;
    }
    get pathname() {
        return this[Internal].url.pathname;
    }
    set pathname(value) {
        this[Internal].url.pathname = value;
    }
    get hash() {
        return this[Internal].url.hash;
    }
    set hash(value) {
        this[Internal].url.hash = value;
    }
    get search() {
        return this[Internal].url.search;
    }
    set search(value) {
        this[Internal].url.search = value;
    }
    get password() {
        return this[Internal].url.password;
    }
    set password(value) {
        this[Internal].url.password = value;
    }
    get username() {
        return this[Internal].url.username;
    }
    set username(value) {
        this[Internal].url.username = value;
    }
    get basePath() {
        return this[Internal].basePath;
    }
    set basePath(value) {
        this[Internal].basePath = value.startsWith("/") ? value : `/${value}`;
    }
    toString() {
        return this.href;
    }
    toJSON() {
        return this.href;
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            href: this.href,
            origin: this.origin,
            protocol: this.protocol,
            username: this.username,
            password: this.password,
            host: this.host,
            hostname: this.hostname,
            port: this.port,
            pathname: this.pathname,
            search: this.search,
            searchParams: this.searchParams,
            hash: this.hash
        };
    }
    clone() {
        return new NextURL(String(this), this[Internal].options);
    }
} //# sourceMappingURL=next-url.js.map


/***/ }),

/***/ 1778:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyHeadersError: function() {
        return ReadonlyHeadersError;
    },
    HeadersAdapter: function() {
        return HeadersAdapter;
    }
});
const _reflect = __webpack_require__(9877);
class ReadonlyHeadersError extends Error {
    constructor(){
        super("Headers cannot be modified. Read more: https://nextjs.org/docs/api-reference/headers");
    }
    static callable() {
        throw new ReadonlyHeadersError();
    }
}
class HeadersAdapter extends Headers {
    constructor(headers){
        // We've already overridden the methods that would be called, so we're just
        // calling the super constructor to ensure that the instanceof check works.
        super();
        this.headers = new Proxy(headers, {
            get (target, prop, receiver) {
                // Because this is just an object, we expect that all "get" operations
                // are for properties. If it's a "get" for a symbol, we'll just return
                // the symbol.
                if (typeof prop === "symbol") {
                    return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return undefined.
                if (typeof original === "undefined") return;
                // If the original casing exists, return the value.
                return _reflect.ReflectAdapter.get(target, original, receiver);
            },
            set (target, prop, value, receiver) {
                if (typeof prop === "symbol") {
                    return _reflect.ReflectAdapter.set(target, prop, value, receiver);
                }
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, use the prop as the key.
                return _reflect.ReflectAdapter.set(target, original ?? prop, value, receiver);
            },
            has (target, prop) {
                if (typeof prop === "symbol") return _reflect.ReflectAdapter.has(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return false.
                if (typeof original === "undefined") return false;
                // If the original casing exists, return true.
                return _reflect.ReflectAdapter.has(target, original);
            },
            deleteProperty (target, prop) {
                if (typeof prop === "symbol") return _reflect.ReflectAdapter.deleteProperty(target, prop);
                const lowercased = prop.toLowerCase();
                // Let's find the original casing of the key. This assumes that there is
                // no mixed case keys (e.g. "Content-Type" and "content-type") in the
                // headers object.
                const original = Object.keys(headers).find((o)=>o.toLowerCase() === lowercased);
                // If the original casing doesn't exist, return true.
                if (typeof original === "undefined") return true;
                // If the original casing exists, delete the property.
                return _reflect.ReflectAdapter.deleteProperty(target, original);
            }
        });
    }
    /**
   * Seals a Headers instance to prevent modification by throwing an error when
   * any mutating method is called.
   */ static seal(headers) {
        return new Proxy(headers, {
            get (target, prop, receiver) {
                switch(prop){
                    case "append":
                    case "delete":
                    case "set":
                        return ReadonlyHeadersError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
    /**
   * Merges a header value into a string. This stores multiple values as an
   * array, so we need to merge them into a string.
   *
   * @param value a header value
   * @returns a merged header value (a string)
   */ merge(value) {
        if (Array.isArray(value)) return value.join(", ");
        return value;
    }
    /**
   * Creates a Headers instance from a plain object or a Headers instance.
   *
   * @param headers a plain object or a Headers instance
   * @returns a headers instance
   */ static from(headers) {
        if (headers instanceof Headers) return headers;
        return new HeadersAdapter(headers);
    }
    append(name, value) {
        const existing = this.headers[name];
        if (typeof existing === "string") {
            this.headers[name] = [
                existing,
                value
            ];
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            this.headers[name] = value;
        }
    }
    delete(name) {
        delete this.headers[name];
    }
    get(name) {
        const value = this.headers[name];
        if (typeof value !== "undefined") return this.merge(value);
        return null;
    }
    has(name) {
        return typeof this.headers[name] !== "undefined";
    }
    set(name, value) {
        this.headers[name] = value;
    }
    forEach(callbackfn, thisArg) {
        for (const [name, value] of this.entries()){
            callbackfn.call(thisArg, value, name, this);
        }
    }
    *entries() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(name);
            yield [
                name,
                value
            ];
        }
    }
    *keys() {
        for (const key of Object.keys(this.headers)){
            const name = key.toLowerCase();
            yield name;
        }
    }
    *values() {
        for (const key of Object.keys(this.headers)){
            // We assert here that this is a string because we got it from the
            // Object.keys() call above.
            const value = this.get(key);
            yield value;
        }
    }
    [Symbol.iterator]() {
        return this.entries();
    }
} //# sourceMappingURL=headers.js.map


/***/ }),

/***/ 9877:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "ReflectAdapter", ({
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
}));
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
} //# sourceMappingURL=reflect.js.map


/***/ }),

/***/ 127:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ReadonlyRequestCookiesError: function() {
        return ReadonlyRequestCookiesError;
    },
    RequestCookiesAdapter: function() {
        return RequestCookiesAdapter;
    },
    appendMutableCookies: function() {
        return appendMutableCookies;
    },
    MutableRequestCookiesAdapter: function() {
        return MutableRequestCookiesAdapter;
    }
});
const _cookies = __webpack_require__(8306);
const _reflect = __webpack_require__(9877);
class ReadonlyRequestCookiesError extends Error {
    constructor(){
        super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
    }
    static callable() {
        throw new ReadonlyRequestCookiesError();
    }
}
class RequestCookiesAdapter {
    static seal(cookies) {
        return new Proxy(cookies, {
            get (target, prop, receiver) {
                switch(prop){
                    case "clear":
                    case "delete":
                    case "set":
                        return ReadonlyRequestCookiesError.callable;
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
}
const SYMBOL_MODIFY_COOKIE_VALUES = Symbol.for("next.mutated.cookies");
function getModifiedCookieValues(cookies) {
    const modified = cookies[SYMBOL_MODIFY_COOKIE_VALUES];
    if (!modified || !Array.isArray(modified) || modified.length === 0) {
        return [];
    }
    return modified;
}
function appendMutableCookies(headers, mutableCookies) {
    const modifiedCookieValues = getModifiedCookieValues(mutableCookies);
    if (modifiedCookieValues.length === 0) {
        return false;
    }
    // Return a new response that extends the response with
    // the modified cookies as fallbacks. `res`' cookies
    // will still take precedence.
    const resCookies = new _cookies.ResponseCookies(headers);
    const returnedCookies = resCookies.getAll();
    // Set the modified cookies as fallbacks.
    for (const cookie of modifiedCookieValues){
        resCookies.set(cookie);
    }
    // Set the original cookies as the final values.
    for (const cookie of returnedCookies){
        resCookies.set(cookie);
    }
    return true;
}
class MutableRequestCookiesAdapter {
    static wrap(cookies, res) {
        const responseCookes = new _cookies.ResponseCookies(new Headers());
        for (const cookie of cookies.getAll()){
            responseCookes.set(cookie);
        }
        let modifiedValues = [];
        const modifiedCookies = new Set();
        const updateResponseCookies = ()=>{
            var _fetch___nextGetStaticStore;
            // TODO-APP: change method of getting staticGenerationAsyncStore
            const staticGenerationAsyncStore = fetch.__nextGetStaticStore == null ? void 0 : (_fetch___nextGetStaticStore = fetch.__nextGetStaticStore()) == null ? void 0 : _fetch___nextGetStaticStore.getStore();
            if (staticGenerationAsyncStore) {
                staticGenerationAsyncStore.pathWasRevalidated = true;
            }
            const allCookies = responseCookes.getAll();
            modifiedValues = allCookies.filter((c)=>modifiedCookies.has(c.name));
            if (res) {
                const serializedCookies = [];
                for (const cookie of modifiedValues){
                    const tempCookies = new _cookies.ResponseCookies(new Headers());
                    tempCookies.set(cookie);
                    serializedCookies.push(tempCookies.toString());
                }
                res.setHeader("Set-Cookie", serializedCookies);
            }
        };
        return new Proxy(responseCookes, {
            get (target, prop, receiver) {
                switch(prop){
                    // A special symbol to get the modified cookie values
                    case SYMBOL_MODIFY_COOKIE_VALUES:
                        return modifiedValues;
                    // TODO: Throw error if trying to set a cookie after the response
                    // headers have been set.
                    case "delete":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                target.delete(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    case "set":
                        return function(...args) {
                            modifiedCookies.add(typeof args[0] === "string" ? args[0] : args[0].name);
                            try {
                                return target.set(...args);
                            } finally{
                                updateResponseCookies();
                            }
                        };
                    default:
                        return _reflect.ReflectAdapter.get(target, prop, receiver);
                }
            }
        });
    }
} //# sourceMappingURL=request-cookies.js.map


/***/ }),

/***/ 8306:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && 0;
_export_star(__webpack_require__(7783), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
} //# sourceMappingURL=cookies.js.map


/***/ }),

/***/ 7779:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "E", ({
    enumerable: true,
    get: function() {
        return ImageResponse;
    }
}));
class ImageResponse {
    constructor(...args){
        // @ts-expect-error - process.turbopack is a custom property
        if (process.turbopack) {
            // TODO(sokra) enable this again when turbopack supports wasm
            throw new Error("Turbopack doesn't support ImageResponse currently");
        } else {
            const readable = new ReadableStream({
                async start (controller) {
                    const OGImageResponse = // as the auto resolving is not working
                    (await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 4021))).ImageResponse;
                    const imageResponse = new OGImageResponse(...args);
                    if (!imageResponse.body) {
                        return controller.close();
                    }
                    const reader = imageResponse.body.getReader();
                    while(true){
                        const { done , value  } = await reader.read();
                        if (done) {
                            return controller.close();
                        }
                        controller.enqueue(value);
                    }
                }
            });
            const options = args[1] || {};
            return new Response(readable, {
                headers: {
                    "content-type": "image/png",
                    "cache-control":  false ? 0 : "public, immutable, no-transform, max-age=31536000",
                    ...options.headers
                },
                status: options.status,
                statusText: options.statusText
            });
        }
    }
} //# sourceMappingURL=image-response.js.map


/***/ }),

/***/ 2091:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERNALS: function() {
        return INTERNALS;
    },
    NextRequest: function() {
        return NextRequest;
    }
});
const _nexturl = __webpack_require__(4576);
const _utils = __webpack_require__(3547);
const _error = __webpack_require__(300);
const _cookies = __webpack_require__(8306);
const INTERNALS = Symbol("internal request");
class NextRequest extends Request {
    constructor(input, init = {}){
        const url = typeof input !== "string" && "url" in input ? input.url : String(input);
        (0, _utils.validateURL)(url);
        super(url, init);
        const nextUrl = new _nexturl.NextURL(url, {
            headers: (0, _utils.toNodeHeaders)(this.headers),
            nextConfig: init.nextConfig
        });
        this[INTERNALS] = {
            cookies: new _cookies.RequestCookies(this.headers),
            geo: init.geo || {},
            ip: init.ip,
            nextUrl,
            url:  false ? 0 : nextUrl.toString()
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            geo: this.geo,
            ip: this.ip,
            nextUrl: this.nextUrl,
            url: this.url,
            // rest of props come from Request
            bodyUsed: this.bodyUsed,
            cache: this.cache,
            credentials: this.credentials,
            destination: this.destination,
            headers: Object.fromEntries(this.headers),
            integrity: this.integrity,
            keepalive: this.keepalive,
            method: this.method,
            mode: this.mode,
            redirect: this.redirect,
            referrer: this.referrer,
            referrerPolicy: this.referrerPolicy,
            signal: this.signal
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    get geo() {
        return this[INTERNALS].geo;
    }
    get ip() {
        return this[INTERNALS].ip;
    }
    get nextUrl() {
        return this[INTERNALS].nextUrl;
    }
    /**
   * @deprecated
   * `page` has been deprecated in favour of `URLPattern`.
   * Read more: https://nextjs.org/docs/messages/middleware-request-page
   */ get page() {
        throw new _error.RemovedPageError();
    }
    /**
   * @deprecated
   * `ua` has been removed in favour of \`userAgent\` function.
   * Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
   */ get ua() {
        throw new _error.RemovedUAError();
    }
    get url() {
        return this[INTERNALS].url;
    }
} //# sourceMappingURL=request.js.map


/***/ }),

/***/ 6843:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
Object.defineProperty(exports, "x", ({
    enumerable: true,
    get: function() {
        return NextResponse;
    }
}));
const _nexturl = __webpack_require__(4576);
const _utils = __webpack_require__(3547);
const _cookies = __webpack_require__(8306);
const INTERNALS = Symbol("internal response");
const REDIRECTS = new Set([
    301,
    302,
    303,
    307,
    308
]);
function handleMiddlewareField(init, headers) {
    var _init_request;
    if (init == null ? void 0 : (_init_request = init.request) == null ? void 0 : _init_request.headers) {
        if (!(init.request.headers instanceof Headers)) {
            throw new Error("request.headers must be an instance of Headers");
        }
        const keys = [];
        for (const [key, value] of init.request.headers){
            headers.set("x-middleware-request-" + key, value);
            keys.push(key);
        }
        headers.set("x-middleware-override-headers", keys.join(","));
    }
}
class NextResponse extends Response {
    constructor(body, init = {}){
        super(body, init);
        this[INTERNALS] = {
            cookies: new _cookies.ResponseCookies(this.headers),
            url: init.url ? new _nexturl.NextURL(init.url, {
                headers: (0, _utils.toNodeHeaders)(this.headers),
                nextConfig: init.nextConfig
            }) : undefined
        };
    }
    [Symbol.for("edge-runtime.inspect.custom")]() {
        return {
            cookies: this.cookies,
            url: this.url,
            // rest of props come from Response
            body: this.body,
            bodyUsed: this.bodyUsed,
            headers: Object.fromEntries(this.headers),
            ok: this.ok,
            redirected: this.redirected,
            status: this.status,
            statusText: this.statusText,
            type: this.type
        };
    }
    get cookies() {
        return this[INTERNALS].cookies;
    }
    static json(body, init) {
        // @ts-expect-error This is not in lib/dom right now, and we can't augment it.
        const response = Response.json(body, init);
        return new NextResponse(response.body, response);
    }
    static redirect(url, init) {
        const status = typeof init === "number" ? init : (init == null ? void 0 : init.status) ?? 307;
        if (!REDIRECTS.has(status)) {
            throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        const initObj = typeof init === "object" ? init : {};
        const headers = new Headers(initObj == null ? void 0 : initObj.headers);
        headers.set("Location", (0, _utils.validateURL)(url));
        return new NextResponse(null, {
            ...initObj,
            headers,
            status
        });
    }
    static rewrite(destination, init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-rewrite", (0, _utils.validateURL)(destination));
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
    static next(init) {
        const headers = new Headers(init == null ? void 0 : init.headers);
        headers.set("x-middleware-next", "1");
        handleMiddlewareField(init, headers);
        return new NextResponse(null, {
            ...init,
            headers
        });
    }
} //# sourceMappingURL=response.js.map


/***/ }),

/***/ 103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isBot: function() {
        return isBot;
    },
    userAgentFromString: function() {
        return userAgentFromString;
    },
    userAgent: function() {
        return userAgent;
    }
});
const _uaparserjs = /*#__PURE__*/ _interop_require_default(__webpack_require__(2196));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function isBot(input) {
    return /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i.test(input);
}
function userAgentFromString(input) {
    return {
        ...(0, _uaparserjs.default)(input),
        isBot: input === undefined ? false : isBot(input)
    };
}
function userAgent({ headers  }) {
    return userAgentFromString(headers.get("user-agent") || undefined);
} //# sourceMappingURL=user-agent.js.map


/***/ }),

/***/ 3547:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
0 && (0);
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    fromNodeHeaders: function() {
        return fromNodeHeaders;
    },
    splitCookiesString: function() {
        return splitCookiesString;
    },
    toNodeHeaders: function() {
        return toNodeHeaders;
    },
    validateURL: function() {
        return validateURL;
    }
});
function fromNodeHeaders(object) {
    const headers = new Headers();
    for (let [key, value] of Object.entries(object)){
        const values = Array.isArray(value) ? value : [
            value
        ];
        for (let v of values){
            if (typeof v === "undefined") continue;
            if (typeof v === "number") {
                v = v.toString();
            }
            headers.append(key, v);
        }
    }
    return headers;
}
function splitCookiesString(cookiesString) {
    var cookiesStrings = [];
    var pos = 0;
    var start;
    var ch;
    var lastComma;
    var nextStart;
    var cookiesSeparatorFound;
    function skipWhitespace() {
        while(pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))){
            pos += 1;
        }
        return pos < cookiesString.length;
    }
    function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
    }
    while(pos < cookiesString.length){
        start = pos;
        cookiesSeparatorFound = false;
        while(skipWhitespace()){
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
                // ',' is a cookie separator if we have later first '=', not ';' or ','
                lastComma = pos;
                pos += 1;
                skipWhitespace();
                nextStart = pos;
                while(pos < cookiesString.length && notSpecialChar()){
                    pos += 1;
                }
                // currently special character
                if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                    // we found cookies separator
                    cookiesSeparatorFound = true;
                    // pos is inside the next cookie, so back up and return it.
                    pos = nextStart;
                    cookiesStrings.push(cookiesString.substring(start, lastComma));
                    start = pos;
                } else {
                    // in param ',' or param separator ';',
                    // we continue from that comma
                    pos = lastComma + 1;
                }
            } else {
                pos += 1;
            }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
    }
    return cookiesStrings;
}
function toNodeHeaders(headers) {
    const result = {};
    const cookies = [];
    if (headers) {
        for (const [key, value] of headers.entries()){
            if (key.toLowerCase() === "set-cookie") {
                // We may have gotten a comma joined string of cookies, or multiple
                // set-cookie headers. We need to merge them into one header array
                // to represent all the cookies.
                cookies.push(...splitCookiesString(value));
                result[key] = cookies.length === 1 ? cookies[0] : cookies;
            } else {
                result[key] = value;
            }
        }
    }
    return result;
}
function validateURL(url) {
    try {
        return String(new URL(String(url)));
    } catch (error) {
        throw new Error(`URL is malformed "${String(url)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, {
            cause: error
        });
    }
} //# sourceMappingURL=utils.js.map


/***/ }),

/***/ 3196:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getHostname", ({
    enumerable: true,
    get: function() {
        return getHostname;
    }
}));
function getHostname(parsed, headers) {
    // Get the hostname from the headers if it exists, otherwise use the parsed
    // hostname.
    let hostname;
    if ((headers == null ? void 0 : headers.host) && !Array.isArray(headers.host)) {
        hostname = headers.host.toString().split(":")[0];
    } else if (parsed.hostname) {
        hostname = parsed.hostname;
    } else return;
    return hostname.toLowerCase();
} //# sourceMappingURL=get-hostname.js.map


/***/ }),

/***/ 5509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "addLocale", ({
    enumerable: true,
    get: function() {
        return addLocale;
    }
}));
const _addpathprefix = __webpack_require__(9399);
const _pathhasprefix = __webpack_require__(1807);
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if ((0, _pathhasprefix.pathHasPrefix)(lower, "/api")) return path;
        if ((0, _pathhasprefix.pathHasPrefix)(lower, "/" + locale.toLowerCase())) return path;
    }
    // Add the locale prefix to the path.
    return (0, _addpathprefix.addPathPrefix)(path, "/" + locale);
} //# sourceMappingURL=add-locale.js.map


/***/ }),

/***/ 9399:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "addPathPrefix", ({
    enumerable: true,
    get: function() {
        return addPathPrefix;
    }
}));
const _parsepath = __webpack_require__(356);
function addPathPrefix(path, prefix) {
    if (!path.startsWith("/") || !prefix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsepath.parsePath)(path);
    return "" + prefix + pathname + query + hash;
} //# sourceMappingURL=add-path-prefix.js.map


/***/ }),

/***/ 3335:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "addPathSuffix", ({
    enumerable: true,
    get: function() {
        return addPathSuffix;
    }
}));
const _parsepath = __webpack_require__(356);
function addPathSuffix(path, suffix) {
    if (!path.startsWith("/") || !suffix) {
        return path;
    }
    const { pathname , query , hash  } = (0, _parsepath.parsePath)(path);
    return "" + pathname + suffix + query + hash;
} //# sourceMappingURL=add-path-suffix.js.map


/***/ }),

/***/ 182:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "formatNextPathnameInfo", ({
    enumerable: true,
    get: function() {
        return formatNextPathnameInfo;
    }
}));
const _removetrailingslash = __webpack_require__(8454);
const _addpathprefix = __webpack_require__(9399);
const _addpathsuffix = __webpack_require__(3335);
const _addlocale = __webpack_require__(5509);
function formatNextPathnameInfo(info) {
    let pathname = (0, _addlocale.addLocale)(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
    }
    if (info.buildId) {
        pathname = (0, _addpathsuffix.addPathSuffix)((0, _addpathprefix.addPathPrefix)(pathname, "/_next/data/" + info.buildId), info.pathname === "/" ? "index.json" : ".json");
    }
    pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith("/") ? (0, _addpathsuffix.addPathSuffix)(pathname, "/") : pathname : (0, _removetrailingslash.removeTrailingSlash)(pathname);
} //# sourceMappingURL=format-next-pathname-info.js.map


/***/ }),

/***/ 9269:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "getNextPathnameInfo", ({
    enumerable: true,
    get: function() {
        return getNextPathnameInfo;
    }
}));
const _normalizelocalepath = __webpack_require__(9959);
const _removepathprefix = __webpack_require__(8515);
const _pathhasprefix = __webpack_require__(1807);
function getNextPathnameInfo(pathname, options) {
    var _options_nextConfig;
    const { basePath , i18n , trailingSlash  } = (_options_nextConfig = options.nextConfig) != null ? _options_nextConfig : {};
    const info = {
        pathname: pathname,
        trailingSlash: pathname !== "/" ? pathname.endsWith("/") : trailingSlash
    };
    if (basePath && (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)) {
        info.pathname = (0, _removepathprefix.removePathPrefix)(info.pathname, basePath);
        info.basePath = basePath;
    }
    if (options.parseData === true && info.pathname.startsWith("/_next/data/") && info.pathname.endsWith(".json")) {
        const paths = info.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
        const buildId = paths[0];
        info.pathname = paths[1] !== "index" ? "/" + paths.slice(1).join("/") : "/";
        info.buildId = buildId;
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (options.i18nProvider) {
        const result = options.i18nProvider.analyze(info.pathname);
        info.locale = result.detectedLocale;
        var _result_pathname;
        info.pathname = (_result_pathname = result.pathname) != null ? _result_pathname : info.pathname;
    } else if (i18n) {
        const pathLocale = (0, _normalizelocalepath.normalizeLocalePath)(info.pathname, i18n.locales);
        info.locale = pathLocale.detectedLocale;
        var _pathLocale_pathname;
        info.pathname = (_pathLocale_pathname = pathLocale.pathname) != null ? _pathLocale_pathname : info.pathname;
    }
    return info;
} //# sourceMappingURL=get-next-pathname-info.js.map


/***/ }),

/***/ 356:
/***/ ((__unused_webpack_module, exports) => {

/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ 
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "parsePath", ({
    enumerable: true,
    get: function() {
        return parsePath;
    }
}));
function parsePath(path) {
    const hashIndex = path.indexOf("#");
    const queryIndex = path.indexOf("?");
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : "",
            hash: hashIndex > -1 ? path.slice(hashIndex) : ""
        };
    }
    return {
        pathname: path,
        query: "",
        hash: ""
    };
} //# sourceMappingURL=parse-path.js.map


/***/ }),

/***/ 1807:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "pathHasPrefix", ({
    enumerable: true,
    get: function() {
        return pathHasPrefix;
    }
}));
const _parsepath = __webpack_require__(356);
function pathHasPrefix(path, prefix) {
    if (typeof path !== "string") {
        return false;
    }
    const { pathname  } = (0, _parsepath.parsePath)(path);
    return pathname === prefix || pathname.startsWith(prefix + "/");
} //# sourceMappingURL=path-has-prefix.js.map


/***/ }),

/***/ 8515:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "removePathPrefix", ({
    enumerable: true,
    get: function() {
        return removePathPrefix;
    }
}));
const _pathhasprefix = __webpack_require__(1807);
function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith("/")) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return "/" + withoutPrefix;
} //# sourceMappingURL=remove-path-prefix.js.map


/***/ }),

/***/ 8529:
/***/ ((module, exports, __webpack_require__) => {


const serverExports = {
    NextRequest: (__webpack_require__(2091).NextRequest),
    NextResponse: (__webpack_require__(6843)/* .NextResponse */ .x),
    ImageResponse: (__webpack_require__(7779)/* .ImageResponse */ .E),
    userAgentFromString: (__webpack_require__(103).userAgentFromString),
    userAgent: (__webpack_require__(103).userAgent)
};
if (typeof URLPattern !== "undefined") {
    // eslint-disable-next-line no-undef
    serverExports.URLPattern = URLPattern;
}
// https://nodejs.org/api/esm.html#commonjs-namespaces
// When importing CommonJS modules, the module.exports object is provided as the default export
module.exports = serverExports;
// make import { xxx } from 'next/server' work
exports.NextRequest = serverExports.NextRequest;
exports.NextResponse = serverExports.NextResponse;
exports.ImageResponse = serverExports.ImageResponse;
exports.userAgentFromString = serverExports.userAgentFromString;
exports.userAgent = serverExports.userAgent;
exports.URLPattern = serverExports.URLPattern;


/***/ })

};
;