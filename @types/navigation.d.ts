import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
