import { checkAuthenticated } from "@utils/auth/auth.util";
import useAuthPayload from "./useAuthPayload.hook";

export default function useAuthenticated(): boolean | undefined {
  const authPayload = useAuthPayload();

  return checkAuthenticated(authPayload);
}
