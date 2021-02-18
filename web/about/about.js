let allEntries;
let timelineCsv = "background.csv";

window.onload = function () {
    //add small screen check for page format change if necessary
    if (isSmallScreen()) {
        $("#timeline").addClass("accordion")
    }

    //load all timeline entries then generate timeline
    loadEntries().then(e => {
        generateTimeline();
        AOS.init();
    })
};

/**
 * Loads all timeline entries from csv file
 */
async function loadEntries() {
    await d3.csv(timelineCsv)
        .then(response => allEntries = response)
}

/**
 * Generates timeline in dom using loaded timeline entries and depending on screen size
 */
function generateTimeline() {
    for (let key in Object.keys(allEntries)) {
        let entry = allEntries[key];
        if (entry !== undefined) {
            console.log('entry', entry);
            let color = "var(" + entry["Color"] + ")";
            if (isSmallScreen()) {
                console.log("small");
                generateSmallScreenTimeline(color, entry, key);
            } else {
                console.log("large");
                generateLargeScreenTimeline(color, entry, key);

            }
        }
    }

    /**
     * Generates timeline in small screen sizes
     * @param color, color of given entry
     * @param entry, timeline entry
     * @param key, index of entry in all entries array
     */
    function generateSmallScreenTimeline(color, entry, key) {
        //generate card containing all content
        let card = $("<div>", {
            "class": "card w-100",
            "style": "border: none;"
        });
        //button that collapses/opens accordion
        let btn = $("<button>", {
            "class": "btn collapsed",
            "type": "button",
            "data-toggle": "collapse",
            "data-target": "#i" + key,
            "aria-expanded": "false",
            "aria-controls": "i" + key,
            "style": "background-color: var(--offwhite)"
        });
        //container for date
        let dateContainer = $("<div />", {
            "class": "col-80 no-gutters align-items-center justify-content-center text-center",
            "style": "background-color: var(--offwhite), border: none, border-bottom: 3px solid " + color
        });
        //title text
        let title = $("<h3 />", {
            "class": "my-0 mx-3",
            "style": "font-size: 1.5em; font-family: var(--rubik); text-shadow: 0.05em 0.05em " + darkenColor(colorDict[color], -120) + "; color: " + color
        }).text(entry["Title"]);
        //date text
        let date = $("<h4 />", {
            "class": "mx-3",
            "style": "filter: brightness(50%); font-weight: bold; font-size: 1.1em; color: " + color
        }).text(entry["Date"]);
        //paragraph text
        let paragraph = $("<p />", {
            "class": "block-text px-5 pt-3 pb-5",
            "style": "filter: brightness(20%); color: " + color + ";"
        }).text(entry["Text"]);
        //container for all text
        let textContainer = $("<div />", {
            "class": "collapse row w-100 no-gutters align-items-center justify-content-center p-3",
            "id": "i" + key,
            "style": "background-color: " + color,
            "data-parent": "#timeline"
        });
        // image element
        let image = $("<img />", {
            "style": "margin-top: -2em; margin-left: 10%; max-width: 80%;",
            "src": "../../" + entry["Image"],
            "data-aos": "fade-down",
            "class": "timeline-image"
        });

        card.append(btn);
        card.append(textContainer);

        dateContainer.append(title);
        dateContainer.append(date);
        btn.append(dateContainer);

        textContainer.append(paragraph);
        textContainer.append(image);

        $("#timeline").append(card);
    }

    /**
     * Generates timeline for a large client screen
     * @param color, color of the current timeline entry
     * @param entry, the current timeline entry
     * @param key, index of this entry on the all entries array
     */
    function generateLargeScreenTimeline(color, entry, key) {
        let orientation, oppositeOrientation;
        if (key % 2 === 0) {
            orientation = 'left';
            oppositeOrientation = 'right'
        } else {
            orientation = 'right';
            oppositeOrientation = 'left'
        }
        console.log('orient', orientation);
        let aosOffset = "0";
        let imgOffset = "-1.5%";
        if (orientation === "right") {
            aosOffset = "-10%";
            imgOffset = "-7.5%"
        }

        //container of all elements
        let container = $("<div />", {
            "class": "row w-100 no-gutters mb-5 align-items-center justify-content-center",
            "data-aos": "fade-" + orientation

        });
        //container of text
        let textContainer = $("<div />", {
            "class": "row w-50 d-flex align-items-center justify-content-center text-col-" + orientation,
            "style": "transform: translate(" + aosOffset + "); background-color: " + color
        });
        //container of date text
        let dateContainer = $("<div />", {
            "class": "col-80 no-gutters align-items-center justify-content-center timeline-date text-center",
        });
        //title text
        let title = $("<h3 />", {
            "class": "my-0 mx-3",
            "style": "font-size: 1.5em; font-family: var(--rubik); text-shadow: 0.05em 0.05em " + darkenColor(colorDict[color], -120) + "; color: " + color
        }).text(entry["Title"]);
        //date text
        let date = $("<h4 />", {
            "class": "mx-3",
            "style": "filter: brightness(50%); font-weight: bold; font-size: 1.1em; color: " + color
        }).text(entry["Date"]);
        //paragraph text
        let paragraph = $("<p />", {
            "class": "block-text text-" + orientation + " p-5",
            "style": "filter: brightness(20%); color: " + color + ";"
        }).text(entry["Text"]);
        //container of image
        let imageContainer = $("<div />", {
            "class": "col-lg-6 d-flex align-items-center justify-content-center",
            "style": "transform:translate(" + imgOffset + "); z-index: 100;"
        });
        //image element
        let image = $("<img />", {
            "src": "../../" + entry["Image"],
            "data-aos": "fade-" + oppositeOrientation,
            "class": "timeline-image"
        });

        textContainer.append(dateContainer);
        dateContainer.append(title);
        dateContainer.append(date);
        textContainer.append(paragraph);
        imageContainer.append(image);

        if (orientation === "right") {
            container.append(imageContainer);
        }
        container.append(textContainer);
        if (orientation === "left") {
            container.append(imageContainer)
        }
        let linePosition = "95%";
        if (orientation === "right") {
            linePosition = "5%";
        }
        let line = $("<div />", {"class": "vertical-line", "style": "left: " + linePosition});
        textContainer.append(line);

        $("#timeline").append(container);
    }
}

