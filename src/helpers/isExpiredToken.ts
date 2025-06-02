import jwtDecode from "./jwtDecoder";

const isExpiredToken = (token: string) => {
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp && decodedToken.exp < currentTime;
};
export default isExpiredToken;