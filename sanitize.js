// string sanitization wrapper lib
// by oran collins
// github.com/wisehackermonkey
// oranbusiness@gmail.com
// 20200611


exports.text = function (text) {
    // explanation of magic regex
    // https://regexr.com/56ium  
    // only includes a-z , A-Z , numbers, and spaces
    let safe_string = text.replace(/[^a-zA-Z0-9 ]/g, "");
    //console.log(text);
    //console.log(safe_string);
    return safe_string;
};
