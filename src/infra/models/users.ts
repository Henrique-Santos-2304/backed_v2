class UserModel {
  id?: string;

  username: string;

  password: string;

  user_type: "USER" | "SUDO" | "DEALER";

  secret?: string;
}

export { UserModel };
