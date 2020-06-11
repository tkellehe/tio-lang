# [tio-lang](https://tkellehe.github.io/tio-lang/)

The __tio-lang__ is a language that calls to other programming languages that are available on [Try It Online](https://github.com/TryItOnline/tryitonline).

---
---

## tio.js

There is an API provided by __tio-lang__ that allows one to interface with the TIO servers. It is the main utility used in order
to provide the multi-language language. The following are the javascript files to include in order to get this API.

```
https://raw.githubusercontent.com/tkellehe/tio-lang/master/src/js/pako.js
https://raw.githubusercontent.com/tkellehe/tio-lang/master/src/js/tio.js
```

```javascript
tio.onload = function() {
    console.log("Number of languages: " + tio.session.languages.length);
    tio.language("python3");
    tio.code("import sys\nprint(sys.argv)");
    tio.args.append('-t');
    tio.onsetoutput = function() {
        console.log("Server output: " + tio.output());
    }
    tio.run();
};
tio.load();
```

---
### `tio.session`

 > A global set of information used throughout all sessions created.

---
### `tio.session.languages`

 > The list of language JSON objects pulled from the TIO servers.

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

 > An array of string options for language to be sent to the TIO server.
 
---
### `Session.args`

 > An array of string arguments for language to be sent to the TIO server.

---
### `Session.load()`

 > Loads the languages from the TIO servers and populates the `tio.session` data. The callbacks `onload` can be used to be indicated
 > when the data is brought.
 
---
### `Session.message(title, message)`

 > Caches the message into the `Session.messages` array with a `Message` object.
 
---
### `Session.clear_messages()`

 > Clears all of the messages in the `Session.messages` array.

---
### `Session.run(?arguments...)`

 > Packages up the code and options to be sent to the TIO servers.
 > The callbacks that can be used to access this: `onrun`, `onquit`, `on
 
---
### `Session.language(?language)`

 > Sets the language if an argument is provided, else it will return the current language stored.
 > The callbacks `onsetlanguage` and `ongetlanguage` get called based on the argument.

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


