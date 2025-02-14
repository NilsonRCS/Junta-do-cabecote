import React, { useState, useEffect, useCallback } from "react";
import { Marker, Polyline } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Container, StyledMap } from "./homescreenstyle";
import * as Location from "expo-location";
import Modal from "react-native-modal";
import { View, Text, Button } from "react-native";

const MOVEMENT_INTERVAL = 2000;

const HomeScreen = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [streetGeometry, setStreetGeometry] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setHasPermission(false);
          return;
        }

        setHasPermission(true);
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (currentLocation.coords.latitude && currentLocation.coords.longitude) {
          const { latitude, longitude } = currentLocation.coords;
          setLocation({ latitude, longitude });
          fetchStreetGeometry(latitude, longitude);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
      }
    };

    getLocation();
  }, []);

  const fetchStreetGeometry = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];way(around:50,${latitude},${longitude})[highway];out geom;`
      );
      const data = await response.json();
      if (data.elements.length > 0) {
        const way = data.elements[0];
        const coordinates = way.geometry.map((point: any) => ({ latitude: point.lat, longitude: point.lon }));
        setStreetGeometry(coordinates);

        if (coordinates.length > 1) {
          setCars((prevCars) => [
            prevCars.find(car => car.id === "1") || { id: "1", ...coordinates[0], title: "Carro 1", plate: "ABC-1234", color: "red", model: "Model X", direction: 1 },
            prevCars.find(car => car.id === "2") || { id: "2", ...coordinates[coordinates.length - 1], title: "Carro 2", plate: "XYZ-5678", color: "blue", model: "Model Y", direction: -1 }
          ]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar geometria da rua:", error);
    }
  };

  const moveCar = (car: any) => {
    const index = streetGeometry.findIndex(point => point.latitude === car.latitude && point.longitude === car.longitude);
    if (index !== -1) {
      let nextIndex = index + car.direction;
      if (nextIndex >= streetGeometry.length) nextIndex = streetGeometry.length - 2;
      if (nextIndex < 0) nextIndex = 1;
      return { ...car, latitude: streetGeometry[nextIndex].latitude, longitude: streetGeometry[nextIndex].longitude };
    }
    return car;
  };

  useEffect(() => {
    if (streetGeometry.length > 1) {
      const intervalId = setInterval(() => {
        setCars(prevCars => prevCars.map(moveCar));
      }, MOVEMENT_INTERVAL);

      return () => clearInterval(intervalId);
    }
  }, [streetGeometry]);

  const renderMarker = useCallback(
    (car: { id: string; latitude: number; longitude: number; title: string; color: string }) => (
      <Marker
        key={car.id}
        coordinate={{ latitude: car.latitude, longitude: car.longitude }}
        title={car.title}
        onPress={() => {
          setSelectedCar(car);
          setIsModalVisible(true);
        }}
      >
        <FontAwesome5 name="car" size={32} color={car.color} />
      </Marker>
    ),
    []
  );

  return (
    <Container>
      {location && (
        <StyledMap
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
        >
          {cars.map(renderMarker)}
          <Polyline coordinates={streetGeometry} strokeWidth={3} strokeColor="blue" />
        </StyledMap>
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{selectedCar?.title}</Text>
          <Text>Placa: {selectedCar?.plate}</Text>
          <Text>Cor: {selectedCar?.color}</Text>
          <Text>Modelo: {selectedCar?.model}</Text>
          <Button title="Fechar" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </Container>
  );
};

export default HomeScreen;
