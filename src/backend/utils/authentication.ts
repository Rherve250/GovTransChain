import { text, nat64, Principal ,ic} from "azle/experimental";
import { UserProfileStorage } from "../store/storage";
import { UserProfile,RoleEnum } from "../data/dataType";

const userTaken =(email:text, NationalId: nat64)=>{
    const users = UserProfileStorage.values();
    if(users.length == 0){
        return 0
    }else {
        return users.map((user:UserProfile)=> user.Email).includes(email) || users.map((user:UserProfile)=> user.NationalId).includes(NationalId)
    }

}

const RoleAuth = (userRole: RoleEnum, allowedRoles = ["HIGH_OFFICIAL", "LOCAL_LEADER"]): boolean => {
  return allowedRoles.includes(Object.values(userRole)[0]);
};

const Owner =(owner: Principal)=> {
  if(JSON.stringify(owner) === JSON.stringify(ic.caller())){
   return true
  }else{
    return false
  }
}

export {
    userTaken,
    RoleAuth,
    Owner
}