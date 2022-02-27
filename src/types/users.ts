export type User = {
  email: string;
  password: string;
  roles: [number];
  firstname: string;
  lastname: string;
  tel: string;
  streetNumber: number;
  streetName: string;
  zipCode: string;
  city: string;
  createdAt: string;
  authentic: {
    token: string;
    status: boolean;
  };
  recover: {
    token: string;
    createdAt: string;
  };
};
