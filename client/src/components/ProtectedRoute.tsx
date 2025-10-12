import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../store/authSlice";
import { useAppSelector } from "../hooks/reduxHooks";

const ProtectedRoute = (): JSX.Element => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
