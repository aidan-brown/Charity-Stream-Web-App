const getImages = (req, res) => {
    const { type, image } = req.params;
    res.sendFile(`./${type.toLowerCase()}/${image.toLowerCase()}`, { root: __dirname });
};

module.exports = {
    getImages,
};
