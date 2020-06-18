(function(){

function editor_handle_string_attribute(text) {
    return eval("(function(){ return \"" + text + "\";})()");
}
    
function editor_handle_attribute(text) {
    return eval("(function(){ return " + text + ";})()");
}

var nbs = String.fromCharCode(160),
    space = String.fromCharCode(32);
var nbsRemoveRegex = new RegExp(nbs,"g");
function nbsRemove(string) {
    if(!string) return "";
    return string.replace(nbsRemoveRegex, space);
};
var br = "<br>",
    lf = String.fromCharCode(10);
var brRemoveRegex = new RegExp(br,"g");
function brRemove(string) {
    if(!string) return "";
    return string.replace(brRemoveRegex, lf);
};

function textContent(element, value) {
    if(value !== undefined) {
        element.innerText = value;element.textContent = value;
    } else {
        var text = "";
        var nodes = element.childNodes;
        for(var i = nodes.length; i--;) {
            switch(nodes[i].nodeName) {
                case '#text'    : text = nodes[i].nodeValue + text;   break;
                case 'BR'       : text = '\n' + text;                 break;
            }
        }
        return text;
    }
}

var BUTTON_RUN_CHAR = "\u27A4",
    BUTTON_EDIT_CHAR = "\u2710";
    
function editor_create_element(html) {
    var type = html.getAttribute("tio-type") || "code";
    var runable_text = html.getAttribute("tio-runable");
    var is_runable = runable_text !== null,
        is_tio_js = html.getAttribute("tio-js") !== null;
    var is_animate = html.getAttribute("tio-animate") !== null;
    var is_animate_button = html.getAttribute("tio-animate-button") !== null;
    var has_debug = html.getAttribute("tio-debug") !== null;
    var cols = html.getAttribute("tio-cols"),
        rows = html.getAttribute("tio-rows");
    
    // Make it work with GitHub markdown.
    html.className += " language-plaintext highlighter-rouge";
    var o = document.createElement("div");
    o.className = "highlight";
    var p = document.createElement("pre");
    p.className = "highlight";
    var e = document.createElement(type);
    p.appendChild(e);
    o.appendChild(p);
    
    tio.utils.onlistener(o, "tio_done");
    tio.utils.onlistener(o, "tio_start");
    tio.utils.onlistener(o, "tio_reset");
    tio.utils.onlistener(o, "tio_run");
    tio.utils.onlistener(o, "tio_ready");

    // If it is runable, add a button to control when the output gets put in.
    var b = {innerText:BUTTON_RUN_CHAR};
    if(is_runable) {
        var b = document.createElement("button");
        
        if(runable_text === "{RUN}" || runable_text === "") {
            b.style.fontFamily = "monospace";
            b.style.backgroundColor = "white";
            b.style.color = "black";
            b.style.textDecoration = "none";
            b.style.display = "inline-block";
            b.style.fontSize = "0.9em";
            b.style.borderRadius = "5%";
            b.style.border = "1px solid #000";
            b.style.width = "2.1em";
            b.style.height = "2.1em";
            
            b.innerText = BUTTON_RUN_CHAR;
        } else {
            b.innerText = runable_text;
            b.style.width = "100%"
            b.style.fontFamily = "monospace";
            b.style.outline = "none";
            b.style.color = "white";
            b.style.backgroundColor = "black";
        }

        o.appendChild(b);

        b.onclick = function() {
            o.tio_reset();
            o.tio_run();
        }
    } else {
        o.tio_ready.add(function() {
            o.tio_reset();
            o.tio_run();
        });
    }

    if(type === "textarea") {
        o.tio_val = function(content) {
            if(content === undefined) return e.value;
            e.value = content;
            e.scrollTop = e.scrollHeight;
        }
    } else if(type === "code") {
        o.tio_val = function(content) {
            return textContent(e, content);
        }
    }

    if(is_animate || is_animate_button) {
        var tio_animate_is_done = false;
        var tio_animate_frame = 0;
        var tio_animate_frames = [
            "/", "/", "/", "/", "/", "/", "/", "/", "/", "/",
            "-", "-", "-", "-", "-", "-", "-", "-", "-", "-",
            "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\",
            "|", "|", "|", "|", "|", "|", "|", "|", "|", "|"
        ]
        var tio_animate_frame_pos = -1;
        var tio_animate_button_cache = ""
        o.tio_start.add(function() {
            tio_animate_button_cache = b.innerText;
            tio_animate_is_done = false;
            tio_animate_frame_pos = -1;
            (function animate() {
                var current = o.tio_val();
                if(tio_animate_frame_pos !== -1 && is_animate) {
                    current = tio.utils.string_splice(current, tio_animate_frame_pos, tio_animate_frames[tio_animate_frame].length, "");
                }

                if(tio_animate_is_done) {
                    if(is_animate) o.tio_val(current);
                    if(is_animate_button) b.innerText = tio_animate_button_cache;
                } else {
                    tio_animate_frame = (tio_animate_frame + 1) % tio_animate_frames.length;
                    tio_animate_frame_pos = current.length;
                    if(is_animate) o.tio_val(current + tio_animate_frames[tio_animate_frame]);
                    if(is_animate_button) b.innerText = tio_animate_frames[tio_animate_frame];
                    setTimeout(animate, 10);
                }
            })()
        });
        o.tio_done.add(function() {
            tio_animate_is_done = true;
        });
    }

    o.tio_debug = function(output) {
        if(output === undefined) return ""
    }

    o.tio_js = !!is_tio_js;
    o.tio_type = type;
    o.tio_runable = !!is_runable;
    o.tio_animate = !!is_animate;
    o.tio_animate_button = !!is_animate_button;

    // Get the code and input then clean out any bad elements.
    o.tio_input = nbsRemove(html.getAttribute("tio-input") || "");
    o.tio_code = nbsRemove(html.getAttribute("tio-code") || "");
    o.tio_display_code = html.getAttribute("tio-display-code");
    o.tio_display_code = o.tio_display_code ? editor_handle_string_attribute(o.tio_display_code) : o.tio_code;
    
    o.tio_language = nbsRemove(html.getAttribute("tio-language") || "python3");
    o.tio_header = nbsRemove(html.getAttribute("tio-header") || "");
    o.tio_footer = nbsRemove(html.getAttribute("tio-footer") || "");
    o.tio_options = nbsRemove(html.getAttribute("tio-options") || "[]");
    o.tio_drivers = nbsRemove(html.getAttribute("tio-drivers") || "[]");
    o.tio_args = nbsRemove(html.getAttribute("tio-args") || "[]");

    // Handle the columns and rows.
    if(cols) {
        e.cols = cols;
    } else {
        e.style.width = "100%"
    }
    if(rows) {
        e.rows = rows;
    } else {
        e.style.height = "5em"
    }

    // Style the textarea if that is what is requested.
    if(type === "textarea") {
        e["box-sizing"] = "border-box";         /* For IE and modern versions of Chrome */
        e["-moz-box-sizing"] = "border-box";    /* For Firefox                          */
        e["-webkit-box-sizing"] = "border-box"; /* For Safari                           */     
        e.style.resize = "vertical";
        e.style.fontFamily = "monospace";
        e.style.outline = "none";
        e.style.color = "white";
        e.style.backgroundColor = "black";
        e.style.overflow = "auto";
    }
    return o;
} 

function onload() {
    var head = document.getElementsByTagName("head")[0];
    var favicons = document.getElementsByClassName("tio-favicon");

    tio.utils.iterate(favicons, function(favicon) {
        var image = favicon.getAttribute("tio-image") || "tio.png";
        var link = document.createElement('link');
        link.rel = "icon";
        link.type = "image/png";
        link.href = image;
        head.appendChild(link);
    });

    var output_div_elements = document.getElementsByClassName("tio-code");

    for(var i = output_div_elements.length; i--;) {
        (function(html, elem){
            if(elem.tio_js) {
                (function(session) {
                    elem.tio_reset.add(function() {
                        session.language(elem.tio_language);
                        var language = session.language();
                        if(session.utils._languages) {
                            language = session.utils._languages[language];
                            language = language ? language.name : session.language();
                        }
                        session.code(editor_handle_string_attribute(elem.tio_code));
                        var bytes = session.byte_count();
                        elem.tio_val(
                            ("language: " + language + "\n") +
                            (bytes === undefined ? "" : ("bytes: " + bytes + "\n")) +
                            (elem.tio_input && ("input:\n" + elem.tio_input + "\n")) +
                            "code:\n" + elem.tio_display_code +
                            "\n>>>\n"
                        );                
                    })
                    elem.tio_reset();
                    session.oncomplete.add(function() {
                        elem.tio_val(elem.tio_val() + session.output());
                        elem.tio_debug(session.debug());
                        elem.tio_done();
                    });
                    elem.tio_run.add(function() {
                        session.onload.add(function() {
                            session.language(elem.tio_language);
                            session.input(editor_handle_string_attribute(elem.tio_input));
                            session.header(editor_handle_string_attribute(elem.tio_header));
                            session.code(editor_handle_string_attribute(elem.tio_code));
                            session.footer(editor_handle_string_attribute(elem.tio_footer));
                            if(elem.tio_options) session.options = editor_handle_attribute(elem.tio_options)
                            if(elem.tio_drivers) session.drivers = editor_handle_attribute(elem.tio_drivers)
                            if(elem.tio_args) session.args = editor_handle_attribute(elem.tio_args)
                            
                            session.run()
                        });
                        elem.tio_start()
                        session.load(true);
                    });
                    elem.tio_ready();
                })(tio.utils.session());
            } else {
                (function(prgm) {
                    elem.tio_reset.add(function() {
                        elem.tio_val(
                            (elem.tio_input && ("input:\n" + elem.tio_input + "\n")) +
                            "code:\n" + elem.tio_display_code +
                            "\n>>>\n"
                        );                
                    })
                    elem.tio_reset();
                    prgm.oncomplete.add(function() {
                        elem.tio_val(elem.tio_val() + prgm.output());
                        elem.tio_debug(prgm.debug());
                        elem.tio_done();
                    });
                    prgm.onerror.add(function() {
                        var result = "";
                        tio.utils.iterate(prgm.TIO.messages, function(message){
                            result += message.title + "(" + message.category + ")\n" + message.message + "\n\n";
                        });
                        elem.tio_val(result);
                        elem.tio_debug(prgm.debug());
                        elem.tio_done();
                    });
                    elem.tio_run.add(function() {
                        prgm.code = editor_handle_string_attribute(elem.tio_code)
                        prgm.input = editor_handle_string_attribute(elem.tio_input)
                        
                        elem.tio_start()
                        prgm.run()
                    });
                    elem.tio_ready();
                })(tio_lang());
            }

            // Remove all children nodes and add the node containing the live code.
            html.innerHTML = "";
            html.appendChild(elem);
        })(output_div_elements[i], editor_create_element(output_div_elements[i]));
    }
}

document.addEventListener("DOMContentLoaded", onload);

})()
