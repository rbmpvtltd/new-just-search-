"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function GoMap({latitude,longitude,title}:{latitude:string|null|undefined,longitude:string|null|undefined,title:string|null|undefined}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const center = { lat: Number(latitude), lng: Number(longitude) };

  return (
    <div className="md:w-[80%] w-full mx-auto md:h-[400px] h-[200px]">
      <GoogleMap
        zoom={15}
        center={center}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        <Marker position={center} title={title??""} />

      </GoogleMap>
    </div>
  );
}