import {INITSALARYS} from "../action_type"

const salary={}
export default function operatSalary(prestate,action){
    const {type,data}=action

    switch(type){
        case INITSALARYS:
            return data;
        default:

            return salary;
    }






}




