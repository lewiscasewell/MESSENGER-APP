import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { name, email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All data fields are required!" });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "Users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });

      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });

      navigate("/");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Center>
        <Heading>Create an account</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <Box m={4}>
          <label htmlFor="name">Name</label>
          <Input type="text" name="name" value={name} onChange={handleChange} />
          <label htmlFor="email">Email</label>
          <Input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </Box>

        {error ? (
          <Text m={4} color="red">
            {error}
          </Text>
        ) : null}

        <Center display="flex" flexDir="column">
          <Button onClick={handleSubmit} type="submit">
            {loading ? <Spinner /> : "Login"}
          </Button>
        </Center>
      </form>
      <Box m={4}>
        <Text>Already have an account?</Text>
        <Button
          variant="link"
          color="cyan.500"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
