import {createContext, useEffect, useState} from 'react'
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    // localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    // if(localStorage.getItem('authTokens') == null){

    // }
    const [user, setUser] = useState(
        localStorage.getItem('authToken') ? 
        jwtDecode(JSON.parse(localStorage.getItem('authToken')).access) : 
        null
        )

    const [token, setToken] = useState(
        localStorage.getItem('authToken') ? 
        JSON.parse(localStorage.getItem('authToken')) : 
        null
        )

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({'username' : e.target.username.value, 'password' : e.target.password.value})
        });
        let data = await response.json()
        if(response.status === 200){
            setToken(data)
            setUser(jwtDecode(data.access))

            localStorage.setItem('authToken', JSON.stringify(data))
            localStorage.setItem('user', JSON.stringify(jwtDecode(data.access)) )
            navigate('/')
        }else{
            alert('something went wrong')
        }
    }

    let logoutUser = () =>{
        setToken(null)
        setUser(null)
        localStorage.removeItem('authToken')
        navigate('/')
    }

    let contextData = {
        user : user,
        loginUser:loginUser,
        logoutUser: logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider
}
