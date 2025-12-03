
const message = "![Generated Image](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACA...some_long_base64_string...)";
const imageRegex = /!\[.*?\]\((data:image\/.*?;base64,.*?)\)/g;

let match = imageRegex.exec(message);
if (match) {
    console.log("Match found!");
    console.log("Captured group:", match[1].substring(0, 50) + "...");
} else {
    console.log("No match found.");
}

const messageWithNewlines = "![Generated Image](data:image/png;base64,\niVBORw0KGgoAAAANSUhEUgAABAAAAAQACA...some_long_base64_string...)";
let match2 = imageRegex.exec(messageWithNewlines);
if (match2) {
    console.log("Match found with newlines!");
} else {
    console.log("No match with newlines.");
}
