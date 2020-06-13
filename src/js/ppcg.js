(function(){

function ppcg_handle_attribute(text) {
    return eval("(function(){ return \"" + text + "\";})()");
}

function ppcg_textearea() {
    var o = document.createElement("textarea");
    o.style.width = "100%"
    o.style.height = "5em"
    o["box-sizing"] = "border-box";         /* For IE and modern versions of Chrome */
    o["-moz-box-sizing"] = "border-box";    /* For Firefox                          */
    o["-webkit-box-sizing"] = "border-box"; /* For Safari                           */     
    o.style.resize = "vertical";
    o.style.fontFamily = "monospace";
    o.style.outline = "none";
    o.style.color = "white";
    o.style.backgroundColor = "black";
    o.style.overflow = "auto";
    return o;
} 

function onload() {
    var errors = document.getElementsByClassName("tio-error");
    tio.utils.iterate(errors, function(e) {

    });

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
        })(output_div_elements[i], output_div_elements[i].getAttribute("tio-input"), output_div_elements[i].getAttribute("tio-code"), ppcg_textarea());
    }
}

document.addEventListener("DOMContentLoaded", onload);

})()
