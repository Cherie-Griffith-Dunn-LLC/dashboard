# Dashboard

## Development Enviroment
### Requirements
- Node.js
- Android Studio (for Android) or [Expo Go Client](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
- XCode (for iOS) or [Expo Go Client](https://itunes.apple.com/app/apple-store/id982107779)
- [VS Code Extension (optional)](https://marketplace.visualstudio.com/items?itemName=byCedric.vscode-expo)

### Running Development Server
- `npm install`
- `npx expo start`

For USM API credentials, replace `usmCredentials` in `screens/LoginScreen.js` with your credentials in the format of `username:secret`.

#### To open the app:
- On your Android device, press "Scan QR Code" on the "Home" tab of the Expo Go app and scan the QR code you see in the terminal.
- On your iPhone or iPad, open the default Apple "Camera" app and scan the QR code you see in the terminal.
- For web, press "w" in terminal then navigate to http://localhost:19006

### Technology Stack Documentation
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.io/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/docs/getting-started/what-is-ui-kitten#what-is-ui-kitten)