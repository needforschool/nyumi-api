export type User = {
  email: string;
  password: string;
  firstname: string;
  createdAt: string;
  recover: {
    code: string;
    createdAt: string;
  };
};
