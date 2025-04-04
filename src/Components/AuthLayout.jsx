import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { StatusDone, StatusFailure } from "../store/ToastSlice";

const Protected = ({ children, authentication = true, isadminreq = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const authStatus = useSelector((state) => state.auth.status);
  const authData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const checkAuth = async () => {
      if (authentication) {
        if (!authStatus) {
          dispatch(StatusFailure("You have to log in!"));
          navigate("/login");
          return;
        }

        if (isadminreq) {
          if (
            authData &&
            authData.userData &&
            Array.isArray(authData.userData.labels) &&
            authData.userData.labels.includes("admin")
          ) {
            setIsAuthorized(true);
          } else {
            dispatch(StatusFailure("You are not authorized to access this page!"));
            navigate("/");
            return;
          }
        } else {
          setIsAuthorized(true);
        }
      } else {
        setIsAuthorized(true);
      }

      setLoader(false);
    };

    checkAuth();
  }, [authStatus, authData, authentication, isadminreq, dispatch, navigate]);

  if (loader) {
    return (
      <div>
        <Header />
        <div className="h-screen w-full flex justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthorized) {
    return (
      <div>
        <Header />
        {children}
      </div>
    );
  }

  return null; // Fallback to nothing if not authorized (should never hit this due to navigate)
};

export default Protected;
