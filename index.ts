import { registerRootComponent } from "expo";
// import firebase from "@react-native-firebase/app";

// console.log("Firebase initialized:", firebase.app().name); // "default"

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
