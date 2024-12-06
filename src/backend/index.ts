import {
    query,
    update,
    text,
    Record,
    StableBTreeMap,
    Variant,
    Vec,
    Ok,
    Err,
    ic,
    Principal,
    Opt,
    nat64,
    Result,
    bool,
    Canister,
    init,
    Void,
    nat,
  } from "azle/experimental";
  import { v4 as uuidv4 } from "uuid";

  const AddressProp = Record({
    Province: text,
    District: text,
    Sector: text,
    Cell: text
  });
  type AddressProp = typeof AddressProp.tsType

  const RoleEnum = Variant({
    HIGH_OFFICIAL: text,
    LOCAL_LEADER: text,
    CITIZEN: text
  });
  type RoleEnum = typeof RoleEnum.tsType

  const UserProfile = Record({
    ProfileId: text,
    Fullname: text,
    DateOfBirthday: text,
    Gender: text,
    NationalId: nat64,
    Email: text,
    Phone: text,
    ProgramsJoined: Vec(text),
    Address: AddressProp,
    Role: RoleEnum,
    Owner: Principal,
    CreatedAt: text,
    UpdatedAt: text
  });

  type UserProfile = typeof UserProfile.tsType

  const UserProfilePayload = Record({
    Fullname: text,
    DateOfBirthday:text,
    Gender: text,
    NationalId: nat64,
    Email: text,
    Phone: text,
    Address: AddressProp,
  })
  type UserProfilePayload = typeof UserProfilePayload.tsType

  const ChangeRoleProps = Record({
    ProfileId: text,
    Role: text
  })

const Program = Record({
    ProgramId: text,
    Name: text,
    CreatedBy: Principal,
    LocalLeaders: Vec(text),
    RequestCitizens: Vec(text),
    Citizens: Vec(text),
    Beneficials: nat64,
    Description: text,
    CreatedAt: text,
    UpdatedAt: text,
    
});
type Program = typeof Program.tsType
const ProgramPayload = Record({
  Name: text,
  Beneficials: nat64,
  Description: text
});
type ProgramPayload = typeof ProgramPayload.tsType

const Stock= Record({
    StockId: text,
    ProgramId: text,
    StockName: text,
    Quantity: nat64,
    RemainingStock: nat64,
    CreatedBy: Principal,
    CreatedAt: text,
    UpdatedAt: text 
});
type Stock = typeof Stock.tsType

const StockPayload = Record({
  ProgramId: text,
  StockName: text,
  Quantity: nat64,
})

type StockPayload = typeof StockPayload.tsType

const TransactionEnum = Variant({
    TRANSFER: text,
    DISTRIBUTION: text
});

type TransactionEnum = typeof TransactionEnum.tsType

const TransactionStatus = Variant({
    ACCEPTED: text,
    REJECT: text,
    PENDING: text
})

type TransactionStatus = typeof TransactionStatus.tsType
const StockTransactions = Record({
    TransactionId: text,
    StockId: text,
    SenderId: Principal,
    ReceiverId: text,
    Quantity: nat64,
    TransactionType: TransactionEnum,
    Status: TransactionStatus,
    CreatedAt: text
})

type StockTransactions = typeof StockTransactions.tsType

const StockTransactionsProp = Record({
  StockId: text,
  ReceiverId: text,
  Quantity: nat64
})

type StockTransactionsProp = typeof StockTransactionsProp.tsType


const Message = Variant({
  NotFound: text,
  InvalidPayload: text,
  Error: text,
  NoProfile: text,
 Unauthorized: text
})

type Message = typeof Message.tsType

const UserProfileStorage = StableBTreeMap<Principal,UserProfile>(0);
const ProgramStorage = StableBTreeMap<text, Program>(1);
const StockStorage = StableBTreeMap<text,Stock>(2)
const StockTransactionStorage = StableBTreeMap<text,StockTransactions>(3)

const userTaken =(email:text, NationalId: nat64)=>{
    const users = UserProfileStorage.values();
    if(users.length == 0){
        return 0
    }else {
        return users.map((user:UserProfile)=> user.Email).includes(email) || users.map((user:UserProfile)=> user.NationalId).includes(NationalId)
    }

}

