//for register events like click,...
//we can only use hooks like useMap(access to map api),useMapEvents(register events) from children of <MapContainer> so we cannot use these hooks inside /index.tsx where we use <MapContainer> and we need to create another react component and use these hooks inside children of <MapContainer>

import { useCallback, useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { LatLng, MapConsumerProps } from "./types";

export default function MapConsumer({
  center,
  setCenter,
  zoom = 12,
  setZoom,
  mapClick,
  selectZoom,
  getUserLocation = false,
}: MapConsumerProps) {
  const map = useMap(); //access to map api , it has many methods,properties
  useMapEvents({
    //these events are on map not on marker , popup , ...
    //leaflet has events for load,update,error,unload,resize,mouse,drag,keyboard,popup,...
    click(e) {
      addMarker(e.latlng);
    },
    locationfound(e) {
      //fires after we use 'map.locate()'(Geolocation api) and we get user's location
      addMarker(e.latlng);
    },
    locationerror(err) {
      //fires if we there is a problem with Geolocation api
    },
    zoomend(e) {
      //we use 'zoomend' because 'zoom' will execute multiple times
      if (setZoom) setZoom(map.getZoom());
    },
    moveend(e) {
      //we don't use 'move' because move will fire repeatedly
      //we don't use 'dragend' because dragend is only for dragging and not for times we use .pan(),.flyTo(),...
      if (setCenter) setCenter(map.getCenter());
    },
  });
  const addMarker = useCallback(
    (location: LatLng) => {
      mapClick({ ...location });
      map.flyTo(location, selectZoom || map.getZoom()); //whenever we click on map change center,zoom level of map
    },
    [map, selectZoom, mapClick]
  );
  useEffect(() => {
    if (getUserLocation) {
      map.locate(); //Geolocation api , first ask for user permission
    }
  }, [getUserLocation, map]);
  return <></>;
}
