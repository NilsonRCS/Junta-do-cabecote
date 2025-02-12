import React, { useState, useEffect, useCallback } from "react";
import { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import { Container, StyledMap } from "./homescreenstyle";
import * as Location from "expo-location";
import Modal from "react-native-modal";
import { View, Text, Button } from "react-native";

const HomeScreen = () => {
  const [cars, setCars] = useState([
    {
      id: "1",
      latitude: -23.55052,
      longitude: -46.633308,
      title: "Carro 1",
      plate: "ABC-1234",
      color: "red",
      model: "Model X",
    },
    {
      id: "2",
      latitude: -23.55152,
      longitude: -46.632308,
      title: "Carro 2",
      plate: "XYZ-5678",
      color: "blue",
      model: "Model Y",
    },
  ]);

  const [location, setLocation] = useState<null | { latitude: number; longitude: number }>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const defaultLocation = {
    latitude: -23.55052,
    longitude: -46.633308,
  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setHasPermission(true);
          const currentLocation = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

          if (currentLocation.coords.latitude && currentLocation.coords.longitude) {
            setLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            });
          } else {
            setLocation(defaultLocation);
          }
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        setLocation(defaultLocation);
      }
    };

    getLocation();
  }, []);

  const generateCarLocation = useCallback((baseLatitude: number, baseLongitude: number) => {
    const latitudeOffset = (Math.random() - 0.5) * 0.001;
    const longitudeOffset = (Math.random() - 0.5) * 0.001;

    return {
      latitude: baseLatitude + latitudeOffset,
      longitude: baseLongitude + longitudeOffset,
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (location) {
        setCars((prevCars) =>
          prevCars.map((car) => {
            const newLocation = generateCarLocation(location.latitude, location.longitude);
            return { ...car, latitude: newLocation.latitude, longitude: newLocation.longitude };
          })
        );
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [location, generateCarLocation]);

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

  if (!hasPermission || location === null) {
    return (
      <Container>
        <StyledMap
          initialRegion={{
            latitude: defaultLocation.latitude,
            longitude: defaultLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {cars.map(renderMarker)}
        </StyledMap>
      </Container>
    );
  }

  return (
    <Container>
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
      </StyledMap>

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
