import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import * as React from "react";
import Auth from "./Components/Auth";
import ClipboardList from "./Components/ClipboardList";
import PaginationTool from "./Components/PaginationTool";
import PostFromClipboard from "./Components/PostFromClipboard";
import PostFromText from './Components/PostFromText';
import Toolbar from "./Components/Toolbar";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}

const theme = extendTheme({ config })

export const App = () => (
  <ChakraProvider theme={theme}>
    <Container textAlign="center" fontSize="xl" my={4}>
      {/* <ColorModeSwitcher /> */}

      <Auth />
      <Toolbar />
      <PostFromText />
      <PostFromClipboard />
      <PaginationTool />
      <ClipboardList />

    </Container>
  </ChakraProvider>
)
