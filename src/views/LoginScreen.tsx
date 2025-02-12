import React from "react";
import { Alert, Button } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { loginUser } from "../controllers/AuthController";
import { Container, Title, Input, ErrorText } from "./loginscreenstyle";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../utils/zodValidations";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "../../@types/navigation";

const LoginScreen = () => {

  const navigatetion = useNavigation<NavigationProp>();
  type FormData = {
    username: string;
    password: string;
  };

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = ({ username, password }: { username: string; password: string }) => {
    loginUser(username, password, (success) => {
      if (success) {
        navigatetion.navigate("HomeScreen");
      } else {
        Alert.alert("Erro", "Usuário ou senha inválidos.");
      }
    });
  };

  return (
    <Container>
      <Title>Login</Title>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
        rules={{ required: "Username is required" }}
      />
      {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
        rules={{ required: "Password is required" }}
      />
      {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      </Container>
    );
  };
  
  export default LoginScreen;