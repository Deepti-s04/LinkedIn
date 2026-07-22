import React, { createContext } from "react";
export const authDataContext=createContext()
const serverurl="https://linkedin-backend-8xls.onrender.com"
export default function AuthContext({children}){
    let value={
        serverurl
    }
    return(
        <div>
            <authDataContext.Provider value={value}>
            {children}
            </authDataContext.Provider>
        </div>
    )
}
