import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import authService from "../Appwrite/UserConfig";
import { StatusDone, StatusFailure } from "../store/ToastSlice";

const Protected = ({ children, authentication = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);


  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (isMounted) {
          if (!userData) {
            dispatch(StatusFailure("You have to log in!"));
            navigate("/login");
          } else {
            setLoader(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user data:", error);
          dispatch(StatusFailure("Error verifying authentication!"));
        }
      }
    };

    checkUser();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [authStatus, navigate, authentication, dispatch]);

  if (loader) {
    return <div>Loading...</div>; // Show loader while verifying authentication
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Protected;
