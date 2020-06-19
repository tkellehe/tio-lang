(function(){

//------------------------------------------------------------------------------------------------------------
// handle string attribute.
function ehsa(text) {
    return eval("(function(){ return \"" + text.replace(/"/g, '\\"').replace(/\n/g, '\\n') + "\";})()");
}

//------------------------------------------------------------------------------------------------------------
// handle any attribute and turn into a js object.
function eha(text) {
    return eval("(function(){ return " + text + ";})()");
}

//------------------------------------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------------------------------------
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
var BRC = "\u27A4",
    DS = "\n------------------------------\n";

//------------------------------------------------------------------------------------------------------------
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
        has_input = html.getAttribute("tio-input") !== null && html.getAttribute("tio-hide-input") === null,
        has_header = html.getAttribute("tio-header") !== null && html.getAttribute("tio-hide-header") === null,
        has_footer = html.getAttribute("tio-footer") !== null && html.getAttribute("tio-hide-footer") === null,
        has_args = html.getAttribute("tio-args") !== null && html.getAttribute("tio-hide-args") === null,
        has_options = html.getAttribute("tio-options") !== null && html.getAttribute("tio-hide-options") === null,
        has_drivers = html.getAttribute("tio-drivers") !== null && html.getAttribute("tio-hide-drivers") === null,
        has_bytes = html.getAttribute("tio-hide-bytes") === null,
        has_chars = html.getAttribute("tio-hide-chars") === null,
        has_language = html.getAttribute("tio-hide-language") === null;
    
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
    var b = {innerText:BRC};
    if(is_runable) {
        var b = document.createElement("button");
        
        // Style the button based on the text.
        if(runable_text === "{RUN}" || runable_text === "") {
            var bd = document.createElement("div");
            b.style.fontFamily = "monospace";
            b.style.backgroundColor = "white";
            b.style.color = "black";
            b.style.textDecoration = "none";
            b.style.display = "inline-block";
            b.style.fontSize = "1.3em";
            b.style.borderRadius = "5%";
            b.style.border = "1px solid #000";
            b.style.margin = "auto auto";
            b.style.width = "1.7em";
            b.style.height = "1.7em";
            b.style.padding = "0px";
            b.style.textAlign = "center";
            
            textContent(b, BRC);

            // The small button needs to be added to the <pre> tag.
            bd.style.margin = "0.5em auto";
            p.appendChild(bd);
            bd.appendChild(b);
        } else {
            textContent(b, runable_text);

            b.style.width = "100%"
            b.style.fontFamily = "monospace";
            b.style.outline = "none";
            b.style.color = "white";
            b.style.backgroundColor = "black";

            // Normal button needs to be added to the div.
            o.appendChild(b);
        }

        // Set the onlick function to control running and cancellation.

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

    // Make it editable if everything checks out.
    if(is_runable && is_editable && is_tio_js) {
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
        eh.contentEditable = "true";
        eh.style.outline = "0px solid transparent";
        eh.style.width = "100%";
        ec.contentEditable = "true";
        ec.style.outline = "0px solid transparent";
        ec.style.width = "100%";
        ef.contentEditable = "true";
        ef.style.outline = "0px solid transparent";
        ef.style.width = "100%";
        ea.contentEditable = "true";
        ea.style.outline = "0px solid transparent";
        ea.style.width = "100%";
        ed.contentEditable = "true";
        ed.style.outline = "0px solid transparent";
        ed.style.width = "100%";
        eo.contentEditable = "true";
        eo.style.outline = "0px solid transparent";
        eo.style.width = "100%";

        var dei = document.createElement("div"),
            deh = document.createElement("div"),
            dec = document.createElement("div"),
            def = document.createElement("div"),
            dea = document.createElement("div"),
            ded = document.createElement("div"),
            deo = document.createElement("div");
        dei.style.margin = "0.5em auto";
        deh.style.margin = "0.5em auto";
        dec.style.margin = "0.5em auto";
        def.style.margin = "0.5em auto";
        dea.style.margin = "0.5em auto";
        ded.style.margin = "0.5em auto";
        deo.style.margin = "0.5em auto";

        // Add the logic for the footer.
        if(has_footer) {
            var tio_footer_prefix = "[footer]\n"
            def.appendChild(ef);
            p.prepend(def);
            o.tio_footer = function(content) {
                if(content !== undefined) content = tio_footer_prefix + (content || "\n");
                var result = nbsRemove(textContent(ef, content));
                if(result !== undefined) {
                    result = result.replace(tio_footer_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        }
        // Add the logic for the code.
            var tio_code_prefix = "[code]\n"
            dec.appendChild(ec);
            p.prepend(dec);
            o.tio_code = function(content) {
                if(content !== undefined) content = tio_code_prefix + (content || "\n");
                var result = nbsRemove(textContent(ec, content));
                if(result !== undefined) {
                    result = result.replace(tio_code_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        // Add the logic for the header.
        if(has_header) {
            var tio_header_prefix = "[header]\n"
            deh.appendChild(eh);
            p.prepend(deh);
            o.tio_header = function(content) {
                if(content !== undefined) content = tio_header_prefix + (content || "\n");
                var result = nbsRemove(textContent(eh, content));
                if(result !== undefined) {
                    result = result.replace(tio_header_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        }
        // Add the logic for the input.
        if(has_input) {
            var tio_input_prefix = "[input]\n"
            dei.appendChild(ei);
            p.prepend(dei);
            o.tio_input = function(content) {
                if(content !== undefined) content = tio_input_prefix + (content || "\n");
                var result = nbsRemove(textContent(ei, content));
                if(result !== undefined) {
                    result = result.replace(tio_input_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        }
        // Add the logic for the args.
        if(has_args) {
            var tio_args_prefix = "[args]\n"
            dea.appendChild(ea);
            p.prepend(dea);
            o.tio_args = function(content) {
                if(content !== undefined) content = tio_args_prefix + (content || "\n");
                var result = nbsRemove(textContent(ea, content));
                if(result !== undefined) {
                    result = result.replace(tio_args_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        }
        // Add the logic for the options.
        if(has_options) {
            var tio_options_prefix = "[options]\n"
            deo.appendChild(eo);
            p.prepend(deo);
            o.tio_options = function(content) {
                if(content !== undefined) content = tio_options_prefix + (content || "\n");
                var result = nbsRemove(textContent(eo, content));
                if(result !== undefined) {
                    result = result.replace(tio_options_prefix, '');
                    return result === "\n" ? "" : result;
                }
            }
        }
        // Add the logic for the drivers.
        if(has_drivers) {
            var tio_drivers_prefix = "[drivers]\n"
            ded.appendChild(ed);
            p.prepend(ded);
            o.tio_drivers = function(content) {
                if(content !== undefined) content = tio_drivers_prefix + (content || "\n");
                var result = nbsRemove(textContent(ed, content));
                if(result !== undefined) {
                    result = result.replace(tio_drivers_prefix, '');
                    return result === "\n" ? "" : result;
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
    o.tio_has_bytes = !!has_bytes;
    o.tio_has_chars = !!has_chars;
    o.tio_has_language = !!has_language;

    if(o.tio_input) o.tio_input(ehsa(nbsRemove(html.getAttribute("tio-input")) || ""))
    else o.tio_input = function() { return nbsRemove(html.getAttribute("tio-input") || "") };
    if(o.tio_code) o.tio_code(ehsa(nbsRemove(html.getAttribute("tio-code")) || ""))
    else o.tio_code = function() { return nbsRemove(html.getAttribute("tio-code") || "") };
    
    if(o.tio_language) o.tio_language(ehsa(nbsRemove(html.getAttribute("tio-language")) || "python3"))
    else o.tio_language = function() { return nbsRemove(html.getAttribute("tio-language") || "python3") };
    if(o.tio_header) o.tio_header(ehsa(nbsRemove(html.getAttribute("tio-header")) || ""))
    else o.tio_header = function() { return nbsRemove(html.getAttribute("tio-header") || "") };
    if(o.tio_footer) o.tio_footer(ehsa(nbsRemove(html.getAttribute("tio-footer")) || ""))
    else o.tio_footer = function() { return nbsRemove(html.getAttribute("tio-footer") || "") };
    if(o.tio_options) o.tio_options(ehsa(nbsRemove(html.getAttribute("tio-options")) || "[]"))
    else o.tio_options = function() { return nbsRemove(html.getAttribute("tio-options") || "[]") };
    if(o.tio_drivers) o.tio_drivers(ehsa(nbsRemove(html.getAttribute("tio-drivers")) || "[]"))
    else o.tio_drivers = function() { return nbsRemove(html.getAttribute("tio-drivers") || "[]") };
    if(o.tio_args) o.tio_args(ehsa(nbsRemove(html.getAttribute("tio-args")) || "[]"))
    else o.tio_args = function() { return nbsRemove(html.getAttribute("tio-args") || "[]") };
    return o;
} 

//------------------------------------------------------------------------------------------------------------
function tio_apply_editor(html) {
    var elem = editor_create_element(html);
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
                session.code(elem.tio_code());
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
                        "\n" +
                        (elem.tio_has_language ? ("[language] " + language + "\n") : "") +
                        (elem.tio_has_bytes ? (bytes === undefined ? "" : ("[bytes] " + bytes + "\n")) : "") +
                        (elem.tio_has_chars ? (chars === undefined ? "" : ("[chars] " + chars + "\n")) : "") +
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
                elem.tio_val(elem.tio_val() + session.output() + (elem.tio_has_debug ? DS + session.debug() : ""));
                elem.tio_done();
            });
            elem.tio_run.add(function() {
                session.onload.add(function() {
                    try {
                        session.language(elem.tio_language());
                        session.input(ehsa(elem.tio_input()));
                        session.header(ehsa(elem.tio_header()));
                        session.code(elem.tio_code());
                        session.footer(ehsa(elem.tio_footer()));
                        if(elem.tio_has_options) session.options = eha(elem.tio_options())
                        if(elem.tio_has_drivers) session.drivers = eha(elem.tio_drivers())
                        if(elem.tio_has_args) session.args = eha(elem.tio_args())
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
                    "[code]\n" + ehsa(elem.tio_code()) +
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
                elem.tio_val(elem.tio_val() + prgm.output() + (elem.tio_has_debug ? DS + prgm.debug() : ""));
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
                prgm.code = ehsa(elem.tio_code())
                prgm.input = ehsa(elem.tio_input())
                
                elem.tio_start()
                prgm.run()
            });
            elem.tio_ready();
        })(tio_lang());
    }

    // Remove all children nodes and add the node containing the live code.
    html.innerHTML = "";
    html.appendChild(elem);
}

//------------------------------------------------------------------------------------------------------------
function onload() {
    tio.onload.add(function(){
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
            tio_apply_editor(output_div_elements[i]);
        }
    })
    tio.load(true)
}

document.addEventListener("DOMContentLoaded", onload);
this.tio_find_editors = onload;
this.tio_apply_editor = tio_apply_editor;

})()
