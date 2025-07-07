import React from "react";
import useFetchProtectedData from "./useFetchProtectedData";
import { UserProfileApiResponse } from "@/types/api/UserApiResponse";

const useProfile = () =>
  useFetchProtectedData<UserProfileApiResponse>({
    TAG: "me",
    endpoint: "/users/me",
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default useProfile;
