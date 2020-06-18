(function(){

// Note: This code is a derivative of Try It Online https://github.com/TryItOnline/tryitonline.

utils = {};
utils.session = function() { return new Session() };
utils.tioURL = "https://tio.run/"
utils.langURL = "/static/3fbdee7a34cd8d340fe2dbd19acd2391-languages.json";
utils.authKeyURL = "/cgi-bin/static/04cc47c57f016cbe971132df49bf9125-auth";
utils.cacheURL = "/cgi-bin/static/5f222455af4449f60c97222aa04d3510-cache";
utils.quitURL = "/cgi-bin/static/c5ba5a3ddf5ce434ee4017d5cbc9f9f2-quit";
utils.runURL = "/cgi-bin/static/fb67788fd3d1ebf92e66b295525335af-run";

utils.fieldSeparator = "\xff";
utils.greeted = "65a4609a"
utils.languages;
utils.ms = window.MSInputMethodContext !== undefined;
utils.rEmptyStateString = /^[^ÿ]+ÿ+$/;
utils.rExtraFieldStrings = /\xfe[\x00-\xf3\xff]+/g;
utils.rEscapees = /[\x00-\x09\x0b-\x1f\x7f-\x9f&<>]| $/gm;
utils.rFieldString = /^[\x00-\xf3\xff]+/;
utils.rNewLine = /^/gm;
utils.rLineOfSpaces = /^\s+$/m;
utils.rSettingString = /\xf5[\x20-\x7e]+/;
utils.rSurroundingLinefeed = /^\n|\n$/;
utils.rUnpairedSurrogates = /[\ud800-\udbff](?![\udc00-\udfff])|([^\ud800-\udbff]|^)[\udc00-\udfff]/;
utils.rUnicodeCharacters = /[^][\udc00-\udfff]?/g;
utils.rUnprintable = /[\x00-\x09\x0b-\x1f\x7f-\x9f]/;
utils.rXxdLastLine = /(\w+):(.*?)\s\s.*$/;
utils.startOfExtraFields = "\xfe";
utils.startOfSettings = "\xf5";
utils.touchDevice = navigator.MaxTouchPoints > 0 || window.ontouchstart !== undefined;

function is_func(obj) { return obj instanceof Function }
function is_obj(obj) { return !is_func(obj) && obj instanceof Object }
function can_attach(obj) { return obj instanceof Object }
function to_string(obj) { return ((obj instanceof Object) ? obj.toString() : obj) + "" }

function _add_onevent(onevent, eventHandler, eventType) {
    if(onevent in eventHandler)
    {
        if(!is_func(eventHandler[onevent]))
        {
            try{ delete eventHandler[onevent] }
            catch(e) { throw new Error("Cannot attach event: " + onevent) }
        }
        else
        {
            return;
        }
    }

    eventHandler[onevent] = function(event_instance) {
        if(!(event_instance instanceof eventType)) {
            var Type = Function.bind.apply(eventType, [null].concat(Array.prototype.slice.call(arguments)));
            event_instance = new Type;
        }
        var remove = [];
        for(var i = 0, l = eventHandler[onevent].__events__.length; i < l; ++i)
        {
            if(!eventHandler[onevent].__pers__[i]) remove.push(i);
            eventHandler[onevent].__events__[i].apply(eventHandler, [event_instance]);
        }
        for(var i = remove.length; i--;) {
            eventHandler[onevent].__events__.splice(remove[i], 1);
            eventHandler[onevent].__pers__.splice(remove[i], 1);
        }
    };
    eventHandler[onevent].__events__ = [];
    eventHandler[onevent].__pers__ = [];
    
    eventHandler[onevent].clear = function() {
        eventHandler[onevent].__events__ = [];
        eventHandler[onevent].__pers__ = [];
    }
    
    eventHandler[onevent].add = function(f, is_persistent) {
        is_persistent = is_persistent === undefined || is_persistent;
        if(is_func(f) && (onevent in eventHandler)
            && is_func(eventHandler[onevent]) && ("__events__" in eventHandler[onevent]))
        {
            for(var i = 0, l = eventHandler[onevent].__events__.length; i < l; ++i)
            {
                if(eventHandler[onevent].__events__[i] === f)
                    return f;
            }
            eventHandler[onevent].__events__.push(f);
            eventHandler[onevent].__pers__.push(is_persistent);
        }
        return f;
    };
    
    eventHandler[onevent].remove = function(f) {
        if(is_func(f) && (onevent in eventHandler)
            && is_func(eventHandler[onevent]) && ("__events__" in eventHandler[onevent]))
        {
            for(var i = 0, l = eventHandler[onevent].__events__.length; i < l; ++i)
            {
                if(eventHandler[onevent].__events__[i] === f) {
                    eventHandler[onevent].__events__.splice(i, 1);
                    eventHandler[onevent].__pers__.splice(i, 1);
                    return f;
                }
            }
        }
        return f;
    };
}

function _add_addEventListener(eventHandler) {
    if("addEventListener" in eventHandler)
    {
        if(!is_func(eventHandler.addEventListener))
        {
            try{ delete eventHandler.addEventListener }
            catch(e) { throw new Error("Cannot attach event addEventListener.") }
        }
        else
        {
            return;
        }
    }
    eventHandler["addEventListener"] = function(event, f, is_persistent) {
        is_persistent = is_persistent === undefined || is_persistent;
        var onevent = "on" + to_string(event);
        return eventHandler[onevent].add(f, is_persistent);
    };
}
function _add_removeEventListener(eventHandler) {
    if("removeEventListener" in eventHandler)
    {
        if(!is_func(eventHandler.removeEventListener))
        {
            try{ delete eventHandler.removeEventListener }
            catch(e) { throw new Error("Cannot attach removeEventListener.") }
        }
        else
        {
            return;
        }
    }
    eventHandler["removeEventListener"] = function(event, f) {
        return eventHandler["on" + to_string(event)].remove(f);
    };
}

utils.onlistener = function(eventHandler, event, eventType) {
    if(can_attach(eventHandler))
    {
        if(event !== undefined)
            var onevent = (event = to_string(event));

        // Makes own eventType object.
        if(onevent && !is_func(eventType)) {
            eventType = eval("(function(){return function " 
                            + event + "Event(){this.args = Array.prototype.slice.call(arguments)}})()");
        }

        if(onevent) _add_onevent(onevent, eventHandler, eventType);
        _add_addEventListener(eventHandler);
        _add_removeEventListener(eventHandler);

        var result = {};
        if(onevent)
        {
            result.onevent = onevent;
            result[onevent] = eventHandler[onevent];
            result.eventType = eventType;
            result.plugin = eventType.plugin;
        }
        
        result.addEventListener = eventHandler.addEventListener;
        result.removeEventListener = eventHandler.removeEventListener;
        result.eventHandler = eventHandler;
    }

    return result;
};
 
function string_splice(string, index, count, add) {
    return string.slice(0, index) + add + string.slice(index + count);
}
utils.string_splice = string_splice;
    
function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}
utils.encode_utf8 = encode_utf8;

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}
utils.decode_utf8 = decode_utf8;

