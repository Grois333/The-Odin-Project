const convertToCelsius = function(fahrenheit) {
  if (typeof fahrenheit !== 'number') {
    return 'ERROR';
  }
  const celsius = (fahrenheit - 32) * 5/9;
  return parseFloat(celsius.toFixed(1));
};

const convertToFahrenheit = function(celsius) {
  if (typeof celsius !== 'number') {
    return 'ERROR';
  }
  const fahrenheit = (celsius * 9/5) + 32;
  return parseFloat(fahrenheit.toFixed(1));
};

// Do not edit below this line
module.exports = {
  convertToCelsius,
  convertToFahrenheit
};
