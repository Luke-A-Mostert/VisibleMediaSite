//"AIzaSyAKOyMHZfi2ohBLCjxiOVx0-pz_kumZ-fA"

import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import markerIcon from "../assets/markertest.png";
import "../styles/Faces.css";
import Popup from "../components/Popups";

const MAP_LIBRARIES = ["places"];
var infoWindow;

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
  const [panelData, setPanelData] = useState({});
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      fetchBoardData();
    }
  }, [isLoaded]);

  const handleActiveMarker = useCallback(
    (marker) => {
      // Compare by id or unique identifier to avoid object reference issues
      if (marker.id === activeMarker?.id) {
        return;
      }
      setActiveMarker(marker);
    },
    [activeMarker]
  );

  const handleOnLoad = (marker) => {
    //console.log("marker: ", marker);
  };

  const fetchBoardData = () => {
    fetch("/Data/boards.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csv) => {
        const lines = csv.split("\n").filter((line) => line.trim() !== ""); // Split and filter out empty lines
        const newPanelData = {};

        lines.forEach((line, index) => {
          if (index === 0) return; // Skip header line

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

          if (values.length === 11) {
            const [
              ID,
              Lat,
              Long,
              Traffic,
              Loc,
              BoardSize,
              Img,
              Facing,
              Pricing,
              Illuminated,
              Description,
            ] = values;

            const boardId = ID.slice(0, -1);
            const panelId = ID.slice(-1);

            if (!newPanelData[boardId]) {
              newPanelData[boardId] = { Lat, Long, panels: {} };
            }
            newPanelData[boardId].panels[panelId] = {
              ID,
              Lat,
              Long,
              Traffic,
              Loc,
              BoardSize,
              Img,
              Facing,
              Pricing,
              Illuminated,
              Description,
            };
          } else {
            console.error(
              `Error parsing CSV line ${index + 1}: Incorrect number of values.`
            );
          }
        });
        setPanelData(newPanelData);
        initializeMarkers(newPanelData);
      })
      .catch((error) => console.error("Error fetching the CSV file:", error));
  };

  const initializeMarkers = (panelData) => {
    const newMarkers = [];

    Object.keys(panelData).forEach((boardId) => {
      const board = panelData[boardId];
      const firstPanel =
        board.panels["N"] ||
        board.panels["S"] ||
        board.panels["W"] ||
        board.panels["E"];
      newMarkers.push({
        position: { lat: parseFloat(board.Lat), lng: parseFloat(board.Long) },
        title: boardId,
        info: firstPanel,
        id: boardId,
      });
    });

    setMarkers(newMarkers);
  };

  const handleButtonClick = (panelId) => {
    console.log(`Button clicked for panel ${panelId}`);
    const panelInfo = panelData[activeMarker.id].panels[panelId];

    if (panelInfo) {
      const popupHtml = `
        <div class="popup-content">

        <h1>${panelInfo.Loc}</h1>
        <div class="images-container">
          <div class="image-item">
            <img src="Data/${panelInfo.Img}" alt="Billboard Image" />
            <p><strong>${panelInfo.Facing} Face</strong></p>
          </div>
          <div id="miniMap"></div>
        </div>
        <div class="description-box">
          <p>${panelInfo.Description}</p>
        </div>
        <div class="grid-container">
          <div class="grid-item"><strong>Board Number</strong><p>${panelInfo.ID}</p></div>
          <div class="grid-item"><strong>Traffic</strong><p>${panelInfo.Traffic}</p></div>
          <div class="grid-item"><strong>Board Size</strong><p>${panelInfo.BoardSize}</p></div>
          <div class="grid-item"><strong>Lat/Long</strong><p><a href="https://www.google.com/maps?q=${panelInfo.Lat},${panelInfo.Long}" target="_blank" rel="noopener noreferrer">${panelInfo.Lat}, ${panelInfo.Long}</a></p></div>
          <div class="grid-item"><strong>Pricing</strong><p>${panelInfo.Pricing}</p></div>
          <div class="grid-item"><strong>Illuminated</strong><p>${panelInfo.Illuminated}</p></div>
        </div>
      </div>
      `;
      setPopupContent(popupHtml);
      setShowPopup(true); // Show the popup
    }
  };

  const handleMapClick = () => {
    if (activeMarker) {
      setActiveMarker(null); // Close the InfoWindow
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  //const handlePanels = (activeMarker) => {
  //  const board = panelData[activeMarker.id];
  //  //console.log(board.panels);
  //
  //  var panelsArr = [];
  //  Object.keys(board.panels).forEach((panelId) => {
  //    panelsArr.push(board.panels[panelId]);
  //  });
  //
  //  const panel1 = panelsArr[0];
  //  const panel2 = panelsArr[1];
  //  setPanel(panelsArr);
  //};

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
            onLoad={handleOnLoad}
            onClick={() => handleActiveMarker(marker)}
            label={{
              text: marker.id, // Display ID as the label on the marker
              className: "custom-marker-label",
              color: "white",
            }}
            icon={{
              url: markerIcon,
              scaledSize: new google.maps.Size(20, 30),
            }}
          />
        ))}

        {activeMarker && (
          <InfoWindow
            position={activeMarker.position}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div class="custom-info-window">
              <div class="info-window-buttons">
                {/* Display buttons dynamically based on panels */}
                {Object.keys(panelData[activeMarker.id].panels).map(
                  (panelId) => (
                    <button
                      key={panelId}
                      class="info-window-button"
                      onClick={() => handleButtonClick(panelId)} // Correct React syntax
                    >
                      Show Panel {panelId}
                    </button>
                  )
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {showPopup && (
        <div className="custom-popup">
          <button onClick={closePopup} className="close-button">
            X
          </button>
          <div dangerouslySetInnerHTML={{ __html: popupContent }} />
        </div>
      )}
    </>
  ) : (
    <></>
  );
};

export default Faces;
