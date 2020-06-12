(function(){

var output_div_elements = document.getElementsByClassName(".tio-output");

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
    
        // output_element.cols = html.getAttribute("cols") || 100;
        // output_element.rows = html.getAttribute("rows") || 5;

        output_element.style.width = "100%"
        output_element.style.height = "5em"
  // box-sizing: border-box;         /* For IE and modern versions of Chrome */
  // -moz-box-sizing: border-box;    /* For Firefox                          */
  // -webkit-box-sizing: border-box; /* For Safari                           */     
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
            prgm.run()
        })(tio_lang(code, input));
    })(output_div_elements[i], output_div_elements[i].getAttribute("tio-input"), output_div_elements[i].getAttribute("tio-code"), document.createElement("textarea"));
}

})()