import React from 'react';

export const ThemeContext = React.createContext({
    themeMode: 'light',
    toggleTheme: () => {},
});