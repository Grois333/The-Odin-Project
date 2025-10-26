const add7 = (num) => num + 7;

const multiply = (a, b) => a * b;

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const lastLetter = (str) => (str ? str[str.length - 1] : '');

// Tests (open DevTools console)
console.log('add7(10) ->', add7(10));             // 17
console.log('multiply(3, 2) ->', multiply(3, 2)); // 6
console.log('capitalize("abcd") ->', capitalize("abcd")); // Abcd
console.log('capitalize("ABCD") ->', capitalize("ABCD")); // Abcd
console.log('capitalize("aBcD") ->', capitalize("aBcD")); // Abcd
console.log('lastLetter("abcd") ->', lastLetter("abcd")); // d