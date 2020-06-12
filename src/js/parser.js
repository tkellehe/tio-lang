(function(){

//************************************************************************************************************
this.tio_lang = function(code, input){ return new Parser(code, input); }
function Parser(code, input) {
    var TIO = tio.utils.session();
    var tio_lang_self = this;
    tio_lang_self.code = code || "";
    tio_lang_self.input = input || "";
    tio_lang_self.TIO = TIO;
    tio_lang_self.oncomplete = function() {}
    tio_lang_self.output = function() { return TIO.output(); }
    tio_lang_self.debug = function() { return tio_lang_self.debug_result; }

    //********************************************************************************************************
    function tio_info_c(id, code, input) {
        TIO.language(id === "c" ? "c-gcc" : id);
        TIO.header(""
        +"#include <stdio.h>\n"
        +"#define p(...) printf(__VA_ARGS__)\n"
        +"#define I int\n"
        +"#define C char*\n"
        +"#define a v[1]\n"
        +"#define a0 v[0]\n"
        +"#define a1 v[1]\n"
        +"#define a2 v[2]\n"
        +"int main(int c, char** v){")
        TIO.code(code)
        TIO.footer(";\nreturn 0;}");
        TIO.args.push(input);
    }

    //********************************************************************************************************
    function tio_info_python(id, code, input) {
        TIO.language(id === "python" ? "python3" : id);
        TIO.header(""
        +"import sys\n"
        +"I = sys.stdin.read()\n"
        +"p = print\n")
        TIO.code(code)
        TIO.footer("");
        TIO.input(input);
    }

    //********************************************************************************************************
    function default_tio_info(id, code, input) {
        TIO.language(id);
        TIO.header("");
        TIO.code(code);
        TIO.footer("");
        TIO.input(input);
    }

    //********************************************************************************************************
    var tio_infos = {
        "c-tcc" : tio_info_c,
        "c-gcc" : tio_info_c,
        "c-clang" : tio_info_c,
        "c" : tio_info_c,
        "python" : tio_info_python,
        "python3" : tio_info_python,
    }

    //********************************************************************************************************
    function is_valid_id(id) {
        return TIO.utils.is_valid_id(id) || tio_infos[id];
    }

    //********************************************************************************************************
    function get_tio_info(id) {
        var tio_info = tio_infos[id];
        if(tio_info) return tio_info;
        if(TIO.utils.is_valid_id(id)) return default_tio_info;
    }

    //********************************************************************************************************
    function Block(id, code, tio_info) {
        TIO.message("Block", id + " -> " + code, "debug")
        this.id = id;
        this.code = code;
        this.input = "";
        this.tio_info = tio_info;
        this.fill = function() {
            this.tio_info(this.id, this.code, this.input);
        }
    }

    //********************************************************************************************************
    function extract_language_id_basic(code) {
        var last_valid_id = ""
        var current_id = "";
        TIO.message("Extract", "code " + code, "debug");
        for(var i = 0; i < code.length; ++i) {
            if(i > TIO.utils.longest_id_length)
                break;
            current_id = code.slice(0, i);
            if(is_valid_id(current_id)) {
                last_valid_id = current_id;
            }
            TIO.message("Extract", current_id + ", " + last_valid_id, "debug");
        }
        var temp = last_valid_id;
        code = code.slice(last_valid_id.length);
        var byte = code.charCodeAt(0);
        TIO.message("Extract", "byte " + byte, "debug");
        if(byte & 0x80) {
            var length = byte & 0x7F; 
        } else {
            last_valid_id = "";
        }
        TIO.message("Extract", "length " + length, "debug");
        if(!last_valid_id)
            throw Error("Cound not find language identifier!");
        code = code.slice(1)
        var session_code = code.slice(0, length);
        TIO.message("Extract", "session code " + session_code, "debug");
        return {"code":code.slice(session_code.length), "id":last_valid_id, "session_code": session_code, "length":length}
    }

    //********************************************************************************************************
    tio_lang_self.run = function() {
        TIO.clear();
        TIO.onload = function() {
            var code = tio_lang_self.code || "";
            var input = tio_lang_self.input || "";
            tio_lang_self.sessions = [];
            // Basic processing:
            if(code[0] === "\0") {
                code = code.slice(1);
                while(code.length) {
                    result = extract_language_id_basic(code);
                    tio_lang_self.sessions.push(new Block(result.id, result.session_code, get_tio_info(result.id)));
                    code = result.code;
                }
            }
            
            // Now execute all of the sessions that were found.
            var i = 0;
            tio_lang_self.debug_result = "";

            if(tio_lang_self.sessions.length) {
                function execute() {
                    if(input === undefined) input = TIO.output();
                    if(i < tio_lang_self.sessions.length) {
                        TIO.clear_state();
                        tio_lang_self.sessions[i].input = input;
                        tio_lang_self.sessions[i++].fill();
                        TIO.message("Execute", "lang[" + (i-1) + "] " + TIO.language() + "(" + TIO.state() + ")", "debug")
                        input = undefined;
                        TIO.run();
                    } else {
                        tio_lang_self.oncomplete();
                    }
                }
                TIO.oncomplete = execute;
                TIO.onsetdebug = function() {
                    if(TIO.language() && TIO.debug())
                        tio_lang_self.debug_result += "--------------------------------\n" + TIO.language() + "\n--------------------------------\n" + TIO.debug() + "\n";
                }
                execute();
            } else {
                tio_lang_self.oncomplete();
            }
        }
        TIO.load(true);
    }
}


})();