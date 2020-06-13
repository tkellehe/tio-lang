(function(){


function ppcg_handle_attribute(text) {
    return eval("(function(){ return \"" + text + "\";})()");
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

    var output_div_elements = document.getElementsByClassName("tio-output");

    var nbs = String.fromCharCode(160),
        space = String.fromCharCode(32);
        
    var nbsRemoveRegex = new RegExp(nbs,"g");
    function nbsRemove(string) {
        if(!string) return "";
        return string.replace(nbsRemoveRegex, space);
    };

    for(var i = output_div_elements.length; i--;) {
        (function(html, input, code, output_element){
            input = nbsRemove(input);
            code = nbsRemove(code);
        
            var cols = html.getAttribute("tio-cols"),
                rows = html.getAttribute("tio-rows");
            if(cols) {
                output_element.cols = cols;
            }
            if(rows) {
                output_element.rows = rows;
            }

            output_element.style.width = "100%"
            output_element.style.height = "5em"
            output_element["box-sizing"] = "border-box";         /* For IE and modern versions of Chrome */
            output_element["-moz-box-sizing"] = "border-box";    /* For Firefox                          */
            output_element["-webkit-box-sizing"] = "border-box"; /* For Safari                           */     
            output_element.style.resize = "vertical";
            output_element.style.fontFamily = "monospace";
            output_element.style.outline = "none";
            output_element.style.color = "white";
            output_element.style.backgroundColor = "black";
            output_element.style.overflow = "auto";


            html.appendChild(output_element);

            (function(prgm) {
                prgm.oncomplete = function() {        
                    output_element.value = prgm.output();
                    output_element.scrollTop = output_element.scrollHeight;
                }
                prgm.onerror = function() {
                    var result = "";
                    tio.utils.iterate(prgm.TIO.messages, function(message){
                        result += message.title + "(" + message.category + ")\n" + message.message + "\n\n";
                    });
                    output_element.value = result;
                    output_element.scrollTop = output_element.scrollHeight;
                }
                prgm.run()
            })(tio_lang(ppcg_handle_attribute(code), ppcg_handle_attribute(input)));
        })(output_div_elements[i], output_div_elements[i].getAttribute("tio-input"), output_div_elements[i].getAttribute("tio-code"), document.createElement("textarea"));
    }
}

document.addEventListener("DOMContentLoaded", onload);

})()
