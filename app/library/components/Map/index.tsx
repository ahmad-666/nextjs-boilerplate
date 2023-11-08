//need 'leaflet' base library too
//*** for import this components in next.js:
//const Map = dynamic(() => import("../library/components/Map"), {ssr: false});
//props of <MapContainer> are immutable means if we change center,zoom,... after we init map those changes will not cause any re-render on map
//we can access to map instance via const map = useMap() and we can only use useMap,useMapEvents  from inside children of <MapContainer> ... that's because we create MapConsumer.tsx file
//for update props of <MapContainer> we need to do it from MapConsumer.tsx too

import {
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
//import L from "leaflet";
import { MapContainer, Popup, TileLayer } from "react-leaflet";
//1-will export many components like:
//MapContainer,TileLayer,LayerGroup,ZoomControl,Pane
//Marker,CircleMarker,Popup,Tooltip,Circle,Rectangle,Polygon,Polyline
//ImageOverlay,SVGOverlay,VideoOverlay,...
//2-we can also export prop types of any exported components like MapContainerProps,TileLayerProps,MarkerProps,PopupProps,TooltipProps,CircleProps,...
//3-export 3 hooks --> useMap,useMapEvent,useMapEvents
import MapConsumer from "./MapConsumer";
import MapMarker from "./MapMarker";
import ClientOnly from "../ClientOnly";
import type { MapProps, LatLng, Location, Id } from "./types";
import "leaflet/dist/leaflet.css";
import "./styles.scss";

export default function Map({
  //our own props
  width = "100%",
  height = 400,
  zIndex = 2,
  readonly = false,
  value, //[] , [{lat,lng}] , [{lat,lng},{lat,lng},...]
  //always use [{lat,lng}] even if multiple:false
  setValue,
  setCenter,
  setZoom,
  multiple = false,
  markerDraggable = true, //between markerDraggable,removeMarkerOnClick only one should be true
  removeMarkerOnClick = false, //between markerDraggable,removeMarkerOnClick only one should be true
  markerSize = [20, 30],
  selectZoom, //if we set it after each map click we zoom as much as this value , if not set it(undefined) map zoom will not change
  getUserLocation = false, //for working with GeoLocation api for ask to user's location
  popupJsx, //popup of each marker
  mapRef, //its not for access container DOM and its for access leaflet map instance
  className = "",
  //MapContainerProps
  center, //{lat,lng}
  zoom = 12, //between [0,18]
  zoomControl = true, //show plus,minus buttons for zoom
  minZoom = 8,
  maxZoom = 18,
  scrollWheelZoom = false, //true means wheel event on map will cause zoom on map and not page scroll
  dragging = true,
  whenReady,
  //we get ...rest from MapContainerProps ... it has things like:
  //touchZoom(Whether the map can be zoomed by touch-dragging with two fingers)
  //zoomAnimationThreshold(Won't animate zoom if the zoom difference exceeds this value)
  //doubleClickZoom,zoomSnap,fadeAnimation,keyboard,tap
  //bounds,boundsOptions,maxBounds,maxBoundsViscosity
  ...rest
}: MapProps) {
  const container = useRef<HTMLDivElement>(null!);
  const [loadMap, setLoadMap] = useState(true);
  const containerStyle = useMemo(() => {
    return {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
    };
  }, [width, height]);
  const mapClick = useCallback(
    (pos: LatLng) => {
      if (setValue) {
        const newPos: Location = { id: Math.random(), ...pos };
        if (!multiple) setValue([newPos]);
        else setValue([...value, newPos]);
      }
    },
    [multiple, value, setValue]
  );
  const mapMarkerMoveHandler = useCallback(
    (id: Id, e: L.LeafletEvent) => {
      if (setValue) {
        const newPos = e.target.getLatLng();
        const newValue = value.map((val) => {
          if (val.id === id) return { id, ...newPos };
          else return { ...val };
        });
        setValue(newValue);
      }
    },
    [value, setValue]
  );
  const mapMarkerClickHandler = useCallback(
    (id: Id) => {
      //on multiple if we click on map-marker we want to remove it
      if (setValue && removeMarkerOnClick) {
        setValue(value.filter((v) => v.id !== id));
      }
    },
    [value, removeMarkerOnClick, setValue]
  );
  useEffect(() => {
    container.current.style.setProperty("--map-zIndex", `${zIndex}`);
  }, [zIndex]);
  useLayoutEffect(() => {
    //without it leaflet will have error on each re-render that we init map multiple times
    setLoadMap(true);
    return () => {
      setLoadMap(false);
    };
  }, []);
  if (!loadMap) return null;
  return (
    <div
      ref={container}
      className={`${readonly ? "pointer-events-none" : ""} ${className}`}
      style={{
        ...containerStyle,
      }}
    >
      <ClientOnly>
        <MapContainer
          className="h-full w-full"
          ref={mapRef}
          style={{
            ...containerStyle,
            //remove it
          }}
          center={center}
          zoomControl={zoomControl}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          scrollWheelZoom={scrollWheelZoom}
          dragging={readonly ? false : dragging}
          whenReady={whenReady}
          {...rest}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapConsumer
            center={center}
            setCenter={setCenter}
            zoom={zoom}
            setZoom={setZoom}
            mapClick={mapClick}
            selectZoom={selectZoom}
            getUserLocation={getUserLocation}
          />
          {value.map((val, i) => (
            <MapMarker
              key={i}
              id={val.id}
              position={val}
              draggable={readonly ? false : markerDraggable}
              markerUrl={val.markerUrl}
              markerSize={markerSize}
              clickHandler={mapMarkerClickHandler}
              moveHandler={mapMarkerMoveHandler}
            >
              {popupJsx && popupJsx(val)}
            </MapMarker>
          ))}
        </MapContainer>
      </ClientOnly>
    </div>
  );
}
