import { Box, Center, Spinner } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <Box m="auto" height="100vh">
      <Center>
        <Spinner mt="40vh" size="xl" />
      </Center>
    </Box>
  );
};

export default Loading;
