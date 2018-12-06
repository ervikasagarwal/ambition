const jwt = require('jsonwebtoken');

function generateKey(user) {
  const key = jwt.sign({ user }, 'this is my secret key', { expiresIn: '15d' });
  return key;
}
function verifyKey(keyFromClint) {
  try {
    jwt.verify(keyFromClint, 'this is my secret key');
    return true;
  } catch (err) {
    return false;
  }
}
module.exports = {
  generateKey,
  verifyKey,
};
