//looks like this will not work on chrome+http --> we can test it on https or on firefox

import { useCallback, useEffect, useState } from "react";

type Option = {
  enableHighAccuracy?: boolean; //can result in slower response,increased power consumption
  maximumAge?: number; //in milliseconds of a possible cached position , 0 for no-cache
  timeout?: number; //in milliseconds , time that device is allowed to take in order to return a position
};
type Coord = {
  lat: number;
  lng: number;
};
type Error = {
  code: number;
  message: string;
};
const DEFAULT_ENABLE_HIGH_ACCURACY = false;
const DEFAULT_MAXIMUM_AGE = 0;
const DEFAULT_TIMEOUT = 60000;
const useGeoLocation = (
  {
    enableHighAccuracy = DEFAULT_ENABLE_HIGH_ACCURACY,
    maximumAge = DEFAULT_MAXIMUM_AGE,
    timeout = DEFAULT_TIMEOUT,
  }: Option = {
    enableHighAccuracy: DEFAULT_ENABLE_HIGH_ACCURACY,
    maximumAge: DEFAULT_MAXIMUM_AGE,
    timeout: DEFAULT_TIMEOUT,
  }
) => {
  const [coords, setCoords] = useState<Record<string, number> | Coord>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Record<string, any> | Error>({});
  const successHandler = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords; //also has altitude,accuracy,speed,... infos too
    setLoading(false);
    setError({});
    setCoords({
      lat: latitude,
      lng: longitude,
    });
  }, []);
  const errorHandler = useCallback((e: GeolocationPositionError) => {
    //also we have e.PERMISSION_DENIED , e.POSITION_UNAVAILABLE
    const { code, message } = e;
    setLoading(false);
    setError({
      code,
      message,
    });
    setCoords({});
  }, []);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy,
      maximumAge,
      timeout,
    });
    const id = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      { enableHighAccuracy, maximumAge, timeout }
    );
    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, [enableHighAccuracy, maximumAge, timeout, successHandler, errorHandler]);
  return {
    loading,
    error,
    coords,
  };
};
export default useGeoLocation;
