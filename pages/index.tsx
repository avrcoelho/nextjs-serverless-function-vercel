// import Head from 'next/head'
import React, { useCallback, useState, FormEvent } from "react";
import { Flex, Input, Button, Text } from "@chakra-ui/core";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function Home() {
  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleSignUpToNewsletter = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      await axios.post("/api/subscribe", {
        email,
        recaptchaToken,
      });
    },
    [email, recaptchaToken]
  );

  const onChangeCaptcha = useCallback((token: string) => {
    setRecaptchaToken(token);
  }, []);

  return (
    <Flex as="main" height="100vh" justifyContent="center" alignItems="center">
      <Flex
        as="form"
        onSubmit={handleSignUpToNewsletter}
        backgroundColor="gray.700"
        borderRadius="md"
        flexDir="column"
        alignItems="stretch"
        padding={8}
        marginTop={4}
        width="100%"
        maxW="400px"
      >
        <Text
          textAlign="center"
          fontSize="sm"
          color="gray.400"
          marginBottom={2}
        >
          Assine a newsletter da Rocketseat e receba os melhores conteúdos sobre
          programação!
        </Text>

        <Input
          placeholder="Seu melhor e-mail"
          marginTop={2}
          marginBottom={4}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <ReCAPTCHA
          sitekey="6LedesoZAAAAAPxor5VqoJ2flq_-stzoQasfbDdt"
          onChange={onChangeCaptcha}
        />

        <Button
          type="submit"
          backgroundColor="purple.500"
          height="50px"
          borderRadius="sm"
          marginTop={6}
          _hover={{ backgroundColor: "purple.600" }}
        >
          INSCREVER
        </Button>
      </Flex>
    </Flex>
  );
}
