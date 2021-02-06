let photoData;
let lastS3PhotoIdx = 0;
newS3PhotoIdx = 20;
let rangeLength = 10;
let heightThresholdVal = 0.1;
let stopProcessing = false;
let processing = false;
let lastScrollTop = false;
let curCol = 1;
let ID_LENGTH = 5;
let photoSizes = [100, 300, 500, 750, 1000, 1500, 2500];

//generates url of lambda function api gateway that interacts with s3
let getS3Url = () => "https://wj1wgxo5k7.execute-api.us-east-2.amazonaws.com/test/getsampleimage?start=" + lastS3PhotoIdx + "&end=" + newS3PhotoIdx + "&size=" + updatePhotoSize();

window.onload = function () {

    //add listener for esc key on photo load
    $(document).keyup(function (e) {
        if (e.key === "Escape") {
            closeNav()
        }
    });

    //add listener on window resize
    window.addEventListener('resize', e => {
        updatePhotoSize();
    });

    AOS.init();

    //update and load photos onto dom
    updatePhotoSize();
    loadMorePhotos();
    isSmallScreen() ? loadMorePhotos() : null;
    handleUserScroll();
};

/**
 * Loads photos from s3 to dom
 */
function loadMorePhotos() {
    showLoadingIcon();
    if (!processing && !stopProcessing) {
        processing = true;
        getPhotoLinks()
            .then(_ => {
                if (photoData.length > 0) {
                    updatePhotoIdx();
                    updatePhotoGrid();
                    hideLoadingIcon();
                    processing = false;
                }
                else {
                    stopProcessing = true;
                }
            });
    }
    if (stopProcessing) {
        hideLoadingIcon();
    }

}

/**
 * Calls lambda function to get link of photos stored on s3
 */
async function getPhotoLinks() {
    await fetch(getS3Url(), {
        method: 'GET',
        headers: {'content-type': 'application/json'}
    })
        .then(response => response.json())
        .then(response => {
            console.log("urls", response["urls"]);
            photoData = response["urls"];
        });
}

/**
 * Adds all new photos and only shows them once adding has finished
 */
function updatePhotoGrid() {
    console.log(photoData.length);
    let onePhoto = photoData.pop();
    while (onePhoto !== undefined) {
        addOnePhoto(onePhoto);
        onePhoto = photoData.pop();
    }
}

/**
 * Adds one photo to dom
 */
function addOnePhoto(link) {
    console.log(curCol);
    let uuid = makeId(ID_LENGTH);
    let image = $("<img />", {
        "src": link,
        "class": "w-100 p-0 my-1",
        "id": uuid,
        "data-aos": "zoom-in",
        "onclick": "openNav(this)"
    });
    $("#col" + curCol).append(image);
    if (curCol < 3) {
        curCol += 1;
    } else {
        curCol = 1;
    }
}

/**
 * Updates last index to the index of the last photo previously retrieved from s3 and the new one to
 * last + number of photos we want to load at a time
 */
function updatePhotoIdx() {
    lastS3PhotoIdx = newS3PhotoIdx;
    newS3PhotoIdx = lastS3PhotoIdx + rangeLength;
}

/**
 * Add scroll listener that calls functions to check if user is scrolling down and if 80% of the doc is reached
 */
function handleUserScroll() {
    $(window).scroll(function () {
        if (isUserScrollDown()) {
            if (detectBottomReached()) {
                loadMorePhotos();
            }
        }
    })
}

/**
 * Checks if bottom of document is reached by user
 * @return True if bottom user has scrolled to 80% of the document height, False otherwise
 */
function detectBottomReached() {
    let curUserLocation = ($(document).scrollTop() + $(window).height());
    let heightThreshold = $(document).height() * heightThresholdVal;
    return curUserLocation >= heightThreshold;

}

/**
 * Check if user is currently scrolling down.
 * @return True if user scrolls down, false is user scrolls up
 */
function isUserScrollDown() {
    let curScrollTop = $(window).scrollTop();
    if (curScrollTop > lastScrollTop) {
        return true;
    }
    lastScrollTop = curScrollTop;
    return false;
}

/**
 * Shows loading icon in the dom
 */
function showLoadingIcon() {
    console.log('showing loading');
    $("#loadingIcon").show();
}

/**
 * Hides loading icon from the dom
 */
function hideLoadingIcon() {
    console.log('hiding loading');
    $("#loadingIcon").hide();
}

/**
 * Makes unique id of inputted length
 * @return the generated uuid
 */
function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 *  Open when someone clicks on the span element
 */
function openNav(element) {
    console.log("open nav called");
    let nav = $("#myNav");
    nav.css("width", "100%");
    let zoomedImg = element.cloneNode();
    let div = $("<div />", {
        class: "col-12 h-100 d-flex align-items-center justify-content-center"
    });
    nav.append(div);
    div.append(zoomedImg);
    zoomedImg.removeEventListener("click", openNav, false);
    console.log('width, height', element.width, element.height);
    if (element.width < element.height) {
        zoomedImg.style.maxWidth = updatePhotoSize() + 'px';
    } else {
        zoomedImg.style.maxHeight = updatePhotoSize() + 'px';
    }
    zoomedImg.style.objectFit = 'contain';
}

/**
 * Close when someone clicks on the "x" symbol inside the overlay
 */
function closeNav() {

    let nav = $("#myNav");
    nav.css("width", "0");
    nav.empty();
}

/**
 * Changes size of photo based on size of client screen
 * return new image size
 */
function updatePhotoSize() {

    let windowSize = Math.min(window.innerWidth, window.innerHeight);
    console.log("threshold is", windowSize);
    for (let i = 0; i < photoSizes.length; i++) {
        if (photoSizes[i] > windowSize) {
            console.log("size", photoSizes[i - 1]);
            return photoSizes[i - 1];
        }
    }
}
