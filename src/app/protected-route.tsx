import { enableMocking } from "@/shared/api/mocks";
import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { session } = useSession();

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
}

export async function ProtectedLoader() {
  await enableMocking();
  const token = useSession.getState().refreshToken();
  if (!token) {
    return { redirect: ROUTES.LOGIN };
  }
  return null;
}
