import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import markerIcon from "../assets/markertest.png";
import "../styles/Faces.css";

const MAP_LIBRARIES = ["places"];

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 41.450864,
  lng: -87.52645,
};

const Faces = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAKOyMHZfi2ohBLCjxiOVx0-pz_kumZ-fA", // Replace with your API key
    libraries: MAP_LIBRARIES,
  });

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [showMapKey, setShowMapKey] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      fetchBoardData();
    }
  }, [isLoaded]);

  const fetchBoardData = () => {
    fetch("/Data/newboards.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csv) => {
        const lines = csv.split("\n").filter((line) => line.trim() !== "");
        const newMarkers = [];

        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header line

          // Handle CSV parsing for 5 columns: ID, Img, Lat, Long, Name
          let values = [];
          let insideQuotes = false;
          let currentValue = "";

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === "," && !insideQuotes) {
              values.push(currentValue.trim());
              currentValue = "";
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim());

          if (values.length >= 4) {
            // Handle both 4-column and 5-column formats
            const [ID, Img, Lat, Long, Name = `Location ${ID}`] = values;

            newMarkers.push({
              position: {
                lat: parseFloat(Lat),
                lng: parseFloat(Long),
              },
              title: ID,
              id: ID,
              name: Name,
              image: Img,
            });
          } else {
            console.error(
              `Error parsing CSV line ${
                index + 1
              }: Expected at least 4 values, got ${values.length}`
            );
          }
        });

        setMarkers(newMarkers);
      })
      .catch((error) => console.error("Error fetching the CSV file:", error));
  };

  const handleMarkerClick = (marker) => {
    if (marker.image) {
      // Check if the image path already includes "Data/" or if it's just the filename
      const imagePath = marker.image.startsWith("Data/")
        ? marker.image
        : `Data/${marker.image}`;
      setSelectedFlyer(imagePath);
      setShowPopup(true);
    }
  };

  const handleKeyLocationClick = (marker) => {
    // Same function as marker click but triggered from the key
    handleMarkerClick(marker);

    // Optional: Pan the map to the selected location
    if (map) {
      map.panTo(marker.position);
      map.setZoom(12);
    }
  };

  const handleMapClick = () => {
    // Close popup when clicking on map
    if (showPopup) {
      setShowPopup(false);
      setSelectedFlyer(null);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedFlyer(null);
  };

  const toggleMapKey = () => {
    setShowMapKey(!showMapKey);
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)}
            label={{
              text: marker.id.toString(),
              className: "custom-marker-label",
              color: "white",
            }}
            icon={{
              url: markerIcon,
              scaledSize: new google.maps.Size(20, 30),
            }}
          />
        ))}
      </GoogleMap>

      {/* Map Key Panel */}
      <div
        className={`map-key-panel ${
          showMapKey ? "map-key-open" : "map-key-closed"
        }`}
      >
        <div className="map-key-header">
          <h3>Billboard Locations</h3>
          <button className="map-key-toggle" onClick={toggleMapKey}>
            {showMapKey ? "−" : "+"}
          </button>
        </div>
        {showMapKey && (
          <div className="map-key-content">
            {markers.map((marker, index) => (
              <div
                key={index}
                className="map-key-item"
                onClick={() => handleKeyLocationClick(marker)}
              >
                <div className="key-item-main">
                  <span className="key-marker-id">{marker.id}</span>
                  <span className="key-location-name">{marker.name}</span>
                </div>
                <span className="key-location-coords">
                  {marker.position.lat.toFixed(4)},{" "}
                  {marker.position.lng.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Flyer Image Popup */}
      {showPopup && selectedFlyer && (
        <div className="flyer-popup" onClick={closePopup}>
          <div className="flyer-container" onClick={(e) => e.stopPropagation()}>
            <button onClick={closePopup} className="close-button">
              ×
            </button>
            <img
              src={selectedFlyer}
              alt="Billboard Flyer"
              className="flyer-image"
              onError={(e) => {
                console.error(`Failed to load image: ${selectedFlyer}`);
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default Faces;
