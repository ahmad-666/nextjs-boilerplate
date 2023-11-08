//some utility method on map:
// mapRef.current.getCenter() //get center
// mapRef.current.setCenter({lat,lng}); //set center
// mapRef.current.setZoom(8); //set zoom
// mapRef.current.getZoom() //get zoom
// mapRef.current.setView(newCenter, newZoom); //for update center,zoom without any animation
// mapRef.current.panTo({lat,lng}, {
//   duration: 1, //in seconds
// }); //for set center , can add duration for animation
// mapRef.current.flyTo({ lat: 10, lng: 20 }, 11, {
//   duration: 0.3,
// }); //for set center,zoom , can add duration for animation

import { useRef, useState } from "react";
import { Popup } from "react-leaflet";
import L from "leaflet";
import dynamic from "next/dynamic";
import type { Location } from "./types";
const Map = dynamic(() => import("."), {
  //for using <Map> we must use 'dynamic' method with ssr:false
  ssr: false,
  //loading: () => <p>Loading...</p>,
});

export default function TestComp() {
  const [pos, setPos] = useState<Location[]>([]); //[{id,lat,lng}] //even for multiple:false we use array
  const [poses, setPoses] = useState<Location[]>([
    {
      id: 1,
      lat: 36.28794054419182,
      lng: 59.6169662475586,
      markerUrl: "/imgs/img-1.jpg",
    },
    { id: 2, lat: 36.2912, lng: 59.6067, markerUrl: "/imgs/img-2.jpg" },
  ]);
  const [center, setCenter] = useState({
    lat: 36.28794054419182,
    lng: 59.6169662475586,
  });
  const [zoom, setZoom] = useState(12);
  const mapRef = useRef<L.Map>(null!);
  return (
    <div>
      <h1>
        1-Single map that will zoom after select new location on map + it has
        custom popup jsx for marker
      </h1>
      <Map
        width="100%"
        height={400}
        value={pos}
        setValue={(newVal) => setPos(newVal)}
        center={{ lat: 36.2972, lng: 59.6067 }}
        zoom={14}
        minZoom={8}
        maxZoom={18}
        selectZoom={16}
        multiple={false}
        scrollWheelZoom={false}
        popupJsx={(location) => {
          return (
            <Popup
              maxWidth={300}
              maxHeight={200}
              offset={[0, 0]} //change position of popup
              autoClose //popup will close if another popup opens
              keepInView //prevent users from panning the popup off of the screen while it is open
              eventHandlers={
                {
                  //just lick <Marker> eventHandlers
                }
              }
            >
              <div>
                <h3 className="text-primary">
                  {location.lat}-{location.lng}
                </h3>
              </div>
            </Popup>
          );
        }}
      />

      <h1>
        2-Multiple map that we can remove marker when we click on them + we can
        control zoom,center from parent
      </h1>
      <button
        onClick={() => {
          const newCenter = { lat: 37.2972, lng: 59.6067 };
          const newZoom = 10;
          setCenter(newCenter);
          setZoom(newZoom);
          mapRef.current.setView(newCenter, newZoom); //for update center,zoom without any animation
        }}
      >
        click
      </button>
      <Map
        width="100%"
        height={200}
        mapRef={mapRef}
        value={poses}
        setValue={(newVal) => setPoses(newVal)}
        center={center}
        setCenter={(newCenter) => setCenter(newCenter)}
        zoom={zoom}
        setZoom={(newZoom) => setZoom(newZoom)}
        multiple
        dragging
        markerDraggable={false}
        removeMarkerOnClick
      />
    </div>
  );
}
