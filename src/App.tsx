import { ChakraProvider, Container, extendTheme, Stack } from "@chakra-ui/react";
import * as React from "react";
import Auth from "./Components/Auth";
import ClipboardList from "./Components/ClipboardList";
import PaginationTool from "./Components/PaginationTool";
import PostFromClipboard from "./Components/PostFromClipboard";
import PostFromText from './Components/PostFromText';
import Toolbar from "./Components/Toolbar";
import { useData } from './libs/fns';


const theme = extendTheme({ config: { initialColorMode: "dark", useSystemColorMode: true } })

export const App = () => {
  const { updateData } = useData();

  React.useEffect(() => {
    if (window.location.href.includes('#')) {
      setTimeout(updateData, 2000);
    }
  }, [window.location]);


  return (
    <ChakraProvider theme={theme}>
      <Container textAlign="center" fontSize="xl" my={4}>
        {/* <ColorModeSwitcher /> */}
        <Stack spacing={4}>
          <div>
            <Auth />
            <Toolbar />
          </div>

          <PostFromText />
          <PostFromClipboard />
          <PaginationTool />
          <ClipboardList />
        </Stack>

      </Container>
    </ChakraProvider>
  )
}
