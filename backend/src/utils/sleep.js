module.exports = async (ms, callback) => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  callback();
};
