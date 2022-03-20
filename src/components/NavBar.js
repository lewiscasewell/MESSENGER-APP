import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import {
  Avatar,
  Box,
  Button,
  Center,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { signOut } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import Camera from "./svg/Camera";
import Delete from "./svg/Delete";

const NavBar = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [img, setImg] = useState("");
  const [userCurrent, setUserCurrent] = useState();

  useEffect(() => {
    getDoc(doc(db, "Users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUserCurrent(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (userCurrent.avatarPath) {
            await deleteObject(ref(storage, userCurrent.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "Users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImg = async () => {
    try {
      const confirm = window.confirm("Delete avater?");
      if (confirm) {
        await deleteObject(ref(storage, userCurrent.avatarPath));

        await updateDoc(doc(db, "Users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSignout = async () => {
    await updateDoc(doc(db, "Users", auth.currentUser.uid), {
      isOnline: false,
    });
    signOut(auth);
    navigate("/login");
  };

  return (
    <Box w="100%">
      <Box
        bg="white"
        p={2}
        minW={["60em", "60em", "19.3em"]}
        alignItems="center"
        height="65px"
        zIndex={1}
        maxW={1000}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            name={user.name}
            src={user.avatar}
            onClick={onOpen}
            cursor="pointer"
          />
          <Text ml={4} fontWeight="extrabold">
            Messages
          </Text>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <DrawerHeader>Profile</DrawerHeader>
            <IconButton icon={<CloseButton />} mr={2} onClick={onClose} />
          </Box>
          <DrawerBody>
            <Box>
              <Box display="flex" alignItems="center" gridGap={1}>
                <Avatar size="xl" name={user.name} src={user.avatar} />

                <label htmlFor="photo">
                  <Camera />
                </label>
                {user.avatarPath ? <Delete deleteImg={deleteImg} /> : null}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="photo"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                  }}
                />
              </Box>

              <Box mt={4}>
                <Heading>{user.name}</Heading>
                <Text>{user.email}</Text>
                <Text fontSize="xs">
                  Joined on: {user.createdAt.toDate().toDateString()}
                </Text>
              </Box>

              <Center mt={10}>
                <Button onClick={handleSignout}>Logout</Button>
              </Center>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default NavBar;
