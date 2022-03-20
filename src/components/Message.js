import { Box, HStack, Text } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import Moment from "react-moment";

const Message = ({ msg, userCurrent }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  return (
    <Box
      w="100%"
      verticalAlign="middle"
      display="flex"
      justifyContent={msg.from === userCurrent ? "flex-end" : "flex-start"}
    >
      <Box
        bg={msg.from === userCurrent ? "cyan.500" : "gray.100"}
        borderRadius="10px"
        py={1}
        px={2}
        ref={scrollRef}
        m={1}
        textAlign={msg.from === userCurrent ? "right" : "left"}
        w="max-content"
        maxW="23em"
        position="relative"
      >
        {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        <Text>
          {msg.text}
          <span style={{ fontSize: "10px" }}>
            {" "}
            - sent <Moment fromNow>{msg.createdAt.toDate()}</Moment>
          </span>
        </Text>
      </Box>
    </Box>
  );
};

export default Message;
