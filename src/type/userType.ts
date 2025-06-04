
export type UserProfileResponse = {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}