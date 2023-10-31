import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImages, setCapturedImages] = useState([]);
  const [location, setLocation] = useState(null);
  const db = SQLite.openDatabase("images.db");
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (locationStatus.status === "granted") {
        const locationData = await Location.getCurrentPositionAsync({});
        setLocation(locationData);
      }
    })();
  }, []);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT, location TEXT);",
        [],
        () => {
          console.log('Successfully created table "images"');
        },
        (txObj, error) => {
          console.log('Error creating table "images":', error);
        }
      );
    });
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(null);
      const imageUri = photo.uri;

      const fileName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      const newPath = FileSystem.documentDirectory + fileName;
      await FileSystem.moveAsync({ from: imageUri, to: newPath });

      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO images (uri, location) VALUES (?, ?);",
          [newPath, JSON.stringify(location)],
          (txObj, resultSet) => {
            if (resultSet.insertId) {
              console.log("Image saved to database");
            } else {
              console.log("Failed to save image to database");
            }
          },
          (txObj, error) => {
            console.log("Error saving image to database:", error);
          }
        );
      });

      const imageWithLocation = { uri: newPath, location };
      setCapturedImages([...capturedImages, imageWithLocation]);
    }
  };

  const navigateToGallery = () => {
    navigation.navigate("Images", { capturedImages });
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={{ flex: 1 }} type={type} ratio="1:1" />
      <View style={styles.cameraControls}>
        <FontAwesome
          name="camera-retro"
          size={30}
          style={styles.flipIcon}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
        <FontAwesome
          name="image" // Gallery icon
          size={30}
          style={styles.galleryIcon}
          onPress={navigateToGallery}
        />
        <FontAwesome
          name="camera"
          size={30}
          style={styles.captureIcon}
          onPress={takePicture}
        />
      </View>
      {capturedImages.length > 0 && (
        <Button
          title="Gallery"
          onPress={navigateToGallery}
        />
      )}
      {location && location.address && (
        <Text style={styles.locationText}>{location.address}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  flipIcon: {
    color: "black",
  },
  galleryIcon: {
    color: "black",
  },
  captureIcon: {
    color: "black",
  },
  locationText: {
    textAlign: "center",
  },
});

export default CameraScreen;