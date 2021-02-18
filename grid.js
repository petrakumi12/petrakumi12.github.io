let curCol = 1;
let ID_LENGTH = 5;

/**
 * Updates column grid with elements from inputted array
 * @param data, array with required information to generate elements
 * @param type, type of elements to generate. either "image" or "card"
 */
function updateGrid(data, type) {
    console.log(data.length);
    // data = data.slice(0,2);
    let oneElement = data.pop();
    while (oneElement !== undefined) {
        addOneElement(oneElement, type);
        oneElement = data.pop();
    }
}


function addOneElement(oneElement, type) {
    console.log(curCol);
    if (type === "image") {
        let el = addOnePhoto(oneElement);
        $("#col" + curCol).append(el);

    } else {
        if (type === "card") {
            el = generateEntryCard(oneElement);
            $("#col" + curCol).append(el);
            assignCardHeight(el);
            window.addEventListener("resize", function () {
                console.log("resize");
                assignCardHeight(el);
            });
        }
    }

    if (curCol < 3) {
        curCol += 1;
    } else {
        curCol = 1;
    }
}

/**
 * Restores value of variable curCol to 1
 */
function restoreCurColNo() {
    curCol = 1;
}