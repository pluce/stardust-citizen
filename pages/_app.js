import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react"
import theme from "../app/theme"
import GA from "../app/GA"

function MyApp({ Component, pageProps }) {
  return <ChakraProvider theme={theme}>
    <Component {...pageProps} />
    <GA/>
  </ChakraProvider>
}

export default MyApp
