const { locations } = require('./config');

const locationsInLowerCase = locations.map(value => value.toLowerCase().replace(' ', ''));

const processRemoveLocation = ((companyName) => {
  const [locationFound] = locationsInLowerCase.filter(location => (companyName.includes(location) ? location : null));
  if (locationFound !== null) {
    companyName = companyName.replace(locationFound, '');
  }
  return companyName;
});

const removeSuffixes = (string, strict = false) => {
  const domainNames = ['.com', '.in', '.co', '.gov', '.uk', '.net', '.org', '.io'];
  domainNames.forEach((domain) => {
    if (string.includes(domain)) {
      string = string.replace(domain, '');
    }
  });
  const companySuffixes = ['pvt', 'ltd', 'private', 'limited', 'inc.', 'inc', 'incorporated', 'corp', 'llc', '\.', 'limiited'];
  strict && companySuffixes.push('co', 'and co', '& co');

  companySuffixes.forEach((suffix) => {
    if (string.includes(suffix)) {
      string = string.replace(` ${suffix}`, '');
    }
  });
  return string;
};
const processCompany = ((string) => {
  const locationProccessedString = processRemoveLocation(string);
  console.info('locationProccessedString', locationProccessedString);
  const suffixProcessedString = removeSuffixes(locationProccessedString);
  console.info('suffixProcessedString', suffixProcessedString);
  return suffixProcessedString;
});
module.exports = {
  processCompany,
};
