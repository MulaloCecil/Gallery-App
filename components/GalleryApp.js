import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Image
        style={styles.backgroundImage}
        source={require('../assets/gallery.png')}
      />
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Camera')}
      />
    </View>
  );
};

const CameraScreen = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setCapturedImages([...capturedImages, data.uri]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={{ flex: 1 }}
        type={type}
        ratio={'1:1'}
      />
      <View style={styles.cameraControls}>
        <FontAwesome
          name="camera-retro"
          size={40}
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
          name="camera"
          size={40}
          style={styles.captureIcon}
          onPress={takePicture}
        />
      </View>
      {capturedImages.length > 0 && (
        <Button
          title="View Images"
          onPress={() => navigation.navigate('Images', { capturedImages })}
        />
      )}
    </View>
  );
};

const ImageScreen = ({ route, navigation }) => {
  const { capturedImages } = route.params;

  return (
    <View style={styles.imageScreenContainer}>
      <FlatList
        data={capturedImages}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate('ImagePreview', { imageUri: item })
            }>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item }} />
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const ImagePreviewScreen = ({ route }) => {
  const { imageUri } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Image style={{ flex: 1 }} source={{ uri: imageUri }} />
    </View>
  );
};

const GalleryScreen = ({ imagelist }) => {
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: item.image }} />
      {item.location && (
        <Text>
          Latitude: {item.location.coords.latitude}, Longitude:{' '}
          {item.location.coords.longitude}
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

const Stack = createStackNavigator();

export default function App() {
  const [imagelist, setImagelist] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
        <Stack.Screen name="ImagePreview" component={ImagePreviewScreen} />
        <Stack.Screen
          name="Gallery"
          component={() => <GalleryScreen imagelist={imagelist} />}
          options={{
            headerRight: () => (
              <Button
                title="View Images"
                onPress={() =>
                  imagelist.length > 0
                    ? navigation.navigate('ImageScreen', {
                        capturedImages: imagelist,
                      })
                    : null
                }
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  flipIcon: {
    color: 'white',
  },
  captureIcon: {
    color: 'white',
  },
  imageScreenContainer: {
    flex: 1,
  },
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
