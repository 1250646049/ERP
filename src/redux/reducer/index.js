import {combineReducers} from "redux"
import user from "./login"
import salary from "./salary"
export default combineReducers({
    user,
    salary
})