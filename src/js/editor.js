(function(){

function editor_handle_string_attribute(text) {
    return eval("(function(){ return \"" + text.replace(/"/g, '\\"').replace(/\n/g, '\\n') + "\";})()");
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

// Get the textContent safely to not lose line-feeds.
function textContent(element, value) {
    if(value !== undefined) {
        element.innerText = value;
        //element.textContent = value;
    } else {
        var text = "";
        var nodes = element.childNodes;
        if(nodes !== undefined) {
            for(var i = nodes.length; i--;) {
                switch(nodes[i].nodeName) {
                    case '#text'    : text = nodes[i].nodeValue + text;   break;
                    case 'BR'       : text = '\n' + text;                 break;
                }
            }
        } else if(element.textContent !== undefined) {
            text = element.textContent;
        } else if(element.innerText !== undefined) {
            text = element.innerText;
        }
        return text;
    }
}

// Unicode characters for the buttons.
var BUTTON_RUN_CHAR = "\u27A4",
    BUTTON_EDIT_CHAR = "\u2710";
    
function editor_create_element(html) {
    var type = html.getAttribute("tio-type") || "code",
        runable_text = html.getAttribute("tio-runable"),
        is_runable = runable_text !== null,
        editable_text = html.getAttribute("tio-editable"),
        is_editable = editable_text !== null,
        is_tio_js = html.getAttribute("tio-js") !== null,
        is_animate = html.getAttribute("tio-animate") !== null,
        is_animate_button = html.getAttribute("tio-animate-button") !== null,
        has_debug = html.getAttribute("tio-debug") !== null,
        has_input = html.getAttribute("tio-input") !== null,
        has_header = html.getAttribute("tio-header") !== null,
        has_footer = html.getAttribute("tio-footer") !== null,
        has_args = html.getAttribute("tio-args") !== null,
        has_options = html.getAttribute("tio-options") !== null,
        has_drivers = html.getAttribute("tio-drivers") !== null;
    
    // Make it work with GitHub markdown.
    html.className += " language-plaintext highlighter-rouge";
    
    var o = document.createElement("div");
    var p = document.createElement("pre");
    var e = document.createElement(type);

    o.className = "highlight";
    p.className = "highlight";
    p.appendChild(e);
    o.appendChild(p);
    
    // Add all of the event listeners.
    tio.utils.onlistener(o, "tio_done");
    tio.utils.onlistener(o, "tio_cancel");
    tio.utils.onlistener(o, "tio_start");
    tio.utils.onlistener(o, "tio_reset");
    tio.utils.onlistener(o, "tio_run");
    tio.utils.onlistener(o, "tio_ready");

    // Add some event functions to control the running flag.
    o.tio_run.add(function(){
        o.tio_is_running = true;
    });
    o.tio_done.add(function(){
        o.tio_is_running = false;
    });

    // If it is runable, add a button to control when the output gets put in.
    var b = {innerText:BUTTON_RUN_CHAR};
    if(is_runable) {
        var b = document.createElement("button");
        
        // Style the button based on the text.
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
            b.style.margin = "auto auto";
            b.style.padding = "0px";
            b.style.textAlign = "center";
            
            textContent(b, BUTTON_RUN_CHAR);
        } else {
            textContent(b, runable_text);

            b.style.width = "100%"
            b.style.fontFamily = "monospace";
            b.style.outline = "none";
            b.style.color = "white";
            b.style.backgroundColor = "black";
        }

        // Add the button and set the onlick function to control running and cancellation.
        o.appendChild(b);

        b.onclick = function() {
            if(o.tio_is_running) {
                o.tio_cancel();
            } else {
                o.tio_reset();
                o.tio_run();
            }
        }
    } else {
        o.tio_ready.add(function() {
            o.tio_reset();
            o.tio_run();
        });
    }

    // Make it editable.
    if(is_editable && is_tio_js) {
        var ei = document.createElement(type),
            eh = document.createElement(type),
            ec = document.createElement(type),
            ef = document.createElement(type),
            ea = document.createElement(type),
            ed = document.createElement(type),
            eo = document.createElement(type);

        ei.contentEditable = "true";
        ei.style.outline = "0px solid transparent";
        ei.style.width = "100%";
        // ei.style.display = "inline-block";
        eh.contentEditable = "true";
        eh.style.outline = "0px solid transparent";
        eh.style.width = "100%";
        // eh.style.display = "inline-block";
        ec.contentEditable = "true";
        ec.style.outline = "0px solid transparent";
        ec.style.width = "100%";
        // ec.style.display = "inline-block";
        ef.contentEditable = "true";
        ef.style.outline = "0px solid transparent";
        ef.style.width = "100%";
        // ef.style.display = "inline-block";
        ea.contentEditable = "true";
        ea.style.outline = "0px solid transparent";
        ea.style.width = "100%";
        // ea.style.display = "inline-block";
        ed.contentEditable = "true";
        ed.style.outline = "0px solid transparent";
        ed.style.width = "100%";
        // ed.style.display = "inline-block";
        eo.contentEditable = "true";
        eo.style.outline = "0px solid transparent";
        eo.style.width = "100%";

        // eo.style.display = "inline-block";

        // var pei = document.createElement("pre"),
        //     peh = document.createElement("pre"),
        //     pec = document.createElement("pre"),
        //     pef = document.createElement("pre"),
        //     pea = document.createElement("pre"),
        //     ped = document.createElement("pre"),
        //     peo = document.createElement("pre");
        // pei.className = "highlight";
        // peh.className = "highlight";
        // pec.className = "highlight";
        // pef.className = "highlight";
        // pea.className = "highlight";
        // ped.className = "highlight";
        // peo.className = "highlight";
        var dei = document.createElement("div"),
            deh = document.createElement("div"),
            dec = document.createElement("div"),
            def = document.createElement("div"),
            dea = document.createElement("div"),
            ded = document.createElement("div"),
            deo = document.createElement("div");
        dei.style.margin = "0.7em 0px";
        deh.style.margin = "0.7em 0px";
        dec.style.margin = "0.7em 0px";
        def.style.margin = "0.7em 0px";
        dea.style.margin = "0.7em 0px";
        ded.style.margin = "0.7em 0px";
        deo.style.margin = "0.7em 0px";

        // Add the logic for the footer.
        if(has_footer) {
            // pef.appendChild(ef);
            // o.prepend(pef);
            def.appendChild(ef);
            p.prepend(def);
            // p.prepend(ef);
            o.tio_footer = function(content) {
                if(content !== undefined) content = "[footer]\n" + (content || "\n");
                var result = nbsRemove(textContent(ef, content));
                if(result !== undefined) {
                    return result.replace("\n[footer]\n", '');
                }
            }
        }
        // Add the logic for the code.
            // var tio_code_prefix = ((has_drivers || has_options || has_args || has_input || has_header) ? "\n" : "") + "[code]\n"
            var tio_code_prefix = "[code]\n"
            // pec.appendChild(ec);
            // o.prepend(pec);
            dec.appendChild(ec);
            p.prepend(dec);
            // p.prepend(ec);
            o.tio_code = function(content) {
                if(content !== undefined) content = tio_code_prefix + (content || "\n");
                var result = nbsRemove(textContent(ec, content));
                if(result !== undefined) {
                    return result.replace(tio_code_prefix, '');
                }
            }
        // Add the logic for the header.
        if(has_header) {
            var tio_header_prefix = "[header]\n"
            // peh.appendChild(eh);
            // o.prepend(peh);
            deh.appendChild(eh);
            p.prepend(deh);
            // p.prepend(eh);
            o.tio_header = function(content) {
                if(content !== undefined) content = tio_header_prefix + (content || "\n");
                var result = nbsRemove(textContent(eh, content));
                if(result !== undefined) {
                    return result.replace(tio_header_prefix, '');
                }
            }
        }
        // Add the logic for the input.
        if(has_input) {
            var tio_input_prefix = "[input]\n"
            // pei.appendChild(ei);
            // o.prepend(pei);
            dei.appendChild(ei);
            p.prepend(dei);
            // p.prepend(ei);
            o.tio_input = function(content) {
                if(content !== undefined) content = tio_input_prefix + (content || "\n");
                var result = nbsRemove(textContent(ei, content));
                if(result !== undefined) {
                    return result.replace(tio_input_prefix, '');
                }
            }
        }
        // Add the logic for the args.
        if(has_args) {
            var tio_args_prefix = "[args]\n"
            // pea.appendChild(ea);
            // o.prepend(pea);
            dea.appendChild(ea);
            p.prepend(dea);
            // p.prepend(ea);
            o.tio_args = function(content) {
                if(content !== undefined) content = tio_args_prefix + (content || "\n");
                var result = nbsRemove(textContent(ea, content));
                if(result !== undefined) {
                    return result.replace(tio_args_prefix, '');
                }
            }
        }
        // Add the logic for the options.
        if(has_options) {
            var tio_options_prefix = "[options]\n"
            // peo.appendChild(eo);
            // o.prepend(peo);
            deo.appendChild(eo);
            p.prepend(deo);
            // p.prepend(eo);
            o.tio_options = function(content) {
                if(content !== undefined) content = tio_options_prefix + (content || "\n");
                var result = nbsRemove(textContent(eo, content));
                if(result !== undefined) {
                    return result.replace('[options]', '');
                }
            }
        }
        // Add the logic for the drivers.
        if(has_drivers) {
            var tio_drivers_prefix = "[drivers]\n"
            // ped.appendChild(ed);
            // o.prepend(ped);
            ded.appendChild(ed);
            p.prepend(ded);
            // p.prepend(ed);
            o.tio_drivers = function(content) {
                if(content !== undefined) content = tio_drivers_prefix + (content || "\n");
                var result = nbsRemove(textContent(ed, content));
                if(result !== undefined) {
                    return result.replace('[drivers]', '');
                }
            }
        }
    }

    // Based on the type, get the content or set the content.
    if(type === "code") {
        o.tio_val = function(content) {
            return textContent(e, content);
        };
    } else if(type === "textarea") {
        o.tio_val = function(content) {
            if(content === undefined) return e.value;
            e.value = content;
            e.scrollTop = e.scrollHeight;
        }
    }

    // Add the logic for handling the animation sequences.
    if(is_animate || is_animate_button) {
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
            tio_animate_button_cache = textContent(b);
            tio_animate_frame_pos = -1;
            (function animate() {
                var current = o.tio_val();
                if(tio_animate_frame_pos !== -1 && is_animate) {
                    current = tio.utils.string_splice(current, tio_animate_frame_pos, tio_animate_frames[tio_animate_frame].length, "");
                }

                if(o.tio_is_running) {
                    tio_animate_frame = (tio_animate_frame + 1) % tio_animate_frames.length;
                    tio_animate_frame_pos = current.length;
                    if(is_animate) o.tio_val(current + tio_animate_frames[tio_animate_frame]);
                    if(is_animate_button) textContent(b, tio_animate_frames[tio_animate_frame]);
                    setTimeout(animate, 10);
                } else {
                    if(is_animate) o.tio_val(current);
                    if(is_animate_button) textContent(b, tio_animate_button_cache);
                }
            })()
        });
    }

    // Get the debug element text or set it.
    o.tio_debug = function(output) {
        if(output === undefined) return ""
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

    // Cache all of the inputs and clean out any bad elements.
    o.tio_is_running = false;
    o.tio_js = !!is_tio_js;
    o.tio_type = type;
    o.tio_runable = !!is_runable;
    o.tio_animate = !!is_animate;
    o.tio_animate_button = !!is_animate_button;
    o.tio_editable = !!is_editable;

    o.tio_has_debug = !!has_debug;
    o.tio_has_input = !!has_input;
    o.tio_has_header = !!has_header;
    o.tio_has_footer = !!has_footer;
    o.tio_has_args = !!has_args;
    o.tio_has_options = !!has_options;
    o.tio_has_drivers = !!has_drivers;

    if(o.tio_input) o.tio_input(nbsRemove(html.getAttribute("tio-input") || ""))
    else o.tio_input = function() { return nbsRemove(html.getAttribute("tio-input") || "") };
    if(o.tio_code) o.tio_code(nbsRemove(html.getAttribute("tio-code") || ""))
    else o.tio_code = function() { return nbsRemove(html.getAttribute("tio-code") || "") };
    o.tio_display_code = html.getAttribute("tio-display-code");
    o.tio_display_code = o.tio_display_code ? editor_handle_string_attribute(o.tio_display_code) : o.tio_code;
    
    if(o.tio_language) o.tio_language(nbsRemove(html.getAttribute("tio-language") || "python3"))
    else o.tio_language = function() { return nbsRemove(html.getAttribute("tio-language") || "python3") };
    if(o.tio_header) o.tio_header(nbsRemove(html.getAttribute("tio-header") || ""))
    else o.tio_header = function() { return nbsRemove(html.getAttribute("tio-header") || "") };
    if(o.tio_footer) o.tio_footer(nbsRemove(html.getAttribute("tio-footer") || ""))
    else o.tio_footer = function() { return nbsRemove(html.getAttribute("tio-footer") || "") };
    if(o.tio_options) o.tio_options(nbsRemove(html.getAttribute("tio-options") || "[]"))
    else o.tio_options = function() { return nbsRemove(html.getAttribute("tio-options") || "[]") };
    if(o.tio_drivers) o.tio_drivers(nbsRemove(html.getAttribute("tio-drivers") || "[]"))
    else o.tio_drivers = function() { return nbsRemove(html.getAttribute("tio-drivers") || "[]") };
    if(o.tio_args) o.tio_args(nbsRemove(html.getAttribute("tio-args") || "[]"))
    else o.tio_args = function() { return nbsRemove(html.getAttribute("tio-args") || "[]") };
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
                // If tio_js is set, we need to create a tio.utils.session.
                (function(session) {
                    elem.tio_reset.add(function() {
                        session.language(elem.tio_language());
                        var language = session.language();
                        if(session.utils._languages) {
                            language = session.utils._languages[language];
                            language = language ? language.name : session.language();
                        }
                        session.code(editor_handle_string_attribute(elem.tio_code()));
                        var bytes = session.byte_count();
                        var chars = session.character_count();
                        if(elem.tio_editable) {
                            elem.tio_val(
                                ("[language] " + language + "\n") +
                                (bytes === undefined ? "" : ("[bytes] " + bytes + "\n")) +
                                (chars === undefined ? "" : ("[chars] " + chars + "\n")) +
                                ">>>\n"
                            );
                        } else {
                            elem.tio_val(
                                (elem.tio_input() && ("[input]\n" + elem.tio_input() + "\n")) +
                                "[code]\n" + session.code() +
                                ("\n[language] " + language + "\n") +
                                (bytes === undefined ? "" : ("[bytes] " + bytes + "\n")) +
                                (chars === undefined ? "" : ("[chars] " + chars + "\n")) +
                                ">>>\n"
                            );
                        }
                    })
                    elem.tio_reset();
                    elem.tio_cancel.add(function(){
                        session.cancel();
                        elem.tio_reset();
                        elem.tio_done();
                    });
                    session.oncomplete.add(function() {
                        elem.tio_val(elem.tio_val() + session.output());
                        elem.tio_debug(session.debug());
                        elem.tio_done();
                    });
                    elem.tio_run.add(function() {
                        session.onload.add(function() {
                            try {
                                session.language(elem.tio_language());
                                session.input(editor_handle_string_attribute(elem.tio_input()));
                                session.header(editor_handle_string_attribute(elem.tio_header()));
                                session.code(editor_handle_string_attribute(elem.tio_code()));
                                session.footer(editor_handle_string_attribute(elem.tio_footer()));
                                if(elem.tio_has_options) session.options = editor_handle_attribute(elem.tio_options())
                                if(elem.tio_has_drivers) session.drivers = editor_handle_attribute(elem.tio_drivers())
                                if(elem.tio_has_args) session.args = editor_handle_attribute(elem.tio_args())
                                session.run()
                            } catch(error) {
                                elem.tio_val(error.stack + "\n" + error.name + "\n" + error.message);
                                elem.tio_done();
                            }
                        }, false);
                        elem.tio_start();
                        session.load(true);
                    });
                    elem.tio_ready();
                })(tio.utils.session());
            } else {
                // If tio_js is not set, we need to create a tio_lang program.
                (function(prgm) {
                    elem.tio_reset.add(function() {
                        elem.tio_val(
                            (elem.tio_input() && ("[input]\n" + elem.tio_input() + "\n")) +
                            "[code]\n" + elem.tio_display_code +
                            "\n>>>\n"
                        );                
                    })
                    elem.tio_reset();
                    elem.tio_cancel.add(function(){
                        prgm.cancel();
                        elem.tio_reset();
                        elem.tio_done();
                    });
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
                        prgm.code = editor_handle_string_attribute(elem.tio_code())
                        prgm.input = editor_handle_string_attribute(elem.tio_input())
                        
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
