import React, {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { mapStyles } from "@/styles/mapStyles";
import { Colors } from "@/utils/Constants";
import { calculateLiveETA, calculateSpeedKmH } from "@/utils/eta";
import { calculateDistance } from "@/utils/mapUtils";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2hhd25mZXJuczAwNDI2IiwiYSI6ImNtbG5kdXc1OTBtMzczZHM4Z2N4dmljNDEifQ.O-Qws66r_yOYWrPNmn2gng";

Mapbox.setAccessToken(MAPBOX_TOKEN);

type Props = {
  status: string;
  location: any;
  worker: any;
  type: string;
};

const WorkerLiveTracking: FC<Props> = ({ status, location, worker }) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
  const lastRouteFetch = useRef<number>(0);
  const [accessGeoJSON, setAccessGeoJSON] = useState<any>(null);
  const [workerAccessGeoJSON, setWorkerAccessGeoJSON] = useState<any>(null);
  const prevLocation = useRef<any>(null);
const [eta, setEta] = useState<number | null>(null);

  const toCoord = (p: any) => [p.longitude, p.latitude];

  /* ---------------- ROUTE FETCH (THROTTLED) ---------------- */

  const fetchRoute = useCallback(async () => {
    if (!location?.latitude || !worker?.latitude) return;

    // prevent hitting mapbox every gps update
    const now = Date.now();
    if (now - lastRouteFetch.current < 15000) return; // 15 sec throttle
    lastRouteFetch.current = now;

    try {
      const start = `${worker.longitude},${worker.latitude}`;
      const end = `${location.longitude},${location.latitude}`;

      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}` +
        `?geometries=geojson&overview=full&annotations=congestion&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.routes?.length) return;

      const coords = json.routes[0].geometry.coordinates;

      const workerActual = [worker.longitude, worker.latitude];
      const roadStart = coords[0];
      const roadEnd = coords[coords.length - 1];
      const destinationActual = [location.longitude, location.latitude];

      /* 1️⃣ main road route */
      setRouteGeoJSON({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
      });

      /* 2️⃣ worker → road */
      setWorkerAccessGeoJSON({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [workerActual, roadStart],
        },
      });

      /* 3️⃣ road → building */
      setAccessGeoJSON({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [roadEnd, destinationActual],
        },
      });
      // Fit camera when route first loads
      cameraRef.current?.fitBounds(
        coords[0],
        coords[coords.length - 1],
        80,
        900,
      );
    } catch (e) {
      console.log("Route error:", e);
    }
  }, [location?.latitude, worker?.latitude]);

  /* Fetch route only when job becomes active */


  useEffect(() => {
  if (!worker?.latitude) return;

  const now = Date.now();

  if (prevLocation.current) {
    const speed = calculateSpeedKmH(
      prevLocation.current,
      { lat: worker.latitude, lng: worker.longitude, time: now }
    );

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      worker.latitude,
      worker.longitude
    );

    const etaMin = calculateLiveETA(distance, speed);
    setEta(etaMin);
  }

  prevLocation.current = {
    lat: worker.latitude,
    lng: worker.longitude,
    time: now,
  };
}, [worker?.latitude, worker?.longitude]);

  useEffect(() => {
    if (["ASSIGNED", "ARRIVED", "IN_PROGRESS"].includes(status)) {
      fetchRoute();
    }
  }, [status]);

  /* ---------------- SMOOTH CAMERA FOLLOW ---------------- */

  useEffect(() => {
    if (!worker?.latitude) return;

    cameraRef.current?.setCamera({
      centerCoordinate: toCoord(worker),
      zoomLevel: 16,
      pitch: 45,
      heading: worker?.heading || 0,
      animationDuration: 700,
    });
  }, [worker?.latitude, worker?.longitude]);

  /* ---------------- RENDER ---------------- */

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={process.env.EXPO_PUBLIC_MAP_URL!}
        compassEnabled={false}
        logoEnabled={false}
        rotateEnabled
        pitchEnabled
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={14}
          centerCoordinate={
            location?.latitude ? toCoord(location) : [77.209, 28.6139]
          }
        />

        {/* WORKER MARKER — NO FLICKER */}
        {worker?.latitude && (
          <Mapbox.MarkerView coordinate={toCoord(worker)}>
            <Image
              source={
                worker.type === "electrician"
                  ? require("@/assets/icons/electrician.png")
                  : require("@/assets/icons/plumber.png")
              }
              style={{
                width: 32,
                height: 32,
              }}
            />
          </Mapbox.MarkerView>
        )}

        {/* DESTINATION */}
        {location?.latitude && (
          <Mapbox.MarkerView coordinate={toCoord(location)}>
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ width: 20, height: 32 }}
            />
          </Mapbox.MarkerView>
        )}

        {/* WORKER ACCESS SEGMENT */}
        {workerAccessGeoJSON && (
          <Mapbox.ShapeSource id="workerAccess" shape={workerAccessGeoJSON}>
            <Mapbox.LineLayer
              id="workerAccessLine"
              style={{
                lineWidth: 4,
                lineDasharray: [2, 2],
                lineColor: "#64748b",
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* ROAD ROUTE */}
        {routeGeoJSON && (
          <Mapbox.ShapeSource id="routeSource" shape={routeGeoJSON} lineMetrics>
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineWidth: 6,
                lineCap: "round",
                lineJoin: "round",
                lineGradient: [
                  "interpolate",
                  ["linear"],
                  ["line-progress"],
                  0,
                  "#22c55e",
                  1,
                  "#16a34a",
                ],
              }}
            />
          </Mapbox.ShapeSource>
        )}
        {/* ACCESS (ALLEY) SEGMENT */}
        {accessGeoJSON && (
          <Mapbox.ShapeSource id="accessSource" shape={accessGeoJSON}>
            <Mapbox.LineLayer
              id="accessLine"
              style={{
                lineWidth: 4,
                lineDasharray: [2, 2],
                lineColor: "#64748b",
              }}
            />
          </Mapbox.ShapeSource>
        )}
      </Mapbox.MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fetchRoute}>
        <Text>Recenter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(WorkerLiveTracking);
