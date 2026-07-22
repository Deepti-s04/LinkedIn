import React, { createContext } from "react";
export const authDataContext=createContext()
const serverurl="http://localhost:8000"
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