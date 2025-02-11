import { mockUser } from "../models/User";
export const loginUser = (
  username: string,
  password: string,
  callback: (success: boolean) => void
) => {
  if (username === mockUser.name && password === mockUser.password) {
    callback(true);
  } else {
    callback(false);
  }
};
