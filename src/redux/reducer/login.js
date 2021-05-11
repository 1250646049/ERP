import {INITUSER} from "../action_type"

const user={}

export default function operatUser(prestate,action){
    const {type,data}=action
    switch(type){
        case INITUSER:
            return data
        
        default:
            return user
    }
}