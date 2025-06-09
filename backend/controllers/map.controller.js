const mapService = require("../services/map.service");
const { validationResult } = require("express-validator");

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { address } = req.query;
  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { origin, destination } = req.query;
  try {
    const distanceTime = await mapService.getDistanceAndTime(origin, destination);
    res.status(200).json(distanceTime);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { input } = req.query;
  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
