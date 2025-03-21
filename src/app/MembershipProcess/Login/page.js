"use client"
import Login from "./Login"
import { useState } from "react"
import Register from "./Register"

const MembershipProcess = () => {

    const [login,setLogin] = useState(true)

    return(
        <>
            {login ? <Login loginSendParam={setLogin}/> : ""}
            {!login ? <Register registerParam={setLogin} /> : ""}
        </>
    )
}

export default MembershipProcess