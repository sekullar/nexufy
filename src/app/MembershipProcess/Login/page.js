"use client"
import Login from "../../../Components/MembershipProcess/Login"
import { useState } from "react"
import Register from "../../../Components/MembershipProcess/Register"

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