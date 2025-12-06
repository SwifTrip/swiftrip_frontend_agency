import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
  fetchCurrentUser,
  selectIsAuthenticated,
} from "./store/slices/authSlice";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return <AppRouter />;
}

export default App;
