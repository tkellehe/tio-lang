(function(){

function ppcg_handle_attribute(text) {
    return eval("(function(){ return \"" + text + "\";})()");
}

var nbs = String.fromCharCode(160),
    space = String.fromCharCode(32);
    
var nbsRemoveRegex = new RegExp(nbs,"g");
function nbsRemove(string) {
    if(!string) return "";
    return string.replace(nbsRemoveRegex, space);
};

function ppcg_create_element(html) {
    var type = html.getAttribute("tio-type") || "code";
    var runable_text = html.getAttribute("tio-runable");
    var is_runable = html.getAttribute("tio-runable") !== null;
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

    // If it is runable, add a button to control when the output gets put in.
    if(is_runable) {
        var b = document.createElement("button");
        b.style
        b.style.width = "100%"
        b.style.fontFamily = "monospace";
        b.style.outline = "none";
        b.style.color = "white";
        b.style.backgroundColor = "black";

        b.innerText = runable_text || "RUN"

        o.appendChild(b);

        b.onclick = function() {
            o.tio_reset();
            o.tio_run();
        }

        o.tio_ready = function(){}
    } else {
        o.tio_ready = function() {
            o.tio_reset();
            o.tio_run();
        }
    }

    if(type === "textarea") {
        o.tio_val = function(content) {
            if(content === undefined) return e.value;
            e.value = content;
            e.scrollTop = e.scrollHeight;
        }
    } else if(type === "code") {
        o.tio_val = function(content) {
            if(content === undefined) return e.innerText;
            e.innerText = content;
        }
    }
    
    o.tio_debug = function(output) {
        if(output === undefined) return ""
    }

    o.tio_type = type;
    o.tio_runable = !!is_runable;

    // Get the code and input then clean out any bad elements.
    o.tio_input = html.getAttribute("tio-input") || "";
    o.tio_code = html.getAttribute("tio-code") || "";
    o.tio_input = nbsRemove(o.tio_input);
    o.tio_code = nbsRemove(o.tio_code);

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
            elem.tio_reset = function() {
                elem.tio_val(
                    (elem.tio_input && ("input:\n" + elem.tio_input + "\n")) +
                    "\ncode:\n" + elem.tio_code +
                    "\n>>>\n"
                );                
            }
            elem.tio_reset();

            (function(prgm) {
                prgm.oncomplete = function() {
                    elem.tio_val(elem.tio_val() + prgm.output());
                    elem.tio_debug(prgm.debug());
                }
                prgm.onerror = function() {
                    var result = "";
                    tio.utils.iterate(prgm.TIO.messages, function(message){
                        result += message.title + "(" + message.category + ")\n" + message.message + "\n\n";
                    });
                    elem.tio_val(result);
                    elem.tio_debug(prgm.debug());
                }
                elem.tio_run = function() {
                    prgm.run()
                }
                elem.tio_ready();
            })(tio_lang(ppcg_handle_attribute(elem.tio_code), ppcg_handle_attribute(elem.tio_input)));

            // Remove all children nodes and add the node containing the live code.
            html.innerHTML = "";
            html.appendChild(elem);
        })(output_div_elements[i], ppcg_create_element(output_div_elements[i]));
    }
}

document.addEventListener("DOMContentLoaded", onload);

})()