const RoleAuth =(userRole: RoleEnum , Role:text)=> {
  if(Object.values(userRole)[0] == Role){
    return true
  }else{
    return false
  }
}

const Owner =(owner: Principal)=> {
  if(JSON.stringify(owner) === JSON.stringify(ic.caller())){
   return true
  }else{
    return false
  }
}

export default Canister({
    
    CreateProfile: update([UserProfilePayload], Result(text,Message), (payload)=>{
        try{   
          const {  Fullname,DateOfBirthday,Gender,NationalId,Email,Phone,Address, } = payload;
          if(
            !Fullname ||
            !DateOfBirthday ||
            !Gender ||
            !NationalId ||
            !Email ||
            !Phone ||
            !Address
          ){ 
            return Err({InvalidPayload: "Missing required fields"})
          }

          if(userTaken(Email,NationalId)){
            return Err({ Error: "User already exist!!!" })
        }else if(userTaken(Email,NationalId) === 0){
            
            const HighOfficialProfile : UserProfile={
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
              Role: {HIGH_OFFICIAL: "HIGH_OFFICIAL"},
              CreatedAt: getCurrentDate(),
             UpdatedAt: getCurrentDate()
            }

            UserProfileStorage.insert(ic.caller(),HighOfficialProfile);
            return Ok("You are High official")
        }else {
          const HighOfficialProfile : UserProfile={
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
            Role: {  CITIZEN: "CITIZEN"},
            CreatedAt: getCurrentDate(),
            UpdatedAt: getCurrentDate()
          }

          UserProfileStorage.insert(ic.caller(),HighOfficialProfile);
          return Ok("Successsfully registered")
        }

        }catch(error: any){
          return Err({Error: `Error occured ${error.message}`})
        }
    }),
    getProfile:query([],Result(UserProfile, Message),()=>{
      try{
         const ProfileOpt = UserProfileStorage.get(ic.caller());

         if(!ProfileOpt){
          return Err({NotFound:"Profile does not exist"})
         }
         if(!Owner(ProfileOpt.Owner)) {
          return Err({Error: "Access denied"})
         }
        return Ok(ProfileOpt)
      }catch(error:any){
        return Err({Err: `Error occured ${error.message}`})
      }
    }),
    
    CreateProgram: update([ProgramPayload],Result(text, Message), (payload)=>{
      try{

        const { Name,Beneficials,Description} = payload;
        if(!Name || !Beneficials || !Description){
          return Err({InvalidPayload: "Missing required fields"})
        }
        
        const UserProfile = UserProfileStorage.get(ic.caller())

        if(!UserProfile){
          return Err({NoProfile: "No Profile"})
        }

        if(!RoleAuth(UserProfile.Role,"HIGH_OFFICIAL")){
          return Err({Unauthorized: "Access Denied"})
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
        return Err({Err: `Error occured ${error.message}`})
      }
    }),
    CreateStock:update([StockPayload], Result(text, Message),(payload)=>{
      try{
        const {  ProgramId ,StockName,Quantity} = payload;

        const UserProfile = UserProfileStorage.get(ic.caller())
        const ProgramOpt  = ProgramStorage.get(ProgramId);

        if(!ProgramId || !StockName || !Quantity){
          return Err({InvalidPayload: "Missing required fields"})
        }
        if(!UserProfile){
          return Err({NoProfile: "No Profile"})
        }

        if(!RoleAuth(UserProfile.Role,"HIGH_OFFICIAL")){
          return Err({Unauthorized: "Access Denied"})
        }
        if(ProgramOpt) {
          return Err({NotFound: "Program not found"})
        }

        const NewStock: Stock = {
          StockId: uuidv4(),
          ProgramId,
          StockName,
          Quantity,
          RemainingStock: Quantity,
          CreatedBy: ic.caller(),
          CreatedAt: getCurrentDate(),
          UpdatedAt: getCurrentDate()
        }
        StockStorage.insert(NewStock.StockId,NewStock)
        return Ok("Created successfully")
      }catch(error: any) {
        return Err({Err: `Error occured ${error.message}`})
      }
    }),

    ChangeRole: update([ChangeRoleProps], Result(text, Message), (payload)=> {  
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

        if(!RoleAuth(UserProfileOpt.Role,"HIGH_OFFICIAL")){
          return Err({Unauthorized: "Access Denied"})
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
      
        const updatedUser = {
          ...userProfile,
          [Role]:Role
        }
        UserProfileStorage.insert(userProfile.Owner, updatedUser)
         return Ok("Updated successfully")
      }catch(error:any){
        return Err({Err: `Error occured ${error.message}`})
      }

    }),

    getProfilesByRole: query([text],Result(Vec(UserProfile), Message),(Role)=>{
      try{
        const userProfile = UserProfileStorage.values();
        if(userProfile.length == 0) {
          return Err({NotFound: "No available profile"})
        }

        const ProfilesByRole = userProfile.filter((user: UserProfile)=> (
          Object.values(user.Role)[0] === Role
        ))
        if(ProfilesByRole.length == 0) {
          return Err({NotFound: "No one with the role"})
        }
        return Ok(ProfilesByRole)
      }catch(error: any) {
        return Err({Err: `Error occured ${error.message}`})
      }

    }),
    AddLeaderToProgram: update([text,text], Result(text,Message), (ProgramId,LeaderId)=>{
      try{
        const UserProfileOpt = UserProfileStorage.get(ic.caller())
        const AllUserProfile = UserProfileStorage.values()
        const ProgramOpt = ProgramStorage.get(ProgramId)

        if(!UserProfileOpt){
          return Err({NoProfile: "No Profile"})
        }
        if(!RoleAuth(UserProfileOpt.Role,"HIGH_OFFICIAL")){
          return Err({Unauthorized: "Access Denied"})
        }

        if(!ProgramOpt) {
          return Err({NotFound: "Program no found"})
        }
        
        const  userLeader = AllUserProfile.find((user: UserProfile)=>(
          (user.ProfileId == LeaderId) &&  (Object.values(user.Role)[0] === "LOCAL_LEADER")
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
    }),
 
    CitizenRequest: update([text], Result(text, Message), (ProgramId)=>{
      try{
        const UserProfileOpt = UserProfileStorage.get(ic.caller())
        const ProgramOpt = ProgramStorage.get(ProgramId)

        if(!UserProfileOpt){
          return Err({NoProfile: "No Profile"})
        }
        if(!ProgramOpt) {
          return Err({NotFound: "Program no found"})
        }
        if(!RoleAuth(UserProfileOpt.Role,"CITIZEN")){
          return Err({Unauthorized: "Access Denied"})
        }
        if(ProgramOpt.RequestCitizens.includes(UserProfileOpt.ProfileId) ||
        ProgramOpt.Citizens.includes(UserProfileOpt.ProfileId)
      ){
          return Err({Error: "Already in Program"})
        }

        ProgramOpt.RequestCitizens.push(UserProfileOpt.ProfileId)

        UserProfileStorage.insert(UserProfileOpt.Owner,UserProfileOpt)
        return Ok("Request sent!")
      }catch(error: any) {
        return Err({Err: `Error occured ${error.message}`})
      }
    }),
    ViewRequest: query([text], Result(Vec(UserProfile),Message), (ProgramId)=>{
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
        if(!RoleAuth(UserProfileOpt.Role,"HIGH_OFFICIAL") || 
        !RoleAuth(UserProfileOpt.Role,"LOCAL_LEADER")
      ){
          return Err({Unauthorized: "Access Denied"})
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
    }),

    ApproveRequest: query([text, text],Result(text, Message), (ProgramId,ProfileId)=>{
      try{
        const UserProfileOpt = UserProfileStorage.get(ic.caller())
        const ProgramOpt = ProgramStorage.get(ProgramId)
        
        if(!ProgramOpt) {
          return Err({NotFound: "Program no found"})
        }
        if(!UserProfileOpt){
          return Err({NoProfile: "No Profile"})
        }
        if(!RoleAuth(UserProfileOpt.Role,"HIGH_OFFICIAL") || 
        !RoleAuth(UserProfileOpt.Role,"LOCAL_LEADER")
      ){
          return Err({Unauthorized: "Access Denied"})
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
    }),

    Transfer:update([StockTransactionsProp],Result(text,Message),(payload)=> {
      try{
         const {  StockId, ReceiverId, Quantity } = payload;
         const UserProfileOpt = UserProfileStorage.get(ic.caller());
         const StockOpt = StockStorage.get(StockId);
        if(!UserProfileOpt){
          return Err({NoProfile: "No Profile"})
        }
        if(!RoleAuth(UserProfileOpt.Role,"HIGH_OFFICIAL")){
          return Err({Unauthorized: "Access Denied"})
        }

        if(!StockOpt) {
          return Err({NotFound: "Stock not found"})
        }

        const StockProgramOpt = ProgramStorage.get(StockOpt.ProgramId);

        if(!StockProgramOpt) {
          return Err({ NotFound: "Not program found"})
        }

        if(!StockProgramOpt.LocalLeaders.includes(ReceiverId)){
          return Err({NotFound: "Please the leader"})
        }

        if(StockOpt.RemainingStock < Quantity){
          return Err({Error: "No enough stock"})
        }
        const newQuantity = StockOpt.RemainingStock - Quantity
        StockOpt.RemainingStock = newQuantity;
        const NewTransaction : StockTransactions = {
          TransactionId: uuidv4(),
          StockId,
          SenderId: ic.caller(),
          ReceiverId,
          Quantity,
          TransactionType: { TRANSFER: "TRANSFER"},
          Status: { PENDING:"PENDING"},
          CreatedAt: getCurrentDate()
        }
        StockStorage.insert(StockOpt.StockId, StockOpt);
        StockTransactionStorage.insert(NewTransaction.TransactionId,NewTransaction);
        return Ok("Sent to be approved!")
      }catch(error: any) {
        return Err({Error:`Error occured ${error.message}`})
      }
    }),
    // Distribute: update([StockTransactionsProp],Result(text,Message),(payload)=>{
    //   try{
    //     const {  StockId, ReceiverId, Quantity } = payload;
    //     const UserProfileOpt = UserProfileStorage.get(ic.caller());
    //     const StockOpt = StockStorage.get(StockId);
    //    if(!UserProfileOpt){
    //      return Err({NoProfile: "No Profile"})
    //    }
    //    if(!RoleAuth(UserProfileOpt.Role,"LOCAL_LEADER")){
    //      return Err({Unauthorized: "Access Denied"})
    //    }

    //    if(!StockOpt) {
    //      return Err({NotFound: "Stock not found"})
    //    }

    //    const StockProgramOpt = ProgramStorage.get(StockOpt.ProgramId);

    //    if(!StockProgramOpt) {
    //      return Err({ NotFound: "Not program found"})
    //    }

    //    if(!StockProgramOpt.Citizens.includes(ReceiverId)){
    //      return Err({NotFound: "Add citizen to list"})
    //    }

    //    if(StockOpt.RemainingStock < Quantity){
    //      return Err({Error: "No enough stock"})
    //    }
    //    const newQuantity = StockOpt.RemainingStock - Quantity
    //    StockOpt.RemainingStock = newQuantity;
    //    const NewTransaction : StockTransactions = {
    //      TransactionId: uuidv4(),
    //      StockId,
    //      SenderId: ic.caller(),
    //      ReceiverId,
    //      Quantity,
    //      TransactionType: { TRANSFER: "TRANSFER"},
    //      Status: { PENDING:"PENDING"},
    //      CreatedAt: getCurrentDate()
    //    }
    //    StockStorage.insert(StockOpt.StockId, StockOpt);
    //    StockTransactionStorage.insert(NewTransaction.TransactionId,NewTransaction);
    //    return Ok("Sent to be approved!")
    //  }catch(error: any) {
    //    return Err({Error:`Error occured ${error.message}`})
    //  }
    // })

    
    
});

const getCurrentDate = () => {
  const timestamp = new Number(ic.time());
  const date = new Date(timestamp.valueOf() / 1_000_000); 
  return date.toISOString().split('T')[0]; 
};