function pluralization(number, string) {
    return number + " " + string + (number == 1 ? "" : "s");
}
    
function iterate(iterable, monad) {
    if (!iterable)
        return;
    for (var i = 0; i < iterable.length; i++)
        monad(iterable[i]);
}
utils.iterate = iterate;

function deflate(byteString) {
    return pako.deflateRaw(byteStringToByteArray(byteString), {"level": 9});
}
utils.deflate = deflate;

function inflate(byteString) {
    return byteArrayToByteString(pako.inflateRaw(byteString));
}
utils.inflate = inflate;

function byteStringToByteArray(byteString) {
    var byteArray = new Uint8Array(byteString.length);
    for(var index = 0; index < byteString.length; index++)
        byteArray[index] = byteString.charCodeAt(index);
    byteArray.head = 0;
    return byteArray;
}

function byteArrayToByteString(byteArray) {
    var retval = "";
    iterate(byteArray, function(byte) { retval += String.fromCharCode(byte); });
    return retval;
}

function byteStringToBase64(byteString) {
    return btoa(byteString).replace(/\+/g, "@").replace(/=+/, "");
}

function base64ToByteString(base64String) {
    return atob(unescape(base64String).replace(/@|-/g, "+").replace(/_/g, "/"))
}

function count_bytes(string, encoding) {
    if (string === "")
        return 0;
    if (encoding == "SBCS")
        return string.match(utils.rUnicodeCharacters).length;
    if (encoding == "UTF-8")
        return encode_utf8(string).length;
    if (encoding == "nibbles")
        return Math.ceil(string.match(utils.rUnicodeCharacters).length / 2);
    if (encoding == "xxd") {
        var fields = string.match(utils.rXxdLastLine);
        if (!fields)
            return 0;
        return Number("0x" + fields[1]) + fields[2].match(/\S\S/g).length;
    }
}
utils.count_bytes = count_bytes;
utils.count_characters = function(code) { return count_bytes(code, "SBCS") };

