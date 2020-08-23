import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, AppState } from "react-native";
import * as Location from "expo-location";
import MapView, { Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import RBSheet from "react-native-raw-bottom-sheet";
import { EventEmitter } from "fbemitter";
import * as turf from "@turf/turf";

import { Loader } from "../components/Lottie.component";
import { MaskModal } from "../components/MaskModal.component";

import { getDataset, getPolygons } from "./dataset";
import { LOCATION_TASK_NAME, LOCATION_UPDATE } from "../constants";

import { askNotification, submitNotification } from "../tasks/notifications";
import BackgroundTask from "../tasks";

const eventEmitter = new EventEmitter();
BackgroundTask(eventEmitter);

export default function App() {
  const [region, setRegion] = useState(null);
  const [state, setAppState] = useState("active");
  const [shouldWearMask, setShouldWearMask] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dataset, setDataset] = useState(null);
  const [polygons, setPolygons] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    var eventSubscription;
    (async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
        }
        let position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const {
          coords: { latitude, longitude },
        } = position;
        setLocAndRegion({ latitude, longitude });
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationBody: "Paris Masqué suit votre position",
            notificationTitle:
              "Nous pouvons ainsi vous informer lorsque vous entrez dans une zone où le masque est obligatoire.",
          },
        });
      } catch (err) {
        console.log(err);
      }
    })();
    (async () => {
      try {
        await askNotification();
      } catch (err) {
        console.log(err);
      }
    })();
    (async () => {
      console.log("fetching dataset");
      const dataset = await getDataset();
      setPolygons(getPolygons(dataset));
      setDataset(dataset);
    })();

    eventSubscription = eventEmitter.addListener(LOCATION_UPDATE, (data) => {
      console.log("event received", data);
      setLocAndRegion(data);
    });
    AppState.addEventListener("change", setAppState);
    return () => {
      AppState.removeEventListener("change", setAppState);
      eventSubscription.remove();
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    };
  }, []);

  useEffect(() => {
    console.log("region", region);
    if (region) {
      const { latitude, longitude } = region;
      const isWear = checkIfMaskRequired({ latitude, longitude });
      if (shouldWearMask !== isWear) {
        setShouldWearMask(isWear);
        console.log("isWear", isWear);
      }
    }
  }, [region]);

  useEffect(() => {
    (async () => {
      try {
        if (shouldWearMask) {
          return state === "active"
            ? modalRef.current.open()
            : submitNotification();
        }
        return modalRef.current.close();
      } catch (err) {
        console.log(err);
      }
    })();
  }, [shouldWearMask]);

  const setLocAndRegion = (coords) => {
    setRegion({
      ...coords,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const checkIfMaskRequired = ({ latitude, longitude }) => {
    return !!(
      polygons &&
      polygons.find((poly) => {
        return turf.booleanPointInPolygon(
          turf.point([longitude, latitude]),
          turf.polygon(poly)
        );
      })
    );
  };

  const isReady = region !== null && dataset !== null;

  return (
    <View style={styles.container}>
      <Loader visible={!isReady} />
      {isReady && (
        <MapView
          style={styles.mapStyle}
          initialRegion={region}
          region={region}
          minZoomLevel={12}
          provider={PROVIDER_GOOGLE}
          cacheEnabled
          showsUserLocation
          showsMyLocationButton={true}
        >
          <Geojson
            geojson={dataset}
            strokeColor="black"
            fillColor="rgba(255, 0, 50, 0.6)"
            strokeWidth={2}
          />
        </MapView>
      )}
      <RBSheet
        ref={modalRef}
        customStyles={{
          mask: { backgroundColor: "transparent" },
          container: { elevation: 100, borderRadius: 15 },
        }}
      >
        <MaskModal />
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
