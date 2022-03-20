import React, { useEffect, useRef, useState } from "react";
import autosize from "autosize";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import User from "../components/User";
import Message from "../components/Message";
import NavBar from "../components/NavBar";

import {
  Avatar,
  Box,
  Heading,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowRightIcon,
  AttachmentIcon,
} from "@chakra-ui/icons";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [user, setUser] = useState();

  const userCurrent = auth.currentUser.uid;

  useEffect(() => {
    const usersRef = collection(db, "Users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [userCurrent]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);

  // get currentUser data from firebase
  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
  }, []);

  const selectUser = async (user) => {
    setChat(user);

    window.scrollTo(0, document.body.scrollHeight);

    const userChat = user.uid;
    const id =
      userCurrent > userChat
        ? `${userCurrent + userChat}`
        : `${userChat + userCurrent}`;

    const msgsRef = collection(db, "Messages", id, "Chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message between logged in user and selected user
    const docSnap = await getDoc(doc(db, "LastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== userCurrent) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "LastMsg", id), {
        unread: false,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userChat = chat.uid;

    const id =
      userCurrent > userChat
        ? `${userCurrent + userChat}`
        : `${userChat + userCurrent}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const downloadURL = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = downloadURL;
    }

    await addDoc(collection(db, "Messages", id, "Chat"), {
      text,
      from: userCurrent,
      to: userChat,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(db, "LastMsg", id), {
      text,
      from: userCurrent,
      to: userChat,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });

    setText("");
  };

  const textRef = useRef();
  useEffect(() => {
    autosize(textRef.current);
    return () => {
      autosize.destroy(textRef.current);
    };
  }, []);

  return user ? (
    <>
      {!chat && (
        <Box h="100vh" display="flex" maxW={1000} margin="0 auto">
          <Box
            display={["flex", "flex", "flex"]}
            flexDir="column"
            p={2}
            borderRightWidth={1}
            borderRightColor="gray.200"
            position="fixed"
            top={0}
            bottom={0}
            overflowY="scroll"
            w="100%"
            maxW={[null, null, "20em"]}
          >
            <Box bg="white" position="fixed" zIndex={1}>
              <NavBar user={user} />
            </Box>
            <Box mt="65px" position="relative">
              {users.map((user) => (
                <User
                  key={user.uid}
                  user={user}
                  selectUser={selectUser}
                  userCurrent={userCurrent}
                  chat={chat}
                />
              ))}
            </Box>
          </Box>

          {/* Right column for large screens */}
          <Box bg="white" w="40em" display={["none", "none", "flex"]} ml="20em">
            <Box mt={80} w="20em" m="auto">
              <Heading>You don't have a message selected</Heading>
              <Text>
                Choose one from your existing messages, or start a new one.
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {chat && (
        // top box
        <Box h="100vh" display="flex" maxW={1000} margin="0 auto">
          {/* Left column */}
          <Box
            display={["none", "none", "flex"]}
            flexDir="column"
            p={2}
            borderRightWidth={1}
            borderRightColor="gray.200"
            position="fixed"
            top={0}
            bottom={0}
            overflowY="scroll"
            w="100%"
            maxW="20em"
          >
            <Box bg="white" position="fixed" zIndex={1}>
              <NavBar user={user} />
            </Box>
            <Box mt="65px" position="relative">
              {users.map((user) => (
                <User
                  key={user.uid}
                  user={user}
                  selectUser={selectUser}
                  userCurrent={userCurrent}
                  chat={chat}
                />
              ))}
            </Box>
          </Box>

          {/* Right column */}
          <Box
            h="100vh"
            display="flex"
            flexDir="column"
            w={["100%"]}
            bg="white"
            ml={[0, 0, "20em"]}
            borderRightWidth="1px"
            borderRightColor="gray.200"
          >
            <Box
              display="flex"
              alignItems="center"
              w="100%"
              maxW="42.4em"
              borderBottom="1px"
              borderBottomColor="gray.200"
              p={2}
              position="fixed"
              bg="white"
              zIndex={1}
            >
              <IconButton
                size="sm"
                ml={4}
                icon={<ArrowBackIcon />}
                rounded="full"
                onClick={() => setChat("")}
              />
              <Avatar name={chat.name} src={chat.avatar} size="sm" ml={4} />
              <Heading ml={2} size="sm" w="100%">
                {chat.name}
              </Heading>
            </Box>
            <Box h="100%" mt="49px" mb="30px" overflow="scroll">
              {msgs.length
                ? msgs.map((msg, idx) => (
                    <Message key={idx} msg={msg} userCurrent={userCurrent} />
                  ))
                : null}
            </Box>
            <form onSubmit={handleSubmit}>
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
                <label
                  htmlFor="img"
                  style={{
                    marginBottom: "10px",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                >
                  <AttachmentIcon />
                  {/* <IconButton
                    rounded="full"
                    icon={<AttachmentIcon />}
                    ml={1}
                    htmlFor="img"
                  /> */}
                </label>
                <input
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                  }}
                  type="file"
                  id="img"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {/* <Textarea
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
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                /> */}
                <Input
                  variant="filled"
                  rounded="25px"
                  mx={1}
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                  placeholder="Type here..."
                />
                <IconButton
                  rounded="full"
                  icon={<ArrowRightIcon />}
                  mr={1}
                  onClick={handleSubmit}
                />
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </>
  ) : null;
};

export default Home;
