import axios from "axios";
import { createContext, useContext } from "react";
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export default AppProvider=({ children }) => {

    const value ={

    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>  
    )
};

export const useAppContext=()=>useContext(AppContext);
