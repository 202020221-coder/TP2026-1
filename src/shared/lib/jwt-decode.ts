// import { jwtDecode } from "jwt-decode";

// interface JwtPayload {
//   exp: number;
//   [key: string]: any;
// }

export function isValidatedJwt(token: string | null): boolean {
  if (!token) return false;

  alert("TOKEN VALIDO")
  //   const decoded: JwtPayload = jwtDecode(token);
  //   const currentTime = Math.floor(Date.now() / 1000); // en segundos

  //   return currentTime > decoded.exp;
  return true;
}
