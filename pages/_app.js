import { AppWrapper } from '../state';
import { ChakraProvider, CSSReset, ColorModeProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: '#00501e',
        background: '#e5ffbd',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  )
}

export default MyApp
