import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import * as SQLite from "expo-sqlite";

const ImageScreen = ({ route, navigation }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const db = SQLite.openDatabase("images.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM images;",
        [],
        (_, { rows }) => {
          const data = rows._array;
          setImages(data);
        },
        (txObj, error) => {
          console.log("Error retrieving images from database:", error);
        }
      );
    });
  }, []);

  return (
    <View style={styles.imageScreenContainer}>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate("Preview", { imageUri: item.uri })
            }
          >
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.uri }} />
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />

      <TouchableOpacity
        title="Back to Camera"
        onPress={() => navigation.navigate("Camera")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageScreenContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
});

export default ImageScreen;
