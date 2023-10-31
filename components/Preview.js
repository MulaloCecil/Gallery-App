import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as SQLite from "expo-sqlite";

const ImagePreviewScreen = ({ route }) => {
  const { imageUri, location } = route.params;
  const [address, setAddress] = useState(null);

  useEffect(() => {
    if (location) {
      Location.reverseGeocodeAsync(location.coords).then((addresses) => {
        const address = addresses[0];
        const fullAddress = `${address.street} ${address.city}, ${address.region}, ${address.postalCode}`;
        setAddress(fullAddress);
      });
    }
  }, [location]);

  const handleDeleteImage = () => {
    // Implement image deletion logic here
    // For example, you can remove the image from your data or storage
    // After deletion, you can navigate back to the ImageScreen or GalleryScreen
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: imageUri }}
        resizeMode="contain"
      />
      {address && <Text style={styles.locationText}>Location: {address}</Text>}
      
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
        <FontAwesome name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    height: "95%",
    width: "100%",
  },
  locationText: {
    margin: 10,
    fontSize: 16,
    color: "red",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default ImagePreviewScreen;
