import { Children, createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const access = localStorage.getItem('access')
        if(access){
            setUser({username: 'user'})
        }
        setLoading(false);
    },[])

    const login = (data)=>{
        
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        // localStorage.setItem('user', JSON.stringify(user.data))
        setUser({username: 'user'})
    }

    const logout = ()=>{

        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        setUser(null)
    }

    const isAuthenticated = !!localStorage.getItem('access');

    const value = {user, isAuthenticated, login, logout, loading};

    return (
        <AuthContext.Provider value={value}>
            {!loading &&  children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=> useContext(AuthContext)