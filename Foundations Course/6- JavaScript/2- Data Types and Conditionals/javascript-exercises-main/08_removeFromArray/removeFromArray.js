const removeFromArray = function() {
    const arr = arguments[0];
    const valuesToRemove = Array.from(arguments).slice(1);
    return arr.filter(item => !valuesToRemove.includes(item));
};

// Do not edit below this line
module.exports = removeFromArray;
