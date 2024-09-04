//"AIzaSyAKOyMHZfi2ohBLCjxiOVx0-pz_kumZ-fA"

import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
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
  const [panelData, setPanelData] = useState({});
  const [currentInfoWindow, setCurrentInfoWindow] = useState(null);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      fetchBoardData();
    }
  }, [isLoaded]);

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

  const handleMarkerClick = (marker) => {
    const contentString = `
      <h1>${marker.info.Loc}</h1>
      <p><strong>Traffic:</strong> ${marker.info.Traffic}</p>
      <p><strong>Size:</strong> ${marker.info.BoardSize}</p>
    `;
    setPopupContent({
      position: marker.position,
      content: contentString,
    });
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => setMap(map)}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          onClick={() => handleMarkerClick(marker)}
          label={marker.id}
        />
      ))}
      {popupContent && (
        <InfoWindow
          position={popupContent.position}
          onCloseClick={() => setPopupContent(null)}
        >
          <div dangerouslySetInnerHTML={{ __html: popupContent.content }} />
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default Faces;
