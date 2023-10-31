import React from 'react';
import { View, Image, Text, FlatList, StyleSheet } from 'react-native';

const GalleryScreen = ({ route }) => {
  const { imagelist } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: item.image }} />
      {item.location && (
        <Text>
          Latitude: {item.location.coords.latitude}, Longitude: {item.location.coords.longitude}
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={imagelist}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default GalleryScreen;
