"use client";

import { MapContainer, Marker, Popup, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
const ICON = icon({
  iconUrl: "/images/icon-location.svg",
  iconSize: [46, 56],
});

function UpdateMapCentre(props: any) {
  const map = useMap();
  map.panTo(props.mapCentre);
  return null;
}


export default function MyMap(props: any) {

    const { position, zoom } = props
  return (
      <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
          style={{ height: "calc(100vh - 300px)" }}
          zoomControl={false}
    >
      <UpdateMapCentre mapCentre={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={ICON}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <ZoomControl position="bottomright" />
    </MapContainer>
  );
}
