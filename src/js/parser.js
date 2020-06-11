(function(){

//************************************************************************************************************
function tio_session_c(id, code, input) {
    tio.language(id === "c" ? "c-gcc" : id);
    tio.code(""
    +"#include <stdio.h>"
    +"#define p(...) printf(__VA_ARGS__)"
    +"#define I int"
    +"#define C char*"
    +"#define a v[0]"
    +"#define a0 v[0]"
    +"#define a1 v[1]"
    +"#define a2 v[2]"
    +"int main(int c, char** v){"
    +code
    "return 0;}");
    tio.args.push(input);
}

//************************************************************************************************************
function default_tio_session(id, code, input) {
    tio.language(id);
    tio.code(code);
    tio.input(input);
}

//************************************************************************************************************
var tio_sessions = {
    "c-tcc" : tio_session_c,
    "c-gcc" : tio_session_c,
    "c-clang" : tio_session_c,
    "c" : tio_session_c
}

//************************************************************************************************************
function get_tio_session(id) {
    var tio_session = tio_sessions[id];
    if(tio_session) return tio_session;
    if(tio.session.is_valid_id(id)) return default_tio_session;
}

//************************************************************************************************************
function Session(id, code, tio_session) {
    this.id = id;
    this.code = code;
    this.input = "";
    this.tio_session = tio_session;
    this.fill = function() {
        this.tio_session(this.id, this.code, this.input);
    }
}

//************************************************************************************************************
this.tio_lang = function(code, input, oncomplete) {
    var sessions = [];
    // Basic processing:
    if(code[0] === "\0") {
        
    }
    
    // Now execute all of the sessions that were found.
    var i = 0;
    if(sessions.length) {
        function execute() {
            if(input === undefined) input = tio.output();
            if(i < sessions.length) {
                sessions.input = input;
                sessions[i++].fill();
                input = undefined;
                tio.run();
            }
        }
        tio.oncomplete = execute;
        execute();
    } else {
        tio.clear_results();
        oncomplete();
    }
}

})();
