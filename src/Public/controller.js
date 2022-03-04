const darkBg      = "#121212";
const darkBg2     = "#1c1c1c";
const darkText    = "#d3d3d3";
const darkLightText = "#c2c2c2"
const darkLine    = "#454545";

const lightBg     = "#ffffff";
const lightBg2    = "#f7f7f7";
const lightText   = "#666666";
const lightDarkText = "#181818";
const lightLine   = "#d3d3d3";

function setColors(val){
    const r = document.querySelector(":root")
    if (val == "dark"){
        r.style.setProperty("--background", darkBg);
        r.style.setProperty("--background2", darkBg2);
        r.style.setProperty("--text", darkText);
        r.style.setProperty("--text2", darkLightText);
        r.style.setProperty("--line", darkLine);
    }else if (val == "light"){
        r.style.setProperty("--background", lightBg);
        r.style.setProperty("--background2", lightBg2);
        r.style.setProperty("--text", lightText);
        r.style.setProperty("--text2", lightDarkText);
        r.style.setProperty("--line", lightLine);
    }
}