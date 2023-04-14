import { createTheme } from "@mui/material";


const theme = createTheme({
    colors: {
      primary: '#0088ff',
      secondary: '#ffbb00',
      background: '#f8f8f8',
      text: '#333333',
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 16,
      fontWeight: {
        light: 300,
        regular: 400,
        bold: 700,
      },
    },
    Spacing :(factor) => `${factor}px`,
    mixins: {
      toolbar: {
        minHeight: '56px',
        '@media (min-width:0px) and (orientation: landscape)': {
          minHeight: '48px',
        },
        '@media (min-width:600px)': {
          minHeight: '64px',
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
      // up: (key) => `@media (min-width:${theme.breakpoints.values[key]}px)`,
      // down: (key) => `@media (max-width:${theme.breakpoints.values[key] - 1}px)`,
    },
  });
  
  export default theme;
  