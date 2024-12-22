import React from "react";
import authService from "../Appwrite/UserConfig"; // Your Appwrite service configuration
import { useDispatch } from "react-redux";
import {StatusDone,StatusFailure} from "../store/ToastSlice";
import { logout } from "../store/AuthSlice";


const LogoutButton = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await authService.account.deleteSession("current"); // Delete current session
      const message = "Logout Successfully !!!";
      dispatch(logout())
      dispatch(StatusDone(message));
    } catch (error) {
      dispatch(StatusFailure("Error in logging out !"));
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
