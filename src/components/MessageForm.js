import { ArrowRightIcon, AttachmentIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Input, Textarea } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import Attachment from "./svg/Attachment";
import autosize from "autosize";

const MessageForm = ({ handleSubmit, text, setText, img, setImg }) => {
  const textRef = useRef();
  useEffect(() => {
    autosize(textRef.current);
    return () => {
      autosize.destroy(textRef.current);
    };
  }, []);
  return (
    <Box
      bottom="30px"
      position="relative"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="end"
      bg="white"
      pt={1}
      borderTopWidth="1px"
      borderTopColor="gray.200"
    >
      <form className="message_form" onSubmit={handleSubmit}>
        {/* <label htmlFor="img">
        <AttachmentIcon />
      </label>
      <IconButton icon={<AttachmentIcon />} type="file">
        <input
          type="file"
          id="img"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
      </IconButton>

      <Input
        variant="filled"
        placeholder="Type here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div>
        <button className="btn">Send</button>
      </div> */}

        <IconButton rounded="full" icon={<AttachmentIcon />} ml={1} />

        <Textarea
          variant="filled"
          rounded="25px"
          mx={1}
          minH="unset"
          resize="none"
          minRows={2}
          maxRows={4}
          overflow="hidden"
          transition="height none"
          maxH="100px"
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <IconButton rounded="full" icon={<ArrowRightIcon />} mr={1} as="form" />
      </form>
    </Box>
  );
};

export default MessageForm;
