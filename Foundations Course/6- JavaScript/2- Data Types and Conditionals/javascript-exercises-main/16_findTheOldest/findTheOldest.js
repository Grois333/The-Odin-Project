const findTheOldest = function() {
    const people = arguments[0];

    const currentYear = new Date().getFullYear();

    let oldestPerson = people.reduce((oldest, person) => {
        const oldestAge = (oldest.yearOfDeath || currentYear) - oldest.yearOfBirth;
        const personAge = (person.yearOfDeath || currentYear) - person.yearOfBirth;

        return personAge > oldestAge ? person : oldest;
    });

    return oldestPerson;
};

// Do not edit below this line
module.exports = findTheOldest;
