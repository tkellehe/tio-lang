(function(){

// Note: This code is a derivative of Try It Online https://github.com/TryItOnline/tryitonline.

session = function() { return new Session() };
session.tioURL = "https://tio.run/"
session.langURL = "/static/3fbdee7a34cd8d340fe2dbd19acd2391-languages.json";
session.authKeyURL = "/cgi-bin/static/04cc47c57f016cbe971132df49bf9125-auth";
session.cacheURL = "/cgi-bin/static/5f222455af4449f60c97222aa04d3510-cache";
session.quitURL = "/cgi-bin/static/c5ba5a3ddf5ce434ee4017d5cbc9f9f2-quit";
session.runURL = "/cgi-bin/static/fb67788fd3d1ebf92e66b295525335af-run";

session.fieldSeparator = "\xff";
session.greeted = "65a4609a"
session.languages;
session.ms = window.MSInputMethodContext !== undefined;
session.rEmptyStateString = /^[^ÿ]+ÿ+$/;
session.rExtraFieldStrings = /\xfe[\x00-\xf3\xff]+/g;
session.rEscapees = /[\x00-\x09\x0b-\x1f\x7f-\x9f&<>]| $/gm;
session.rFieldString = /^[\x00-\xf3\xff]+/;
session.rNewLine = /^/gm;
session.rLineOfSpaces = /^\s+$/m;
session.rSettingString = /\xf5[\x20-\x7e]+/;
session.rSurroundingLinefeed = /^\n|\n$/;
session.rUnpairedSurrogates = /[\ud800-\udbff](?![\udc00-\udfff])|([^\ud800-\udbff]|^)[\udc00-\udfff]/;
session.rUnicodeCharacters = /[^][\udc00-\udfff]?/g;
session.rUnprintable = /[\x00-\x09\x0b-\x1f\x7f-\x9f]/;
session.rXxdLastLine = /(\w+):(.*?)\s\s.*$/;
session.startOfExtraFields = "\xfe";
session.startOfSettings = "\xf5";
session.touchDevice = navigator.MaxTouchPoints > 0 || window.ontouchstart !== undefined;

function pluralization(number, string) {
    return number + " " + string + (number == 1 ? "" : "s");
}
    
function iterate(iterable, monad) {
    if (!iterable)
        return;
    for (var i = 0; i < iterable.length; i++)
        monad(iterable[i]);
}

function deflate(byteString) {
    return pako.deflateRaw(byteStringToByteArray(byteString), {"level": 9});
}

function inflate(byteString) {
    return byteArrayToByteString(pako.inflateRaw(byteString));
}

function byteStringToByteArray(byteString) {
    var byteArray = new Uint8Array(byteString.length);
    for(var index = 0; index < byteString.length; index++)
        byteArray[index] = byteString.charCodeAt(index);
    byteArray.head = 0;
    return byteArray;
}

function textToByteString(string) {
	return unescape(encodeURIComponent(string));
}

function byteStringToText(byteString) {
	return decodeURIComponent(escape(byteString));
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

function countBytes(string, encoding) {
	if (string === "")
		return 0;
	if (encoding == "SBCS")
		return string.match(session.rUnicodeCharacters).length;
	if (encoding == "UTF-8")
		return textToByteString(string).length;
	if (encoding == "nibbles")
		return Math.ceil(string.match(session.rUnicodeCharacters).length / 2);
	if (encoding == "xxd") {
		var fields = string.match(session.rXxdLastLine);
		if (!fields)
			return 0;
		return Number("0x" + fields[1]) + fields[2].match(/\S\S/g).length;
	}
}

function clone(queryString) {
	return $(queryString).cloneNode(true)
}

function codeToMarkdown(code) {
	if (code === "")
		return "<pre><code></code></pre>";
	if (session.rLineOfSpaces.test(code) || session.rSurroundingLinefeed.test(code) || session.rUnprintable.test(code))
		return "<pre><code>" + code.replace(session.rEscapees, function(character) {
			switch (character) {
				case "\0": return "";
				case "<":  return "&lt;";
				case ">":  return "&gt;";
				case "&":  return "&amp;";
				default:   return "&#" + character.charCodeAt(0) + ";";
			}
		}) + "\n</code></pre>";
	else
		return code.replace(session.rNewLine, "    ");
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

	var operation = session.msCrypto.subtle.digest("SHA-256");
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

function Message(title, message) {
    this.title = title;
    this.message = message;
}
    
function Session() {
    var self = this;
    self.runRequest = undefined;
    self.token = undefined;
    self.languageId = undefined;
    self.messages = [];
    self._code = "";
    self._header = "";
    self._footer = "";
    self._output = "";
    self._debug = "";

    self.onmessage = function(){};
    self.onoutput = function(){};
    self.ondebug = function(){};
    self.onrun = function(){};
    self.onerror = function(){};
    self.onload = function(){};
    self.onquit = function(){};
    self.oncomplete = function(){};

    self.onsetoutput = function(){};
    self.ongetoutput = function(){};
    self.onsetdebug = function(){};
    self.ongetdebug = function(){};

    self.onsetlanguage = function(){};
    self.ongetlanguage = function(){};
    self.onsetcode = function(){};
    self.ongetcode = function(){};
    self.onsetheader = function(){};
    self.ongetheader = function(){};
    self.onsetfooter = function(){};
    self.ongetfooter = function(){};
    self.ongetstate = function(){};

    self.settings = [];
    self.options = undefined;
    self.cflags = undefined;
    self.driver = undefined;
    self.args = [];
    self._input = "";
    self.onsetinput = function(){};
    self.ongetinput = function(){};

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
            response = byteStringToText(rawOutput);
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
    self.message = function(title, message) {
        self.messages.push(new Message(title, message));
        self.onmessage();
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
        self.options = undefined;
        self.cflags = undefined;
        self.driver = undefined;
        self.args = [];
        self.input("");
    }

    //--------------------------------------------------------------------------------------------------------
    self.state = function() {
        self.ongetstate();
        var retval = "";
        self._real_code = (self.header() && self.header() + "\n") + self.code() + (self.footer() && "\n" + self.footer());

        var languageId = self.language()
        retval += "Vlang\0" + "1\0" + textToByteString(languageId) + "\0";

        var language = session._languages && session._languages[languageId];
        
        if(self.options !== undefined && (!language || (language && language.unmask && language.unmask.includes("options")))) {
            retval += "VTIO_OPTIONS\0" + self.options.length + "\0";
            iterate(self.options, function(option) { retval += textToByteString(option) + "\0" });
        }
        
        if(self.cflags !== undefined && (!language || (language && language.unmask && language.unmask.includes("cflags")))) {
            retval += "VTIO_CFLAGS\0" + self.cflags.length + "\0";
            iterate(self.cflags, function(cflag) { retval += textToByteString(cflag) + "\0" });
        }
        
        if(self.driver !== undefined && (!language || (language && language.unmask && language.unmask.includes("driver")))) {
            retval += "VTIO_DRIVER\0" + self.driver.length + "\0";
            iterate(self.driver, function(driver) { retval += textToByteString(driver) + "\0" });
        }

        if(self._real_code) {
            var code = textToByteString(self._real_code);
            retval += "F.code.tio\0" + code.length + "\0" + code + "\0";
        } else {
            retval += "F.code.tio\0" + "0\0";
        }
        
        var input = self.input();
        if(input) {
            input = textToByteString(input);
            retval += "F.input.tio\0" + input.length + "\0" + input + "\0";
        } else {
            retval += "F.input.tio\0" + "0\0";
        }
        retval += "Vargs\0" + self.args.length + "\0";
        iterate(self.args, function(arg) {
            retval += textToByteString(arg) + "\0"
        });

        retval += "R"
        return retval;
    }

    //--------------------------------------------------------------------------------------------------------
    self.load = function(force) {
        if(!force && session._languages) return;
        self.languageFileRequest = new XMLHttpRequest;
        function completeLoad() {
            session._languages = JSON.parse(self.languageFileRequest.response);
            session.languages = []

            for (var id in session._languages) {
                var language = session._languages[id];
                language.id = id;
                session.languages.push(language);
                if(session.longest_id_length < id.length) session.longest_id_length = id.length;
            }

            session.languages.sort(function(languageA, languageB) {
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
        self.languageFileRequest.open("GET", session.tioURL + session.langURL);
        self.languageFileRequest.send();
    }

    //--------------------------------------------------------------------------------------------------------
    self.run = function() {
        if (self.runRequest) {
            var quitRequest = new XMLHttpRequest;
            quitRequest.open("GET", session.tioURL + session.quitURL + "/" + self.token);
            self.onquit(quitRequest);
            quitRequest.send();
            return;
        }
        self.clear_messages();
        self.clear_results();
        self.token = getRandomBits(128);
        self.runRequest = new XMLHttpRequest;
        self.runRequest.open("POST", session.tioURL + session.runURL + getSettings(arguments) + self.token, true);
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
        var language = session._languages[self.languageId];
        var data = {
            "bytes": pluralization(countBytes(code, language.encoding), "byte"),
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
        self.runRequest.open("POST", session.tioURL + session.cacheURL, true);
        self.runRequest.responseType = "arraybuffer";
        self.runRequest.onreadystatechange = runRequestOnReadyState;
        sha256(deflate(stateToByteString()), self.runRequest.send.bind(self.runRequest));
    }

    //--------------------------------------------------------------------------------------------------------
    self.language = function(languageId) {
        if(languageId === undefined) { self.ongetlanguage(); return self.languageId }
        if(session._languages) {
            var language = session._languages[languageId];
            if(language.unmask) {
                iterate(language.unmask, function(data){ self[data] = [] });
            }
            self.languageId = language.id;
        } else {
            self.options = undefined;
            self.cflags = undefined;
            self.driver = undefined;
            self.languageId = languageId;
        }
        self.onsetlanguage();
    };

    //--------------------------------------------------------------------------------------------------------
    self.code = function(code) {
        if(code === undefined) { self.ongetcode(); return self._code }
        if (session.rUnpairedSurrogates.test(code))
            self.message("Error", "invalid Unicode: unpaired surrogates");
        if(session._languages) {
            var encoding = session._languages[self.languageId].encoding;
            self._characterCount = countBytes(code, "SBCS");
            self._byteCount = countBytes(code, encoding);
        }
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
    
this.tio = session();
this.tio.session = session;
session.find_languages = function(name) {
    name = name.toLowerCase();
    var result = [];
    if(session._languages)
        iterate(session.languages, function(language) {
            if(~language.name.toLowerCase().indexOf(name))
                result.push(language);
        });
    return result;
};
session.is_valid_id = function(languageId) {
    return !!(session._languages && session._languages[languageId])
}
session.longest_id_length = 0;

})();
