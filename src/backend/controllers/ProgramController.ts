import { v4 as uuidv4 } from "uuid";
import { Err,Ok, ic, text } from "azle/experimental";
import { UserProfile, ProgramPayload, Program } from "../data/dataType";
import { RoleAuth  } from "../utils/authentication";
import getCurrentDate from "../utils/timeUtil";
import { ProgramStorage, UserProfileStorage } from "../store/storage";
import { ProgramStats } from "../utils/systemStatistics";


class ProgramController {

 static CreateProgram=(payload:ProgramPayload)=>{
   try{

     const { Name,Beneficials,Description} = payload;
     if(!Name || !Beneficials || !Description){
       return Err({InvalidPayload: "Missing required fields"})
     }
     
     const UserProfile = UserProfileStorage.get(ic.caller())

     if(!UserProfile){
       return Err({NoProfile: "No Profile"})
     }
     if (!RoleAuth(UserProfile.Role, ["HIGH_OFFICIAL"])) {
      return Err({ Unauthorized: "Access Denied" });
    }
     const NewProgram: Program ={
       ProgramId:  uuidv4(),
       Name,
       CreatedBy: ic.caller(),
       LocalLeaders: [],
       RequestCitizens: [],
       Citizens: [],
       Beneficials,
       Description,
       CreatedAt: getCurrentDate(),
       UpdatedAt: getCurrentDate(),
     }
     ProgramStorage.insert(NewProgram.ProgramId, NewProgram);
     return Ok("Created successfully")
   }catch(error: any){
     return Err({Error: `Error occured ${error.message}`})
   }
 };
 static  GetAllProgram=()=>{
    try{
       const Programs = ProgramStorage.values()
       if(Programs.length == 0) {
        return Err({NotFound:"Program is Empty"})
       }
        const SafePrograms = Programs.map((program:Program)=>{
          const { CreatedBy, ...safe } = program;
          return safe
        })
       return Ok(SafePrograms )
    }catch(error: any) {
      return Err({Err: `Error occured ${error.message}`})
    }
  };

  static  ProgramStats=()=>{
    try{
      const Programs = ProgramStorage.values();

      if(Programs.length === 0){
        return Err({NotFound: "Empty Content"})
      }
    
     const ProgramsStats = ProgramStats(Programs);
     return Ok(ProgramsStats)

    }catch(error:any){
      return Err({Error: `Error Occured ${error.message}`})
    }
  };

