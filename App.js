import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./components/Home";
import CameraScreen from "./components/Camera";
import ImageScreen from "./components/Images";
import ImagePreviewScreen from "./components/Preview";
import GalleryScreen from "./components/Gallery";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Images" component={ImageScreen} />
        <Stack.Screen name="Preview" component={ImagePreviewScreen} />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ title: "Gallery" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
