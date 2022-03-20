import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Avatar, AvatarBadge, Box, Text } from "@chakra-ui/react";
import Moment from "react-moment";

const User = ({ user, selectUser, userCurrent, chat }) => {
  const userChat = user?.uid;
  const [data, setData] = useState("");

  const id =
    userCurrent > userChat
      ? `${userCurrent + userChat}`
      : `${userChat + userCurrent}`;

  useEffect(() => {
    let unsub = onSnapshot(doc(db, "LastMsg", id), (doc) => {
      setData(doc.data());
    });
    console.log(data);
    return () => unsub();
  }, []);

  return (
    <>
      <Box
        p={2}
        w="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg={chat.name === user.name ? "cyan.500" : "white"}
        borderRadius={chat.name === user.name ? 10 : 0}
        mb={2}
        onClick={() => selectUser(user)}
      >
        <Box display="flex" alignItems="center">
          <Avatar name={user.name} src={user.avatar}>
            <AvatarBadge
              boxSize="1.1em"
              bg={user.isOnline ? "green.500" : "tomato"}
            />
          </Avatar>
          <Box ml={1}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              display="flex"
              alignItems="center"
            >
              {user.name}
              {data?.from !== userCurrent && data?.unread ? (
                <Box w="10px" h="10px" bg="red" ml={2} rounded="full" />
              ) : null}
            </Text>
            <Text fontSize="sm" noOfLines={1}>
              {data?.text}
            </Text>
          </Box>
        </Box>

        {data ? (
          <Text fontSize="xs" mr={1} minW={10}>
            <Moment format="MMM DD">{data.createdAt.toDate()}</Moment>
          </Text>
        ) : null}
      </Box>
    </>
  );
};

export default User;
