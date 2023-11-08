import L from "leaflet";
import type { MapContainerProps, MarkerProps } from "react-leaflet";

export type Id = number | string;
export type LatLng = {
  lat: number;
  lng: number;
};
export type Location = {
  id: Id;
  markerUrl?: string;
} & LatLng;
export type MapProps = {
  width?: number | string;
  height?: number | string;
  zIndex?: number;
  readonly?: boolean;
  value: Location[];
  setValue?: (newVal: Location[]) => void;
  setCenter?: (newVal: LatLng) => void;
  setZoom?: (newVal: number) => void;
  multiple?: boolean;
  markerDraggable?: boolean;
  removeMarkerOnClick?: boolean;
  markerSize?: [number, number];
  selectZoom?: number;
  getUserLocation?: boolean;
  popupJsx?: (location: Location) => React.ReactNode;
  mapRef?: React.MutableRefObject<L.Map>;
  className?: string;
} & Omit<MapContainerProps, "className" | "style" | "ref">;
export type MapMarkerProps = {
  id: Id;
  markerUrl?: string;
  clickHandler: (id: Id) => void;
  moveHandler: (id: Id, e: L.LeafletEvent) => void;
  className?: string;
} & Pick<MapProps, "markerSize"> &
  Omit<MarkerProps, "icon">;
export type MapConsumerProps = {
  mapClick: (newVal: LatLng) => void;
} & Pick<
  MapProps,
  "center" | "setCenter" | "zoom" | "setZoom" | "selectZoom" | "getUserLocation"
>;
