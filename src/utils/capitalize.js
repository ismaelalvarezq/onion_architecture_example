const capitalize = (sentence) => {
    let words = sentence.toLowerCase().split(" ");
    words = words.map((word) => word[0].toUpperCase() + word.substr(1));
    return words.join(" ");
};

module.exports = {
    capitalize,
}