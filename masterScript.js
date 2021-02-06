//functions that determine the screen size of client
let isSmallScreen = () => $(window).width() < 768;
let isMediumScreen = () => (768 >= $(window).width()) && ($(window).width() < 992);
let isLargeScreen = () => !isMediumScreen() && !isSmallScreen();

//dictionary of colors and their respective hex codes based on the master style.css sheet
let colorDict = {
    "var(--card-red)": "#a85a58",
    "var(--text-red)": "#4c2c1d",
    "var(--offwhite)": "#f5f5f5",
    "var(--creamwhite)": "#F9EDD4",
    "var(--darkcream)": "#dfae4e",
    "var(--green)": "#DBDFBC",
    "var(--sagegreen)": "#679787",
    "var(--blue)": "#77A8B9",
    "var(--purple)": "#707695"
};

/**
 * Darkens or lightens given color by amount. Amount is between -100, 100
 * where negative numbers make the color darker and positive ones make it lighter
 * @param col color in hex or rgba format
 * @param amt amount by which to darken/lighten
 * @returns {string} hex of new color
 */
function darkenColor(col, amt) {
    console.log("color", col);

    var usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    console.log("r", r, "g", g, "b", b);

    let newVal = "rgb(" + r + ", " + g + ", " + b + ")";
    return newVal;
}
