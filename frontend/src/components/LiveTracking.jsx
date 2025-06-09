import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveTracking = ({ pickup, destination }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const clearRoute = () => {
    if (map.current && map.current.getSource("route")) {
      map.current.removeLayer("route-line");
      map.current.removeSource("route");
    }
  };

  useEffect(() => {
    const getCurrentPosition = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCurrentPosition([coords.longitude, coords.latitude]);
          setError(null);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to get current location");
          setCurrentPosition([0, 0]);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    };

    getCurrentPosition();
  }, []);

  const geocode = async (address) => {
    if (!address || !address.trim()) {
      throw new Error("Address is required");
    }

    try {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address.trim()
        )}.json`
      );
      url.searchParams.set("access_token", mapboxgl.accessToken);
      url.searchParams.set("limit", "1");
      url.searchParams.set("autocomplete", "false");
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Geocoding API error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates; 
      }
      
      throw new Error(`No location found for: ${address}`);
    } catch (err) {
      console.error("Geocoding error:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!pickup) {
      setPickupCoords(null);
      return;
    }

    setIsLoading(true);
    geocode(pickup)
      .then((coords) => {
        setPickupCoords(coords);
        setError(null);
      })
      .catch((err) => {
        console.error("Pickup geocoding failed:", err);
        setError(`Failed to find pickup location: ${pickup}`);
        setPickupCoords(null);
      })
      .finally(() => setIsLoading(false));
  }, [pickup]);

  useEffect(() => {
    if (!destination) {
      setDestinationCoords(null);
      return;
    }

    setIsLoading(true);
    geocode(destination)
      .then((coords) => {
        setDestinationCoords(coords);
        setError(null);
      })
      .catch((err) => {
        console.error("Destination geocoding failed:", err);
        setError(`Failed to find destination: ${destination}`);
        setDestinationCoords(null);
      })
      .finally(() => setIsLoading(false));
  }, [destination]);

  useEffect(() => {
    if (!pickupCoords || !destinationCoords) {
      setRouteGeoJSON(null);
      return;
    }

    const fetchRoute = async () => {
      setIsLoading(true);
      try {
        const [lng1, lat1] = pickupCoords;
        const [lng2, lat2] = destinationCoords;
        
        const url = new URL(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${lng1},${lat1};${lng2},${lat2}`
        );
        url.searchParams.set("access_token", mapboxgl.accessToken);
        url.searchParams.set("geometries", "geojson");
        url.searchParams.set("overview", "full");

        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`Directions API error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.routes && data.routes.length > 0) {
          setRouteGeoJSON(data.routes[0].geometry);
          setError(null);
        } else {
          throw new Error("No route found between pickup and destination");
        }
      } catch (err) {
        console.error("Route fetching failed:", err);
        setError("Failed to fetch route");
        setRouteGeoJSON(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [pickupCoords, destinationCoords]);

  useEffect(() => {
    if (map.current || !mapContainer.current || !currentPosition) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: currentPosition,
      zoom: 14,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-left');

    map.current.on('load', () => {
      console.log('Map loaded successfully');
    });

    map.current.on('error', (e) => {
      console.error('Map error:', e);
      setError('Map failed to load');
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [currentPosition]);

  useEffect(() => {
    if (!map.current) return;
    if (!map.current.isStyleLoaded()) return;

    clearMarkers();
    clearRoute();

    if (routeGeoJSON) {
      map.current.addSource("route", {
        type: "geojson",
        data: { 
          type: "Feature", 
          geometry: routeGeoJSON,
          properties: {}
        },
      });
      
      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { 
          "line-cap": "round", 
          "line-join": "round" 
        },
        paint: { 
          "line-width": 6, 
          "line-color": "#007cbf",
          "line-opacity": 0.8
        },
      });
    }

    if (pickupCoords) {
      const pickupMarker = new mapboxgl.Marker({ 
        color: "#10b981",
        scale: 1.2
      })
        .setLngLat(pickupCoords)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Pickup</strong><br/>${pickup || 'Pickup Location'}`))
        .addTo(map.current);
      
      markersRef.current.push(pickupMarker);
    }

    if (destinationCoords) {
      const destMarker = new mapboxgl.Marker({ 
        color: "#ef4444",
        scale: 1.2
      })
        .setLngLat(destinationCoords)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>Destination</strong><br/>${destination || 'Destination'}`))
        .addTo(map.current);
      
      markersRef.current.push(destMarker);
    }

    const bounds = new mapboxgl.LngLatBounds();
    let hasCoords = false;

    if (pickupCoords) {
      bounds.extend(pickupCoords);
      hasCoords = true;
    }
    if (destinationCoords) {
      bounds.extend(destinationCoords);
      hasCoords = true;
    }

    if (hasCoords) {
      map.current.fitBounds(bounds, { 
        padding: 80,
        maxZoom: 16,
        duration: 1000
      });
    }
  }, [routeGeoJSON, pickupCoords, destinationCoords, currentPosition, pickup, destination]);

  useEffect(() => {
    if (!map.current) return;

    const mapInstance = map.current;

    function addSourcesAndLayers() {
      if (routeGeoJSON) {
        if (!mapInstance.getSource("route")) {
          mapInstance.addSource("route", {
            type: "geojson",
            data: { 
              type: "Feature", 
              geometry: routeGeoJSON,
              properties: {}
            },
          });
        } else {
          mapInstance.getSource("route").setData({ 
            type: "Feature", 
            geometry: routeGeoJSON,
            properties: {}
          });
        }
        
        if (!mapInstance.getLayer("route-line")) {
          mapInstance.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { 
              "line-cap": "round", 
              "line-join": "round" 
            },
            paint: { 
              "line-width": 6, 
              "line-color": "#007cbf",
              "line-opacity": 0.8
            },
          });
        }
      }

      if (pickupCoords) {
        if (!mapInstance.getSource("pickup")) {
          mapInstance.addSource("pickup", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: pickupCoords
              },
              properties: {
                iconSize: 3,
                iconColor: "#10b981"
              }
            },
          });

          mapInstance.addLayer({
            id: "pickup",
            type: "circle",
            source: "pickup",
            paint: {
              "circle-radius": {
                stops: [
                  [12, 7],
                  [22, 180]
                ]
              },
              "circle-color": "#10b981",
              "circle-opacity": 0.8
            },
          });
        } else {
          mapInstance.getSource("pickup").setData({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: pickupCoords
            },
            properties: {
              iconSize: 3,
              iconColor: "#10b981"
            }
          });
        }
      }

      if (destinationCoords) {
        if (!mapInstance.getSource("destination")) {
          mapInstance.addSource("destination", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: destinationCoords
              },
              properties: {
                iconSize: 3,
                iconColor: "#ef4444"
              }
            },
          });

          mapInstance.addLayer({
            id: "destination",
            type: "circle",
            source: "destination",
            paint: {
              "circle-radius": {
                stops: [
                  [12, 7],
                  [22, 180]
                ]
              },
              "circle-color": "#ef4444",
              "circle-opacity": 0.8
            },
          });
        } else {
          mapInstance.getSource("destination").setData({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: destinationCoords
            },
            properties: {
              iconSize: 3,
              iconColor: "#ef4444"
            }
          });
        }
      }
    }

    if (mapInstance.isStyleLoaded()) {
      addSourcesAndLayers();
    } else {
      mapInstance.once('style.load', addSourcesAndLayers);
    }

    return () => {
      mapInstance.off('style.load', addSourcesAndLayers);
    };
  }, [routeGeoJSON, pickupCoords, destinationCoords, currentPosition, pickup, destination]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          Loading...
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '14px',
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
    </div>
  );
};

export default LiveTracking;