module.exports = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (_) {
    return obj;
  }
};
