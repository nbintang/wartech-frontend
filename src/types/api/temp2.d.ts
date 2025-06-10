export type UserProfileApiResponse = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UsersApiResponse = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  image: string;
  role: "READER" | "REPORTER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
};
