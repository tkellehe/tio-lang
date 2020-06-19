# [tio-lang](https://tkellehe.github.io/tio-lang/)

<div class="tio-favicon"/>

The __tio-lang__ is a language that calls to other programming languages that are available on [Try It Online](https://github.com/TryItOnline/tryitonline).

---
<div class="tio-code" tio-code="\2brainfuck\x83,+.python\x9Eimport time;time.sleep(int(I))jelly\x88“3ḅaė;œ»c\x84p(a)" tio-input="1" tio-animate>

```
input:
1
code:
\2brainfuck\x83,+.python\x9Eimport time;time.sleep(int(I))jelly\x88“3ḅaė;œ»c\x84p(a)
>>>
Hello, World!
```

</div>

---

# Release

The current version available is [1.0](https://tkellehe.github.io/tio-lang/release/tio_lang-1.0js). This version still does not have an editor for the __tio-lang__ itself.
But, __tio-lang__ can be ran easily with a local HTML file and the released code. It also can be embedded into web-pages like here. Probably the more interesting feature
of this release is [_editor.js_](#editorjs). This allows one to embed a small editor that communicates to the TIO server for any language not just __tio-lang__.

```html
<div class="tio-code" tio-language="c-gcc" tio-header="#include <stdio.h>\nint main() {\n" tio-code='printf("Hello, World!\\n")' tio-footer=";return 0;}" tio-hide-header tio-hide-footer tio-js tio-editable tio-runable tio-debug tio-animate-button></div>
```

<div class="tio-code" tio-language="c-gcc" tio-header="#include <stdio.h>\nint main() {\n" tio-code='printf("Hello, World!\\n")' tio-footer=";return 0;}" tio-hide-header tio-hide-footer tio-js tio-editable tio-runable tio-debug tio-animate-button></div>

---

# Basics

The __tio-lang__ starts by first reading the initial byte to determine how to interpret the rest of the program. The main three utilize the language identifiers
from the TIO servers. This list can be obtained through [_tio.js_](#tioutilslangauges) and if on the website [here](#appendix).

Once the language identifiers have been paired with the code, it will execute the code. Each ones output feeds as the input into the next one.

---

### `\0` zero byte

The first is the null character `\0` which will take the longest possible language identifier immediately following that byte. Then the rest of the code is assumed
to go with that language identifier and runs it.

<div class="tio-code" tio-code='\0valapublic static int main(string[]args){stdout.printf("Hello, World!\n");return 0;}' tio-input="" tio-runable="Try It Here!" tio-animate>

```
code:
\0valapublic static int main(string[]args){stdout.printf("Hello, World!\n");return 0;}
>>>
Hello, World!
```

</div>

---
---

## editor.js

This is a simple JavaScript library that will execute __tio-lang__ code using [_tio.js_](#tiojs) and _parser.js_. Merely place different attribute names into a `<div>` tag
and it will fill everything out as well as remove any child nodes. The class `tio-code` is required for it to find the `<div>` tag. The function `tio_find_editors` can be
called for it to search the DOM and process these elements. The function `tio_apply_editor` can be called while providing an HTML element with the appropriate attributes set
and it will properly generate the HTML content for the editor in said element.

```html
<div class="tio-code" tio-code='\0ada-gnatwith Ada.Text_IO;use Ada.Text_IO;procedure Main is begin Put_Line ("Yeah!");end Main;' tio-input="" tio-runable="I'm a goofy goober!" tio-animate-button></div>
```
<div class="tio-code" tio-code='\0ada-gnatwith Ada.Text_IO;use Ada.Text_IO;procedure Main is begin Put_Line ("Yeah!");end Main;' tio-input="" tio-runable="I'm a goofy goober!" tio-animate-button></div>

---

#### `attribute tio-code`

 > Sets the __tio-lang__ code to be executed.

#### `attribute ?tio-input`

 > Sets the input into the __tio-lang__ program to be executed.

#### `attribute ?tio-type`

 > Sets the type of HTML to be generated. The default is current "code" and the only type that has been tested.

#### `attribute ?tio-debug`

 > If provided, it will add the debug output from the TIO servers to the end of the output.

#### `attribute ?tio-runable`

 > Adds a button to the HTML elements that will execute the code. If not provided, the code will begin executing immediately.
 > The text of button is set to the value provided where the default is `{RUN}`. If the value is `{RUN}` then it will generate
 > the button as a small circle.

#### `attribute ?tio-animate`

 > A small animation sequence will be added while the program is executing. If not set, there will be no animation added to the code.

#### `attribute ?tio-animate-button`

 > A small animation sequence will be added while the program is running for the button. If not set, there will be no animation.

#### `attribute ?tio-js`

 > If provided, the editor created will not run __tio-lang__. Instead, it will execute a normal [_tio.js_](#tiojs) session.

```html
<div tio-language="python3" class="tio-code" tio-code='print(":)", sys.argv, sys.stdin.read())' tio-header="import sys;import time;time.sleep(2)" tio-footer="" tio-input="" tio-args="" tio-runable tio-animate-button tio-js tio-editable tio-debug></div>
```

<div tio-language="python3" class="tio-code" tio-code='print(":)", sys.argv, sys.stdin.read())' tio-header="import sys;import time;time.sleep(2)" tio-footer="" tio-input="" tio-args="" tio-runable tio-animate-button tio-js tio-editable tio-debug></div>

#### `attribute ?tio-editable`

 > Makes all fields editable if [`tio-js`](#attribute-tiojs) and [`tio-runable`](#attribute-tiorunable) are provided.

#### `attribute ?tio-header`

 > Sets the header code for the session if [`tio-js`](#attribute-tiojs) is provided.

#### `attribute ?tio-footer`

 > Sets the footer code for the session if [`tio-js`](#attribute-tiojs) is provided.
 
#### `attribute ?tio-args`

 > Sets the args list for the session if [`tio-js`](#attribute-tiojs) is provided. This must be a _JavaScript Array_ like object.
 
#### `attribute ?tio-options`

 > Sets the options list for the session if [`tio-js`](#attribute-tiojs) is provided. This must be a _JavaScript Array_ like object.
 
#### `attribute ?tio-drivers`

 > Sets the drivers list for the session if [`tio-js`](#attribute-tiojs) is provided. This must be a _JavaScript Array_ like object.
 
#### `attribute ?tio-language`

 > Sets the language for the session if [`tio-js`](#attribute-tiojs) is provided. This must be a [language identifier](#appendix).
 > Once it has been confirmed to be a valid language id, it will change to printing the language name.

#### `attribute ?tio-hide-input`

 > Allows the [`tio-input`](#attribute-tioinput) to still be parsed, but it will not be displayed.

#### `attribute ?tio-hide-header`

 > Allows the [`tio-header`](#attribute-tioheader) to still be parsed, but it will not be displayed.

#### `attribute ?tio-hide-footer`

 > Allows the [`tio-footer`](#attribute-tiofooter) to still be parsed, but it will not be displayed.
 
#### `attribute ?tio-hide-args`

 > Allows the [`tio-args`](#attribute-tioargs) to still be parsed, but it will not be displayed.
 
#### `attribute ?tio-hide-options`

 > Allows the [`tio-options`](#attribute-tiooptions) to still be parsed, but it will not be displayed.
 
#### `attribute ?tio-hide-drivers`

 > Allows the [`tio-drivers`](#attribute-tiodrivers) to still be parsed, but it will not be displayed.
 
#### `attribute ?tio-hide-language`

 > Allows the [`tio-language`](#attribute-tiolanguage) to still be parsed, but it will not be displayed.
 
#### `attribute ?tio-hide-bytes`

 > Prevents the `[bytes]` from being displayed.
 
#### `attribute ?tio-hide-chars`

 > Prevents the `[chars]` from being displayed.

---
---

## tio.js

There is an API provided by __tio-lang__ that allows one to interface with the TIO servers. It is the main utility used in order
to provide the multi-language language. The following are the javascript files to include in order to get this API.

```
https://tkellehe.github.io/tio-lang/src/js/pako.js
https://tkellehe.github.io/tio-lang/src/js/tio.js
```

For more info on these dependencies:

 * [https://github.com/nodeca/pako](https://github.com/nodeca/pako)

### Example

```javascript
tio.onload.add(function() {
    console.log("Number of languages: " + tio.utils.languages.length);
    tio.language("python3");
    tio.code("import sys\nprint(sys.argv)");
    tio.args.push('-t');
    tio.onsetoutput.add(function() {
        console.log("Server output: " + tio.output());
    });
    tio.run();
});
tio.load();
```

### Hello, World!

```javascript
tio.language("jelly")
tio.code("“3ḅaė;œ»")
tio.oncomplete.add(function() {
    tio.alert(tio.output());
    tio.alert(tio.debug());
});
tio.run()
```

---
### `tio.utils`

 > A global set of information used throughout all `Session` instances created.

---
### `tio.utils.languages`

 > The list of language JSON objects pulled from the TIO servers.
 
---
### `tio.utils.find_languages(name)`

 > Takes in a name and attempts to find the closest matches to that while ignoring case. It then returns these as an array.
 
---
### `tio.utils.is_valid_id(?language)`

 > Checks if the language identifier is valid.

---
### `tio.utils.encode_utf8(string)`

 > Encodes a string into a byte string.

---
### `tio.utils.decode_utf8(byte_string)`

 > Decodes a byte string into a string.

---
### `tio.utils.deflate(byte_string)`

 > Compress byte string in order to send to the TIO servers.

---
### `tio.utils.inflate(byte_array)`

 > Decompress byte array from TIO servers.

---
### `tio.utils.count_bytes(code, encoring)`

 > Counts the bytes based on the encoding provided.
 > The different options are: `SBCS`, `UTF-8`, `nibbles`, `xxd`

---
### `tio.utils.count_characters(code)`

 > Count the number of characters in the code which is the same as
 > `tio.utils.count_bytes(code, "SBCS")`.

---
### `tio.utils.onlistener(eventHandler, ?event, ?eventType)`

 > Takes the `eventHandler` object provided and adds the functions `addEventListener` and `removeEventListener`.
 > These functions can take in an event already added, and either add a function or remove a function. Note that the name
 > utilize for the event will have the prefix `"on"` added. Also, `addEventListener` can be provided an additional argument
 > that if provided `false` will remove added function after is has be activated once for that event. If the `event` name is provided,
 > it will add an extra attribute to the `eventHandler` as the string value provided. This new attribute is the event function
 > that when invoked, will take the optional `event_instance` and pass it to all of the functions that have been added. This function also
 > has the attributes `add` and `remove` which work the same as `addEventListener` and `removeEventListener` except that it defaults the
 > the event name to be this attributes name.
 > 
 > The function also returns an object created with the appropriate attributes added with an extra of `onevent` that will immediately
 > invoke the event. It also has an attribute of `eventType` set to auto-generated `eventType` or the one provided.
 > 
 > The `eventType` can be provided which will be auto-generated if not provided. This is used to construct the `event_instance` passed
 > to all of the event functions registered. The default auto-generated function caches all arguments provided upon construction into
 > the `args` attribute of the instance.

```javascript
var obj = {};
tio.utils.onlistener(obj, "myevent");
function f(e){console.log(e)}
obj.myevent.add(f);
obj.myevent();
obj.myevent.remove(f);
```

---
### `tio.utils.session()`

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

 > Loads the languages from the TIO servers and populates the `tio.utils` data. The callback `onload` can be used to be notified
 > when the data is brought in. If `force` is set to true, it will call the callback if the data is there else it will behave normally.
 > Rather that the `force` ensure another fetch is called to the TIO servers, this was done because that can become quite expensive.
 > Therein, [`fetch`](#sessionfetch) was added to ensure another fetch to the TIO servers.

---
### `Session.fetch()`

 > Forces a fetch to the TIO servers and populates the `tio.utils` data. The callback `onload` can be used to be notified
 > when the data is brought in.

---
### `Session.message(title, message)`

 > Caches the message into the `Session.messages` array with a `Message` object.
  
---
### `Session.clear()`

 > Invoke all clear functions for `Session` instance.
 
---
### `Session.clear_messages()`

 > Clears all of the messages in the `Session.messages` array.
 
---
### `Session.clear_results()`

 > Clears both `Session.output` and `Session.debug` triggering callbacks `onsetoutput` and `onsetdebug`.
 
---
### `Session.clear_state()`

 > Clears all input related information which includes `Session.options`, `Session.args`, `Session.cflags`, `Session.driver`, and invokes callback `onsetinput`.
 
---
### `Session.markdown()`

 > Returns a markdown representation of the code.
 
---
### `Session.state()`

 > Get the message that encodes the current state of the `Session` instance that will be sent to the TIO servers.

---
### `Session.run(?arguments...)`

 > Packages up the code and options to be sent to the TIO servers. If invoked again, it will cancel the previous run and start a new one.
 > The callbacks that can be used to access this: `onrun`, `oncancel`, `oncomplete`

---
### `Session.cancel()`

 > Cancels a previous request made to the TIO servers to execute some code. Will invoke the callback `oncancel` if cancellation occurred.

---
### `Session.byte_count()`

 > Counts the number of bytes in `Session.code()` based on the selected language.

---
### `Session.character_count()`

 > Counts the number of characters in the `Session.code()`.

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
<script src="src/js/parser.js"></script>
<script src="src/js/editor.js"></script>

## Appendix

<div id="languages" class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>Languages:</code></pre></div></div>
<script>
    (function(){
        var languages = document.getElementById("languages");
        tio.onload.add(function(){
            var code = languages.childNodes[0].childNodes[0].childNodes[0];
            var result = "Languages:";
            for(var i = 0; i < tio.utils.languages.length; ++i) {
                result = result + "\n[" + i + "] " + tio.utils.languages[i].name + " -> " + tio.utils.languages[i].id
            };
            code.innerText = result;
            code.textContent = result;
        });
        tio.load(true);
   })();
</script>
