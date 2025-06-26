import axios from "axios"
import { IP_ADDRESS } from "../utils/constants"

export const LoginService= (userCreds)=>{
    axios.post(IP_ADDRESS+"/auth/login",userCreds,{
        withCredentials:true
    }).then((res)=>{
        console.log(res.data)
    }).catch((err)=>{
        console.log(err.message)
    })
}