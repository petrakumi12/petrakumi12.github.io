let allEntries;
let dataCsv = "data.csv";
let imgRoot = "../../";
let colorArray = [
    "var(--purple)",
    "var(--sagegreen)",
    "var(--card-red)",
    "var(--darkcream)",
    "var(--blue)"
];


window.onload = e => {
    AOS.init();
    loadEntries().then(e => {
        generateAllEntryCards();
    });
};

/**
 * Loads entries from data.csv file and adds them to the response object
 */
let loadEntries = async function () {
    await d3.csv(dataCsv)
        .then(response => allEntries = response)
};

/**
 * Generates UI cards for all entries on the responses object
 */
let generateAllEntryCards = function () {
    let maxKey = Object.keys(allEntries).length;
    for (let key in Object.keys(allEntries)) {
        if (parseInt(key) < maxKey - 1) {
            generateEntryCard(allEntries[key])
        }
    }
};

/** Generates random number between min and max
 * @param min minimum number of range
 * @param max maximum number of range
 * @returns {number} random no
 */
let generateRandomNo = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Gets the next color of the color array by popping it from the array,
 * then adds it back to the end of the array
 * @returns {string} the current color
 */
function getColor() {
    let color = colorArray.shift();
    colorArray.push(color);
    return color;
}

/**
 * Generates one UI project card given dict of data for it
 * @param entryData dictionary containing data for this card
 */
function generateEntryCard(entryData) {
    let number = generateRandomNo(200, 1000);
    let theColor = getColor();
    //card div
    let entryCard = $("<div />", {
        "class": "card",
        "data-aos": "zoom-in-down",
        "data-aos-delay": number,
        "style": "background-color: " + theColor //+ "; box-shadow: 0.2rem 0.2rem " + darkenColor(theColor, -120)
    });
    //image
    let entryImg = $("<img />", {
        "class": "card-img-top card-image",
        "src": imgRoot + entryData["Image"],
        "style": "opacity: " + 0.9 + "; outline: 3px solid " + theColor
    });
    //div that will contain text that will show on hover
    let textOverlay = $("<div />", {
        "class": "card-img-overlay text-center row no-gutters justify-content-center align-items-center py-5",
        "style": "background-color: " + theColor
    }).hide();
    //date text
    let date = $("<small />", {
        "class": "row w-100 text-white justify-content-center"
    }).text(entryData["Timestamp"]);
    //partner organization text
    let org = $("<small />", {
        "class": "row w-100 text-white justify-content-center"
    }).html(entryData["Org"]);
    //description text
    let description = $("<small />", {
        "class": "row w-100 my-2 text-white justify-content-center"
    }).html(entryData["Description"]);
    //title text
    let entryTitle = $("<h2 />", {
        "class": "row w-100 card-title justify-content-center",
        "style": "margin: 0; color: var(--offwhite);"
    }).text(entryData["Title"]);
    //div containing all the logos
    let logosContainer = $("<div />", {
        "class": "row w-100 no-gutters align-items-center justify-content-center"
    });
    //github logo
    let githubLogo = $("<a />", {
        "class": "text-center",
        "href": entryData["Github"],
        "target": "_blank"
    }).html("<i class=\"fab fa-github\"></i>");
    //pdf logo
    let pdfLogo = $("<a />", {
        "class": "text-center",
        "href": entryData["PDF"],
        "target": "_blank"
    }).html("<i class=\"fas fa-file-pdf\"></i>");
    //only add github or pdf logo if a link to them exists
    if (entryData["Github"] !== "" || entryData["PDF"] !== "") {
        if (entryData["Github"] !== " " && entryData["Github"] !== undefined) {
            logosContainer.append(githubLogo);
        }
        if (entryData["PDF"] !== " " && entryData["PDF"] !== undefined) {
            logosContainer.append(pdfLogo);
        }
    }

    entryCard.append(entryImg);
    entryCard.append(textOverlay);
    textOverlay.append(org);
    textOverlay.append(entryTitle);
    textOverlay.append(date);
    textOverlay.append(description);
    textOverlay.append(logosContainer);
    $("#data-cards").append(entryCard);

    entryCard.css("height", entryCard.width());
    entryCard.css("minHeight", entryCard.width());
    entryImg.css("height", entryCard.width());
    textOverlay.css("height", entryCard.width());

    addCardMouseInteractions(entryCard);
}

/**
 * Adds mouse over/out listener to card
 * @param entryCard the card to add effect on
 */
let addCardMouseInteractions = function (entryCard) {
    entryCard.on("mouseover", e => entryCard.find(".card-img-overlay").show());
    entryCard.on("mouseout", e => entryCard.find(".card-img-overlay").hide());
};