  static  AddLeaderToProgram=(ProgramId:text,LeaderId:text)=>{
    try{
      
      const UserProfileOpt = UserProfileStorage.get(ic.caller())
      const AllUserProfile = UserProfileStorage.values()
      const ProgramOpt = ProgramStorage.get(ProgramId)

      if(!UserProfileOpt){
        return Err({NoProfile: "No Profile"})
      }
      if (!RoleAuth(UserProfileOpt.Role, ["HIGH_OFFICIAL"])) {
        return Err({ Unauthorized: "Access Denied" });
      }

      if(!ProgramOpt) {
        return Err({NotFound: "Program no found"})
      }
      
      const  userLeader = AllUserProfile.find((user: UserProfile)=>(
        (user.ProfileId == LeaderId) &&  (Object.values(user.Role)[0] == "LOCAL_LEADER")
      ))
      if(!userLeader) {
        return Err({NotFound: "No Exit or not leader"})
      }

      if(ProgramOpt.LocalLeaders.includes(LeaderId)){
        return Err({Error: "Already Exist"})
      }

      ProgramOpt.LocalLeaders.push(LeaderId)

      ProgramStorage.insert(ProgramOpt.ProgramId, ProgramOpt)
      return Ok("Leader add successfully")

    }catch(error: any) {
      return Err({Err: `Error occured ${error.message}`})
    }
};

static CitizenRequest=(ProgramId:text)=>{
  try{
    const UserProfileOpt = UserProfileStorage.get(ic.caller())
    const ProgramOpt = ProgramStorage.get(ProgramId)

    if(!UserProfileOpt){
      return Err({NoProfile: "No Profile"})
    }
    if(!ProgramOpt) {
      return Err({NotFound: "Program no found"})
    }
    if(ProgramOpt.RequestCitizens.includes(UserProfileOpt.ProfileId) ||
    ProgramOpt.Citizens.includes(UserProfileOpt.ProfileId)
  ){
      return Err({Error: "Already in Program"})
    }

    ProgramOpt.RequestCitizens.push(UserProfileOpt.ProfileId)

    ProgramStorage.insert(ProgramId,ProgramOpt)
    return Ok("Request sent!")
  }catch(error: any) {
    return Err({Err: `Error occured ${error.message}`})
  }
}

static ProgramLeaders=(ProgramId:text)=>{
  try{
    const ProgramOpt = ProgramStorage.get(ProgramId)
    const AllUserProfile = UserProfileStorage.values()
    if(!ProgramOpt) {
      return Err({NotFound: "Program no found"})
    }
    if(ProgramOpt.LocalLeaders.length == 0) {
      return Err({NotFound: "NO requests"})
    }
    const ProgramLeader = AllUserProfile.filter((user: UserProfile)=> (
      ProgramOpt.LocalLeaders.includes(user.ProfileId)
    ))
    return Ok(ProgramLeader)
  }catch(error:any) {
    return Err({Error: `Error occured ${error.message}`})
  }
}

static  ProgramCitizens=(ProgramId:text)=>{
  try{
    const ProgramOpt = ProgramStorage.get(ProgramId)
    const AllUserProfile = UserProfileStorage.values()
    if(!ProgramOpt) {
      return Err({NotFound: "Program no found"})
    }
    if(ProgramOpt.Citizens.length == 0) {
      return Err({NotFound: "NO requests"})
    }
    const ProgramCitizens = AllUserProfile.filter((user: UserProfile)=> (
      ProgramOpt.Citizens.includes(user.ProfileId)
    ))
    return Ok(ProgramCitizens)
  }catch(error:any) {
    return Err({Error: `Error occured ${error.message}`})
  }
}

static  ViewRequest=(ProgramId:text)=>{
  try{
    const UserProfileOpt = UserProfileStorage.get(ic.caller())
    const AllUserProfile = UserProfileStorage.values()
    const ProgramOpt = ProgramStorage.get(ProgramId)
    
    if(!ProgramOpt) {
      return Err({NotFound: "Program no found"})
    }
    if(!UserProfileOpt){
      return Err({NoProfile: "No Profile"})
    }
    if (!RoleAuth(UserProfileOpt.Role)) {
      return Err({ Unauthorized: "Access Denied" });
    }

    if(ProgramOpt.RequestCitizens.length == 0) {
      return Err({NotFound: "NO requests"})
    }

    const ProfileRequested = AllUserProfile.filter((user: UserProfile)=> (
      ProgramOpt.RequestCitizens.includes(user.ProfileId)
    ))
    return Ok(ProfileRequested)
  }catch(error: any) {
    return Err({Err: `Error occured ${error.message}`})
  }
}

static  ApproveRequest=(ProgramId:text,ProfileId:text)=>{
  try{
    const UserProfileOpt = UserProfileStorage.get(ic.caller())
    const ProgramOpt = ProgramStorage.get(ProgramId)
    
    if(!ProgramOpt) {
      return Err({NotFound: "Program no found"})
    }
    if(!UserProfileOpt){
      return Err({NoProfile: "No Profile"})
    }
    if (!RoleAuth(UserProfileOpt.Role)) {
      return Err({ Unauthorized: "Access Denied" });
    }

    if(!ProgramOpt.RequestCitizens.includes(ProfileId) ||
    ProgramOpt.Citizens.includes(ProfileId)
  ){
      return Err({Error: "Not request found or you exist in program"})
    }
    const removeFromRequest = ProgramOpt.RequestCitizens.filter((Citizen: text)=>(
      Citizen != ProfileId
    ));

    ProgramOpt.RequestCitizens = removeFromRequest;
    ProgramOpt.Citizens.push(ProfileId)
    ProgramStorage.insert(ProgramOpt.ProgramId,ProgramOpt)

   return Ok("Approved successfully")
  }catch(error: any) {
    return Err({Err: `Error occured ${error.message}`})
  }
};


}

export default ProgramController