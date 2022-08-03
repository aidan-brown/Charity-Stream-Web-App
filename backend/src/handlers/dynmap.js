const axios = require('axios');

module.exports = {
  dynmapGetPlayerIcon: async (req, res) => {
    const { playerName } = req.params;

    try {
      const response = await axios.default.get(`${process.env.MC_SERVER_DYNMAP}/tiles/faces/32x32/${playerName}.png`, {
        responseType: 'arraybuffer',
      });
      const img = Buffer.from(response.data, 'base64');

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    } catch (err) {
      const { response: { statusText } = {} } = err;

      res.status(500).send(statusText);
    }
  },
  dynmapGetData: async (_, res) => {
    try {
      const { data } = await axios.default.get(`${process.env.MC_SERVER_DYNMAP}/standalone/dynmap_lobbyWorld.json`);

      res.status(200).send(data);
    } catch (err) {
      const { response: { statusText } = {} } = err;

      res.status(500).send(statusText);
    }
  },
};
