import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { SpinnerIcon } from "@chakra-ui/icons";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All data fields are required!" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "Users", result.user.uid), {
        isOnline: true,
      });

      setData({
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
        <Heading>Log in to your account</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <Box m={4}>
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
        <Text>Don't have an account?</Text>
        <Button
          variant="link"
          color="cyan.500"
          onClick={() => navigate("/register")}
        >
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
