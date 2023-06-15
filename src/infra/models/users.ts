class UserModel {
  user_id?: string;

  login: string;

  password: string;

  user_type: "USER" | "SUDO" | "DEALER";

  secret?: string;
}

export { UserModel };
