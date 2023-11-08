import L from "leaflet";
import { Marker } from "react-leaflet";
import type { MapMarkerProps } from "./types";
import markerIcon from "leaflet/dist/images/marker-icon-2x.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
//by default marker icon will not be loaded and we need to do it manually

export default function MapMarker({
  //our own props
  id,
  markerUrl,
  markerSize,
  className = "",
  //props tha will be added via MarkerProps
  position, //location of marker
  draggable = true,
  clickHandler,
  moveHandler,
  children,
  ...rest
}: MapMarkerProps) {
  if (!position) return null;
  return (
    <Marker
      eventHandlers={{
        click: (e) => {
          clickHandler(id);
        },
        moveend: (e) => {
          moveHandler(id, e);
        },
      }}
      position={position}
      draggable={draggable}
      icon={L.icon({
        iconUrl: markerUrl || markerIcon.src,
        iconSize: markerSize,
        // shadowUrl: markerShadow.src,
        className,
      })}
      {...rest}
    >
      {children}
    </Marker>
  );
}
