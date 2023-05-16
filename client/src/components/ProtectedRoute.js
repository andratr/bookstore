import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { GetLoggedInUserDetails } from "../apicalls/users";
import { SetUser } from "../redux/usersSlice";
import { ShowLoading, HideLoading } from "../redux/loadersSlice";
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const validateUserToken = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetLoggedInUserDetails();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        setIsLoading(false);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
        message.error(response.message);
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      validateUserToken();
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && (
        <div className="p-1">
          <div className="header p-2 bg-primary flex justify-between items-center rounded">
            <h1 className="text-2xl text-white font-bold">Library</h1>

            <div className="flex item-center gap-1 bg-white p-1 rounded">
              <i className="ri-user-line "></i>
              <span
                className="text-sm underlined"
                onClick={() => navigate("/profile")}
              >
                {user.name}
              </span>
              <i
                className="ri-logout-circle-r-line ml-2"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              ></i>
            </div>
          </div>
          <div className="content mt-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export default ProtectedRoute;
