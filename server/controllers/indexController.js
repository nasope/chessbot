const path = require('path');

exports.index = (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
};
