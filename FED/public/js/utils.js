// cleans string to each word being initial caps
function initialCaps(inputStr) {
    inputStr = inputStr.toLowerCase();
    inputStr = inputStr.split(" ");
    var outputStr = "";
    for (var i = 0; i < inputStr.length; i++) {
        outputStr += inputStr[i].charAt(0).toUpperCase() + inputStr[i].slice(1) + " ";
    }
    return outputStr;
}