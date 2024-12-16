import { v4 as uuidv4 } from "uuid";
import { Err,Ok, ic } from "azle/experimental";
import { UserProfilePayload, UserProfile, ChangeRoleProps } from "../data/dataType";
import { RoleAuth, userTaken } from "../utils/authentication";
import getCurrentDate from "../utils/timeUtil";
import { UserProfileStorage } from "../store/storage";
import { getRoleCounts } from "../utils/systemStatistics";


class ProfileController {
    static createProfile = (payload:UserProfilePayload) => {
        try {   
          const { Fullname, DateOfBirthday, Gender, NationalId, Email, Phone, Address } = payload;
      
          if (!Fullname || !DateOfBirthday || !Gender || !NationalId || !Email || !Phone || !Address) { 
            return Err({ InvalidPayload: "Missing required fields" });
          }
      
          if (userTaken(Email, NationalId)) {
            return Err({ Error: "User already exists!!!" });
          } else if (userTaken(Email, NationalId) === 0) {
            const HighOfficialProfile = {
              ProfileId: uuidv4(),
              Fullname,
              DateOfBirthday,
              Gender,
              NationalId,
              Email,
              Phone,
              ProgramsJoined: [],
              Address,
              Owner: ic.caller(),
              Role: { HIGH_OFFICIAL: "HIGH_OFFICIAL" },
              CreatedAt: getCurrentDate(),
              UpdatedAt: getCurrentDate()
            };
      
            UserProfileStorage.insert(ic.caller(), HighOfficialProfile);
            return Ok("You are a High official");
          } else {
            const HighOfficialProfile = {
              ProfileId: uuidv4(),
              Fullname,
              DateOfBirthday,
              Gender,
              NationalId,
              Email,
              Phone,
              ProgramsJoined: [],
              Address,
              Owner: ic.caller(),
              Role: { CITIZEN: "CITIZEN" },
              CreatedAt: getCurrentDate(),
              UpdatedAt: getCurrentDate()
            };
      
            UserProfileStorage.insert(ic.caller(), HighOfficialProfile);
            return Ok("Successfully registered");
          }
      
        } catch (error:any) {
          return Err({ Error: `Error occurred: ${error.message}` });
        }
      };

    static GetProfile=()=>{
        try{
         const ProfileOpt = UserProfileStorage.get(ic.caller());
         if(!ProfileOpt){
             return Err({NotFound:"Profile does not exist"})
            }
 
         return Ok(ProfileOpt)
        }catch(error: any) {
         return Err({Error: `Error occured ${error.message}`})
        }
     };

     static  GetAllLeader =()=>{
        try{
          const UsersProfile = UserProfileStorage.values();
          if(UsersProfile.length == 0){
            return Err({ NotFound: "Empty user"})
          }
          const LeaderProfile = UsersProfile.filter((User: UserProfile)=>(
            (Object.values(User.Role)[0] == "LOCAL_LEADER")
          ))
          return Ok(LeaderProfile)
        }catch(error: any) {
          return Err({Err: `Error occured ${error.message}`})
        }
      }

      static  GetAllProfile=()=>{
        try{
         const Profiles = UserProfileStorage.values()
         if(!Profiles){
           return Err({NotFound:"NO profile"})
         }
          const SafeProfile = Profiles.map((profile:UserProfile)=>{
              const { Owner , ...safe } = profile
              return safe
          })
          return Ok(SafeProfile)
        }catch(error: any) {
         return Err({Error: `Error occured ${error.message}`})
        }
       };

      static  ChangeRole=(payload:ChangeRoleProps)=> {  
        try{
           const { ProfileId, Role } = payload;
           if(!ProfileId || !Role){
            return Err({InvalidPayload: "Missing required fields"})
          }
          
          const UserProfileOpt = UserProfileStorage.get(ic.caller())
          const AllUserProfile = UserProfileStorage.values()
  
          if(!UserProfileOpt){
            return Err({NoProfile: "No Profile"})
          }
  
         
          if (!RoleAuth(UserProfileOpt.Role,["HIGH_OFFICIAL"])) {
            return Err({ Unauthorized: "Access Denied" });
          }
          
          if(AllUserProfile.length == 0) {
            return Err({NotFound: "No profile exist"})
          }
          const  userProfile = AllUserProfile.find((user: UserProfile)=>(
            user.ProfileId == ProfileId
          ))
          if(!userProfile) {
            return Err({NotFound: "No profile exist"})
          }
          let role;
           if(Role == "CITIZEN"){
              role ={  CITIZEN: "CITIZEN"}
           }else if(Role == "HIGH_OFFICIAL"){
            role ={  "HIGH_OFFICIAL": "HIGH_OFFICIAL"}
           }else {
            role= { "LOCAL_LEADER" : "LOCAL_LEADER"}
           }
           
          const updatedUser = {
            ...userProfile,
             "Role":  role
          }
          UserProfileStorage.insert(userProfile.Owner, updatedUser)
           return Ok("Updated successfully")
        }catch(error:any){
          return Err({Err: `Error occured ${error.message}`})
        }
  
      };

      static GetRoleCount=()=>{
        try{
          const userProfiles = UserProfileStorage.values();
          return Ok(getRoleCounts(userProfiles))
        }catch(error: any) {
          return Err({Err: `Error occured ${error.message}`})
        }
      }


}

export default ProfileController