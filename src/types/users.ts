export type User = {
  email: string;
  password: string;
  firstname: string;
  createdAt: string;
  goals: {
    step: number;
    smoke: number;
  };
  recover: {
    code: string;
    createdAt: string;
  };
};
