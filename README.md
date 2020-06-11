# [tio-lang](https://tkellehe.github.io/tio-lang/)

The __tio-lang__ is a language that calls to other programming languages that are available on [Try It Online](https://github.com/TryItOnline/tryitonline).

---
---

## tio.js

There is an API provided by __tio-lang__ that allows one to interface with the TIO servers. It is the main utility used in order
to provide the multi-language language. The following are the javascript files to include in order to get this API.

```
https://tkellehe.github.io/tio-lang/src/js/pako.js
https://tkellehe.github.io/tio-lang/src/js/tio.js
```

```javascript
tio.onload = function() {
    console.log("Number of languages: " + tio.session.languages.length);
    tio.language("python3");
    tio.code("import sys\nprint(sys.argv)");
    tio.args.push('-t');
    tio.onsetoutput = function() {
        console.log("Server output: " + tio.output());
    }
    tio.run();
};
tio.load();
```

### Hello, World!

```javascript
tio.language("jelly")
tio.code("“3ḅaė;œ»")
tio.oncomplete = function() {
    tio.alert(tio.output());
    tio.alert(tio.debug());
}
tio.run()
```

---
### `tio.session`

 > A global set of information used throughout all sessions created.

---
### `tio.session.languages`

 > The list of language JSON objects pulled from the TIO servers.
 
---
### `tio.session.find_languages(name)`

 > Takes in a name and attempts to find the closest matches to that while ignoring case. It then returns these as an array.
 
---
### `tio.session.is_valid_id(?language)`

 > Checks if the language identifier is valid.

---
### `tio.session()`

 > Create a new `Session` instance that can communicate and run code. Also, `tio` is a `Session` instance.
 
---
### `Session.messages`

 > An array of messages that have been sent out. The callback `onmessage` can be used to know when this changes.
 
---
### `Session.settings`

 > An array of settings for the TIO server.
 
---
### `Session.options`

 > An array of string options for the language to be sent to the TIO server.
 
---
### `Session.cflags`

 > An array of string cflags for the language to be sent to the TIO server.
 
---
### `Session.driver`

 > An array of string drivers for the language to be sent to the TIO server.
 
---
### `Session.args`

 > An array of string arguments for language to be sent to the TIO server.

---
### `Session.load(?force)`

 > Loads the languages from the TIO servers and populates the `tio.session` data. The callbacks `onload` can be used to be indicated
 > when the data is brought. If `force` is set to true, it will ensure another fetch is called to the TIO servers.
 
---
### `Session.message(title, message)`

 > Caches the message into the `Session.messages` array with a `Message` object.
 
---
### `Session.clear_messages()`

 > Clears all of the messages in the `Session.messages` array.
 
---
### `Session.clear_results()`

 > Clears both `output` and `debug` triggering callbacks `onsetoutput` and `onsetdebug`.
 
---
### `Session.clear_results()`

 > Clears both `output` and `debug` triggering callbacks `onsetoutput` and `onsetdebug`.
 
---
### `Session.markdown()`

 > Returns a markdown representation of the code.
 
---
### `Session.state()`

 > Get the message that encodes the current state of the `Session` instance that will be sent to the TIO servers.

---
### `Session.run(?arguments...)`

 > Packages up the code and options to be sent to the TIO servers.
 > The callbacks that can be used to access this: `onrun`, `onquit`, `on
 
---
### `Session.language(?language)`

 > Sets the language if an argument is provided, else it will return the current language stored.
 > The callbacks `onsetlanguage` and `ongetlanguage` get called based on the argument.
 > If the languages have been loaded, this will also add the properties
 > `options`, `cflags`, and `driver` based off of the umask information from the TIO servers.

---
### `Session.header(?header)`

 > Sets the header if an argument is provided, else it will return the current header stored.
 > The callbacks `onsetheader` and `ongetheader` get called based on the argument.

---
### `Session.code(?code)`

 > Sets the code if an argument is provided, else it will return the current code stored.
 > The callbacks `onsetcode` and `ongetcode` get called based on the argument.

---
### `Session.footer(?footer)`

 > Sets the footer if an argument is provided, else it will return the current footer stored.
 > The callbacks `onsetfooter` and `ongetfooter` get called based on the argument.

---
### `Session.input(?input)`

 > Sets the input if an argument is provided, else it will return the current input stored.
 > The callbacks `onsetinput` and `ongetinput` get called based on the argument.
 
---
### `Session.output(?output)`

 > Sets the output if an argument is provided, else it will return the current output stored.
 > The callbacks `onsetoutput` and `ongetoutput` get called based on the argument.
 
---
### `Session.debug(?debug)`

 > Sets the debug if an argument is provided, else it will return the current debug stored.
 > The callbacks `onsetdebug` and `ongetdebug` get called based on the argument.

---
---
---

<script src="src/js/pako.js"></script>
<script src="src/js/tio.js"></script>