function clone(queryString) {
    return $(queryString).cloneNode(true)
}

function codeToMarkdown(code) {
    if (code === "")
        return "<pre><code></code></pre>";
    if (utils.rLineOfSpaces.test(code) || utils.rSurroundingLinefeed.test(code) || utils.rUnprintable.test(code))
        return "<pre><code>" + code.replace(utils.rEscapees, function(character) {
            switch (character) {
                case "\0": return "";
                case "<":  return "&lt;";
                case ">":  return "&gt;";
                case "&":  return "&amp;";
                default:   return "&#" + character.charCodeAt(0) + ";";
            }
        }) + "\n</code></pre>";
    else
        return code.replace(utils.rNewLine, "    ");
}

function bufferToHex(buffer) {
    var dataView = new DataView(buffer);
    var retval = "";

    for (var i = 0; i < dataView.byteLength; i++)
        retval += (256 | dataView.getUint8(i)).toString(16).slice(-2);

    return retval;
}

function getRandomBits(minBits) {
    var crypto = window.crypto || window.msCrypto;
    return bufferToHex(crypto.getRandomValues(new Uint8Array(minBits + 7 >> 3)).buffer);
}

function sha256(byteArray, callback) {
    if (window.crypto)
        return (crypto.subtle || crypto.webkitSubtle).
            digest("SHA-256", byteArray).
            then(bufferToHex).
            then(callback);

    if (byteArray.length == 0)
        return callback('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

    var operation = utils.msCrypto.subtle.digest("SHA-256");
    operation.process(byteArray);
    operation.oncomplete = function(event) {
        callback(bufferToHex(event.target.result));
    };
    operation.finish();
}

//************************************************************************************************************
//************************************************************************************************************
//************************************************************************************************************
//************************************************************************************************************

function Message(title, message, category) {
    this.title = title;
    this.message = message;
    this.category = category;
}
    
function Session() {
    var self = this;
    self.runRequest = undefined;
    self.token = undefined;
    self._language = undefined;
    self.messages = [];
    self._code = "";
    self._header = "";
    self._footer = "";
    self._output = "";
    self._debug = "";

    self.utils = utils;

    utils.onlistener(self, "onmessage");
    utils.onlistener(self, "onoutput");
    utils.onlistener(self, "ondebug");
    utils.onlistener(self, "onrun");
    utils.onlistener(self, "onerror");
    utils.onlistener(self, "onload");
    utils.onlistener(self, "onquit");
    utils.onlistener(self, "oncomplete");

    utils.onlistener(self, "onsetoutput");
    utils.onlistener(self, "ongetoutput");
    utils.onlistener(self, "onsetdebug");
    utils.onlistener(self, "ongetdebug");

    utils.onlistener(self, "onsetlanguage");
    utils.onlistener(self, "ongetlanguage");
    utils.onlistener(self, "onsetcode");
    utils.onlistener(self, "ongetcode");
    utils.onlistener(self, "onsetheader");
    utils.onlistener(self, "ongetheader");
    utils.onlistener(self, "onsetfooter");
    utils.onlistener(self, "ongetfooter");
    utils.onlistener(self, "ongetstate");

    self.settings = [];
    self._options = [];
    self._cflags = [];
    self._driver = [];
    self.options = undefined;
    self.cflags = undefined;
    self.driver = undefined;
    self.args = [];
    self._input = "";
    utils.onlistener(self, "onsetinput");
    utils.onlistener(self, "ongetinput");

    self._characterCount = 0;
    self._byteCount = 0;
    
    self.alert = function(message) { alert(message) };

    //--------------------------------------------------------------------------------------------------------
    function runRequestOnReadyState() {
        if (self.runRequest.readyState != XMLHttpRequest.DONE)
            return;

        var response = byteArrayToByteString(new Uint8Array(self.runRequest.response));
        var statusCode = self.runRequest.status;
        var statusText = self.runRequest.statusText;

        self.runRequest = undefined;
        
        if (statusCode == 204) {
            self.run();
            self.onerror("Cache miss. Running code...");
            return;
        }

        if (statusCode >= 400) {
            self.message("Error " + statusCode, statusCode < 500 ? response || statusText : statusText);
            self.onerror(response, statusCode, statusText);
            return;
        }

        try {
            var rawOutput = inflate(response.slice(10));
        } catch(error) {
            self.message("Error", "The server's response could not be decoded.");
            self.onerror(response, "The server's response could not be decoded.");
            return;
        }

        try {
            response = decode_utf8(rawOutput);
        } catch(error) {
            response = rawOutput;
        }

        if (response.length < 32) {
            self.message("Error", "Could not establish or maintain a connection with the server.");
            self.onerror("Could not establish or maintain a connection with the server.");
        }

        var results = response.substr(16).split(response.substr(0, 16));
        self.output(results[0]);
        self.debug(results[1]);
        self.oncomplete();
    }

    //--------------------------------------------------------------------------------------------------------
    function getSettings(arguments) {
        var retval = "/";
        iterate(arguments, function(argument) { retval += (typeof argument === "string") ? argument + "/" : ""; })
        iterate(self.settings, function(setting) { retval += (typeof setting === "string") ? setting + "/" : ""; })
        return retval;
    }

    //--------------------------------------------------------------------------------------------------------
    self.message = function(title, message, category) {
        self.messages.push(new Message(title, message, category));
        self.onmessage();
    }

    //--------------------------------------------------------------------------------------------------------
    self.clear = function() {
        self.clear_messages();
        self.clear_results();
        self.clear_state();
    }

    //--------------------------------------------------------------------------------------------------------
    self.clear_messages = function() {
        self.messages = [];
        self.onmessage();
    }

    //--------------------------------------------------------------------------------------------------------
    self.clear_results = function() {
        self.output("");
        self.debug("");
    }
    
    //--------------------------------------------------------------------------------------------------------
    self.clear_state = function() {
        self._options = self.options || [];
        self._cflags = self.cflags || [];
        self._driver = self.driver || [];
        self.options = undefined;
        self.cflags = undefined;
        self.driver = undefined;
        self.args = [];
        self.input("");
    }

    //--------------------------------------------------------------------------------------------------------
    self.state = function() {
        self._unmask();
        self.ongetstate();
        var retval = "";
        self._real_code = (self.header() && self.header() + "\n") + self.code() + (self.footer() && "\n" + self.footer());

        var id = self.language()
        retval += "Vlang\0" + "1\0" + encode_utf8(id) + "\0";

        var language = self.utils._languages && self.utils._languages[id];
        
        if(self.options !== undefined && (!language || (language && language.unmask && language.unmask.includes("options")))) {
            retval += "VTIO_OPTIONS\0" + self.options.length + "\0";
            iterate(self.options, function(option) { retval += encode_utf8(option) + "\0" });
        }
        
        if(self.cflags !== undefined && (!language || (language && language.unmask && language.unmask.includes("cflags")))) {
            retval += "VTIO_CFLAGS\0" + self.cflags.length + "\0";
            iterate(self.cflags, function(cflag) { retval += encode_utf8(cflag) + "\0" });
        }
        
        if(self.driver !== undefined && (!language || (language && language.unmask && language.unmask.includes("driver")))) {
            retval += "VTIO_DRIVER\0" + self.driver.length + "\0";
            iterate(self.driver, function(driver) { retval += encode_utf8(driver) + "\0" });
        }

        if(self._real_code) {
            var code = encode_utf8(self._real_code);
            retval += "F.code.tio\0" + code.length + "\0" + code + "\0";
        } else {
            retval += "F.code.tio\0" + "0\0";
        }
        
        var input = self.input();
        if(input) {
            input = encode_utf8(input);
            retval += "F.input.tio\0" + input.length + "\0" + input + "\0";
        } else {
            retval += "F.input.tio\0" + "0\0";
        }
        retval += "Vargs\0" + self.args.length + "\0";
        iterate(self.args, function(arg) {
            retval += encode_utf8(arg) + "\0"
        });

        retval += "R"
        return retval;
    }

    //--------------------------------------------------------------------------------------------------------
    self.load = function(force) {
        if(!force && self.utils._languages) return;
        self.languageFileRequest = new XMLHttpRequest;
        function completeLoad() {
            self.utils._languages = JSON.parse(self.languageFileRequest.response);
            self.utils.languages = []

            for (var id in self.utils._languages) {
                var language = self.utils._languages[id];
                language.id = id;
                self.utils.languages.push(language);
                if(self.utils.longest_id_length < id.length) self.utils.longest_id_length = id.length;
            }

            self.utils.languages.sort(function(languageA, languageB) {
                return 2 * (languageA.name.toLowerCase() > languageB.name.toLowerCase()) - 1;
            });

            self.onload();
        }

        self.languageFileRequest.onreadystatechange = function() {
            try {
                if (self.languageFileRequest.readyState != XMLHttpRequest.DONE)
                    return;
                sha256(byteStringToByteArray(getRandomBits(128)), String);
            } catch(error) {
                console.error(error);

                if (error instanceof ReferenceError)
                    self.message("Error", "Some resources could not be loaded. Please refresh the page and try again.");
                else
                    // Yes this is the same error message...
                    alert("Your browser seems to lack a required feature.\n\nCurrently, the only supported browsers are Chrome/Chromium, Firefox, and Safari (recent versions), Edge (all versions), and Internet Explorer 11.\n\nIf you are using one of those browsers, you are receiving this message in error. Please send an email to feedback@tryitonline.net and include the error log below. You should be able to copy the error message from your console.\n\n" + error);
            }
            completeLoad();
        }
        self.languageFileRequest.open("GET", self.utils.tioURL + self.utils.langURL);
        self.languageFileRequest.send();
    }

    //--------------------------------------------------------------------------------------------------------
    self.run = function() {
        if (self.runRequest) {
            var quitRequest = new XMLHttpRequest;
            quitRequest.open("GET", self.utils.tioURL + self.utils.quitURL + "/" + self.token);
            self.onquit(quitRequest);
            quitRequest.send();
            return;
        }
        self.clear_results();
        self.token = getRandomBits(128);
        self.runRequest = new XMLHttpRequest;
        self.runRequest.open("POST", self.utils.tioURL + self.utils.runURL + getSettings(arguments) + self.token, true);
        self.runRequest.responseType = "arraybuffer";
        self.runRequest.onreadystatechange = runRequestOnReadyState;
        self.runRequest.send(deflate(self.state()));
        self.onrun();
    }

    //--------------------------------------------------------------------------------------------------------
    self.markdown = function() { return codeToMarkdown(self.code()); }

    //--------------------------------------------------------------------------------------------------------
    self._permalink = function() {
        var code = self._code;
        var language = self.utils._languages[self._language];
        var data = {
            "bytes": pluralization(count_bytes(code, language.encoding), "byte"),
            "markdownCode": self.markdown(),
            "prettifyHint": language.prettify ? "<!-- language-all: lang-" + language.prettify + " -->\n\n" : "",
            "lang": language.name,
            "link": language.link,
            "n": "\n",
            "nn": "\n\n",
            "permalink": location.href,
            "timestamp": Date.now().toString(36)
        }
        return data;
    };

    //--------------------------------------------------------------------------------------------------------
    self._probe_output_cache = function() {
        self.runRequest = new XMLHttpRequest;
        self.runRequest.open("POST", self.utils.tioURL + self.utils.cacheURL, true);
        self.runRequest.responseType = "arraybuffer";
        self.runRequest.onreadystatechange = runRequestOnReadyState;
        sha256(deflate(stateToByteString()), self.runRequest.send.bind(self.runRequest));
    }

    //--------------------------------------------------------------------------------------------------------
    self._unmask = function() {
        self._options = self.options || self._options;
        self._cflags = self.cflags || self._cflags;
        self._driver = self.driver || self._driver;
        if(self.utils._languages) {
            var language = self.utils._languages[self._language];
            self.options = undefined;
            self.cflags = undefined;
            self.driver = undefined;
            if(language.unmask) {
                iterate(language.unmask, function(data){ self[data] = self["_" + data] });
            }
        } else {
            self.options = self._options;
            self.cflags = self._cflags;
            self.driver = self._driver;
        }
    }

    //--------------------------------------------------------------------------------------------------------
    self.language = function(id) {
        if(id === undefined) { self.ongetlanguage(); return self._language }
        self._language = self.utils._languages ? self.utils._languages[id].id : id;
        self._unmask();
        self.onsetlanguage();
    }

    //--------------------------------------------------------------------------------------------------------
    self.byte_count = function() {
        if(self.utils._languages) {
            var encoding = self.utils._languages[self._language].encoding;
            return count_bytes(self._code, encoding);
        }
    }

    //--------------------------------------------------------------------------------------------------------
    self.character_count = function() {
        return count_characters(self._code, "SBCS");
    }

    //--------------------------------------------------------------------------------------------------------
    self.code = function(code) {
        if(code === undefined) { self.ongetcode(); return self._code }
        if (self.utils.rUnpairedSurrogates.test(code))
            self.message("Error", "invalid Unicode: unpaired surrogates");
        self._code = code;
        self.onsetcode();
    }

    //--------------------------------------------------------------------------------------------------------
    self.header = function(header) {
        if(header === undefined) { self.ongetheader(); return self._header }
        self._header = header;
        self.onsetheader();
    }

    //--------------------------------------------------------------------------------------------------------
    self.footer = function(footer) {
        if(footer === undefined) { self.ongetfooter(); return self._footer }
        self._footer = footer;
        self.onsetfooter();
    }

    //--------------------------------------------------------------------------------------------------------
    self.output = function(output) {
        if(output === undefined) { self.ongetoutput(); return self._output }
        self._output = output;
        self.onsetoutput();
    }

    //--------------------------------------------------------------------------------------------------------
    self.debug = function(debug) {
        if(debug === undefined) { self.ongetdebug(); return self._debug }
        self._debug = debug;
        self.onsetdebug();
    }

    //--------------------------------------------------------------------------------------------------------
    self.input = function(input) {
        if(input === undefined) { self.ongetinput(); return self._input }
        self._input = input;
        self.onsetinput();
    }
}

this.tio = utils.session();
utils.find_languages = function(name) {
    name = name.toLowerCase();
    var result = [];
    if(utils._languages)
        iterate(utils.languages, function(language) {
            if(~language.name.toLowerCase().indexOf(name))
                result.push(language);
        });
    return result;
};
utils.is_valid_id = function(_language) {
    return !!(utils._languages && utils._languages[_language])
}
utils.longest_id_length = 0;

})();
