const constants = require("../constants");

const randomAvatarColor = () => constants.avatar.COLORS[Math.floor(Math.random() * constants.avatar.COLORS.length)];

module.exports = {
    randomAvatarColor,
}