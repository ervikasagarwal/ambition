const preProcessTag = (string) => {
  string = string.replace(/[^a-zA-Z0-9. ]/g, '').trim().toLowerCase();
  console.log('preProcessed Name string', string);
  return string;
};

module.exports = {
  preProcessTag,
};
