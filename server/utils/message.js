const moment = require('moment');

const generateMessage = function (from, text) {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

const generateLocationMessage = function (from, latitude, longitude) {
  return {
    from,
    url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage};
