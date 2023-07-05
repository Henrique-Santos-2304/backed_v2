class UserModel {
  id?: string;

  username: string;

  password: string;

  user_type: "WORKER" | "SUDO" | "DEALER" | "OWNER";

  secret?: string;
}

export { UserModel };
