// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const MetroConfig = require('@ui-kitten/metro-config');

const config = getDefaultConfig(__dirname);

const evaConfig = {
    evaPackage: '@eva-design/eva',
    customMappingPath: './assets/mapping.json'
};

// pass

module.exports = MetroConfig.create(evaConfig, config);
