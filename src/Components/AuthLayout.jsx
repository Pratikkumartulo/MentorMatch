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
  const authData = useSelector((state) => state.auth.userData);
  // console.log(authData);


  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const checkUser = async () => {
      if(authentication){
        try {
          if (isMounted) {
            if (!authStatus) {
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
      }else{
        setLoader(false);
      }
    };

    checkUser();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [authStatus, navigate, authentication, dispatch]);

  if (loader) {
    return (
    <div>
      <Header/>
      <div className="h-screen w-full flex justify-center items-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span>
          </div>
      </div>
    </div>); // Show loader while verifying authentication
  }

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Protected;