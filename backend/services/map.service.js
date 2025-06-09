const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinate = async (address) => {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  );
  
  if (!response.data.features || response.data.features.length === 0) {
    throw new Error('Address not found');
  }
  
  const coordinates = response.data.features[0].geometry.coordinates;
  return {
    ltd: coordinates[1], 
    lng: coordinates[0], 
  };
};

module.exports.getDistanceAndTime = async (origin, destination) => {
  let originCoords, destCoords;
  
  if (origin.includes(',') && !isNaN(origin.split(',')[0])) {
    originCoords = origin;
  } else {
    const originGeocode = await module.exports.getAddressCoordinate(origin);
    originCoords = `${originGeocode.lng},${originGeocode.ltd}`;
  }
  
  if (destination.includes(',') && !isNaN(destination.split(',')[0])) {
    destCoords = destination;
  } else {
    const destGeocode = await module.exports.getAddressCoordinate(destination);
    destCoords = `${destGeocode.lng},${destGeocode.ltd}`;
  }
  
  const response = await axios.get(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords};${destCoords}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  );
  
  if (!response.data.routes || response.data.routes.length === 0) {
    throw new Error('Route not found');
  }
  
  const route = response.data.routes[0];
  return {
    distance: {
      text: `${(route.distance / 1000).toFixed(1)} km`,
      value: route.distance 
    },
    duration: {
      text: `${Math.round(route.duration / 60)} mins`,
      value: route.duration 
    },
    status: 'OK'
  };
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?autocomplete=true&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  );
  
  const suggestions = response.data.features.map(feature => ({
    description: feature.place_name,
    place_id: feature.id,
    structured_formatting: {
      main_text: feature.text,
      secondary_text: feature.place_name.replace(feature.text + ', ', '')
    }
  }));
  
  return {
    predictions: suggestions,
    status: 'OK'
  };
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  const captains = await captainModel.find({}); 
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  const filteredCaptains = captains.filter(captain => {
    if (!captain.location || captain.location.ltd == null || captain.location.lng == null) return false;
    const distance = getDistanceFromLatLonInKm(
      ltd, lng,
      captain.location.ltd, captain.location.lng
    );
    return distance <= radius;
  });

  return filteredCaptains;
};