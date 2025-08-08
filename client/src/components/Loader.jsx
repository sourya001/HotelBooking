import React, { use } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

// This component is a placeholder for a loader
// It can be expanded to include a spinner or any loading animation
const Loader = () => {
  const { navigate } = useAppContext();
  const { nextUrl } = useParams();
  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 8000);
    }
  },[nextUrl]);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loader;
