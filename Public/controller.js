//const { text } = require("express");

const { text } = require("express");

function setColors(val){
    text = document.getElementsByClassName("text");
    if (val == "dark"){
        document.getElementById("body").style.setProperty("--background", "#121212");
        for (let i = 0; i < text.length; i++) {
            text.item(i).style.setProperty("--text", "#121212");
        }
    }
    else if (val == "light"){
        document.getElementById("body").style.setProperty("--background", "#ffffff");
    }
    /*
    var body = document.getElementById("body");
    var text = document.getElementsByClassName("id");
    var content = document.getElementsByClassName("mainContent");
    if (val == "dark") {
        body.classList.remove("content");
        body.classList.add("content-dark");
        for (let i = 0; i < text.length; i++) {
            text.item(i).classList.add("text-dark");
            text.item(i).classList.remove("text");
        }
        for (let i = 0; i < content.length; i++) {
            content.item(i).classList.add("mainContent-dark");            
            content.item(i).classList.remove("mainContent");            
        }
    }
    else if (val == "light"){
        body.classList.remove("content-dark");
        body.classList.add("content");
        for (let i = 0; i < text.length; i++) {
            text.item(i).classList.add("text");
            text.item(i).classList.remove("text-dark");
        }
        for (let i = 0; i < content.length; i++) {
            content.item(i).classList.add("mainContent");            
            content.item(i).classList.remove("mainContent-dark");            
        }
    }
    */

}
function getCurrentColorMode(){
    return document.getElementById("colorMode").value;
}