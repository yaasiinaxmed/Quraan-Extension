window.onload = function() {
    const createDate = {
        url: "background.html",
        type: "popup",
        width: 1300,
        height: 700,
    };
    chrome.windows.create(createDate, () => {});
}