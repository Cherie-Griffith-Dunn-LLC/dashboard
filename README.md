# Dashboard

## Deployment
### Web Deployment ![Web Deployment Workflow](https://github.com/Cherie-Griffith-Dunn-LLC/dashboard/actions/workflows/azure-static-web-apps-thankful-desert-05ea0e50f.yml/badge.svg?branch=main)
Commiting to the `main` branch will automatically deploy the web app to https://thankful-desert-05ea0e50f.2.azurestaticapps.net/

- To manually build and deploy the web app, run `npm run build`. Static files will be generated in the `web-build` directory.

## Development Enviroment
### Requirements
- Node.js
- Android Studio (for Android) or [Expo Go Client](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
- XCode (for iOS) or [Expo Go Client](https://itunes.apple.com/app/apple-store/id982107779)
- [VS Code Extension (optional)](https://marketplace.visualstudio.com/items?itemName=byCedric.vscode-expo)

### Running Development Server
- `npm install`
- `npm run start` or `npm run web`

Run the API locally by default on port 3000.

#### To open the app:
- On your Android device, press "Scan QR Code" on the "Home" tab of the Expo Go app and scan the QR code you see in the terminal.
- On your iPhone or iPad, open the default Apple "Camera" app and scan the QR code you see in the terminal.
- For web, press "w" in terminal then navigate to http://localhost:19006

### Technology Stack Documentation
- [React Native](https://reactnative.dev/docs/getting-started)
- [Expo](https://docs.expo.io/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [UI Kitten](https://akveo.github.io/react-native-ui-kitten/docs/getting-started/what-is-ui-kitten#what-is-ui-kitten)