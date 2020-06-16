# [tio-lang](https://tkellehe.github.io/tio-lang/)

<div class="tio-favicon"/>

The __tio-lang__ is a language that calls to other programming languages that are available on [Try It Online](https://github.com/TryItOnline/tryitonline).

---
<div class="tio-code" tio-code="\2brainfuck\x83,+.python\x9Eimport time;time.sleep(int(I))jelly\x88“3ḅaė;œ»c\x84p(a)" tio-input="1">

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

# Basics

The __tio-lang__ starts by first reading the initial byte to determine how to interpret the rest of the program. The main three utilize the language identifiers
from the TIO servers. This list can be obtained through [_tio.js_](#tioutilslangauges). 

Once the language identifiers have been paired with the code, it will execute the code. Each ones output feeds as the input into the next one.

---

### `\0` zero byte

The first is the null character `\0` which will take the longest possible language identifier immediately following that byte. Then the rest of the code is assumed
to go with that language identifier and runs it.

<div class="tio-code" tio-code="\0valapublic static int main(string[]args){stdout.printf(\"Hello, World!\n\");return 0;}" tio-input="">

```
code:
\0valapublic static int main(string[]args){stdout.printf(\"Hello, World!\n\");return 0;}
>>>
Hello, World!
```

</div>


---

## ppcg.js

This is a simple JavaScript library that will execute __tio-lang__ code using [_tio.js_](#tiojs) and _parser.js_. Merely place different attribute names into a `<div>` tag
and it will fill everything out as well as remove any child nodes.

```
<div class="tio-code" tio-code='\0ada-gnatwith Ada.Text_IO;use Ada.Text_IO;procedure Main is begin Put_Line (\"Hello, World!\");end Main;' tio-input="" tio-runable="Try It Here!"></div>
```
<div class="tio-code" tio-code='\0ada-gnatwith Ada.Text_IO;use Ada.Text_IO;procedure Main is begin Put_Line (\"Hello, World!\");end Main;' tio-input="" tio-runable="Try It Here!"></div>

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
    console.log("Number of languages: " + tio.utils.languages.length);
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

 > Loads the languages from the TIO servers and populates the `tio.utils` data. The callback `onload` can be used to be indicated
 > when the data is brought. If `force` is set to true, it will ensure another fetch is called to the TIO servers.
 
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

 > Packages up the code and options to be sent to the TIO servers.
 > The callbacks that can be used to access this: `onrun`, `onquit`, `oncomplete`

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
<script src="src/js/ppcg.js"></script>
