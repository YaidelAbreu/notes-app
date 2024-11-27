import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";

const Home = () => {
  const dispatch = useAppDispatch();

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  useEffect(() => {}, [basicUserInfo, dispatch]);

  return (
    <>
      <h1>Home</h1>
    </>
  );
};

export default Home;
