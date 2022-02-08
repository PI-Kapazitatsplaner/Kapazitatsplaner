var darkBg      = "#121212";
var darkBg2     = "#1c1c1c";
var darkText    = "#d3d3d3";

var lightBg     = "#ffffff";
var lightBg2    = "#f7f7f7";
var lightText   = "#666666";

function setColors(val){
    var body = document.getElementById("body");
    var text = document.getElementsByClassName("text");
    var content = document.getElementById("mainContent");

    if (val == "dark"){
        //Hintergrundfarbe ändern
        body.style.setProperty("--background", darkBg);
        content.style.setProperty("--background2", darkBg2);
        for (let i = 0; i < text.length; i++) {
            //Textfarbe ändern
            text.item(i).style.setProperty("--text", darkText);
        }
    }
    else if (val == "light"){
        //Hintergrundfarben ändern
        body.style.setProperty("--background", lightBg);
        content.style.setProperty("--background2", lightBg2);
        for (let i = 0; i < text.length; i++) {
            //Textfarbe ändern
            text.item(i).style.setProperty("--text", lightText);
        }
    }
}