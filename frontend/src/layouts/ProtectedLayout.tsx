import { Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/redux-hooks";
import { Navigate } from "react-router-dom";
import NavBar from "../components/nav/NavBar";
import ModalContainer from "../modals/ModalContainer";

const ProtectedLayout = () => {
  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  if (!basicUserInfo) {
    return <Navigate replace to={"/login"} />;
  }

  return (
    <>
      <NavBar />
      <ModalContainer />
      <Outlet />
    </>
  );
};

export default ProtectedLayout;
