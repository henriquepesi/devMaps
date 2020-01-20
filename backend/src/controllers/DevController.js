const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      res.json({ error: "usuario existente" });
    }

    const apiRes = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    let { name = login, avatar_url, bio } = apiRes.data;

    // console.log(name, avatar_url, bio, techs);

    const techsArray = techs.split(",").map(tech => tech.trim());

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    return res.json(dev);
  }
};
