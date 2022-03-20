import React, { useEffect, useState } from "react";
import Img from "../image1.png";
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

      {/* <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>

            {data?.from !== userCurrent && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === userCurrent ? "Me" : null}</strong>
            {data.text}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div> */}
    </>
  );
};

export default User;
