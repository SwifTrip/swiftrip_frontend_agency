import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getToken } from "./utils/auth/authHelper";
import {
  fetchCurrentUser,
  selectIsAuthenticated,
} from "./store/slices/authSlice";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = getToken();
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return <AppRouter />;
}

export default App;
