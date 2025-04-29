import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import Toastify from "toastify-js";
import AppRoutes from "./AppRoutes";
import Header from "./components/Header/Header";
import Loading from "./components/Loading/Loading";
import { useLoading } from "./hooks/useLoading";
import { setLoadingInterceptor } from './interceptors/loadingInterceptors';
import { useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { showLoading, hideLoading } = useLoading();
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });
  }, [showLoading, hideLoading]);

  return (
    <>
      <ToastContainer/>
      <Loading />
      {/* Conditionally render Header based on the current route */}
      
      <AppRoutes />
    </>
  );
}

export default App;
