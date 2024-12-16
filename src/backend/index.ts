import {
    query,
    update,
    text,
    Vec,
    Result,
    Canister,
  } from "azle/experimental";

import ProfileController from "./controllers/ProfileController";
import ProgramController from "./controllers/ProgramController";
import TransactionController from "./controllers/TransactionController";
import StockController from "./controllers/StockController";
import { 
  UserProfilePayload,
  Message, 
  UserProfile,
  UserProfileDisplay,
  ProgramPayload,
  DisplayProgram,
  ProgramStat,
  StockPayload,
  Stock,
  StockStat,
  StockTransactions,
  StoreObject,
  ChangeRoleProps,
  StockTransactionsProp,
  ProfileStatProp,
} from "./data/dataType";
import { getRoleCounts } from "./utils/systemStatistics";




export default Canister({
    
    CreateProfile: update([UserProfilePayload], Result(text,Message), (payload)=>{
       return ProfileController.createProfile(payload)
    }),
    
    getProfile:query([],Result(UserProfile, Message),()=>{
     return ProfileController.GetProfile()
    }),

    GetAllLeader: query([],Result(Vec(UserProfile), Message),()=>{
      return ProfileController.GetAllLeader()
    }),
    GetAllProfile: query([], Result(Vec(UserProfileDisplay),Message),()=>{
     return ProfileController.GetAllProfile()
    }),
    
    userProfileStats: query([], Result(Vec(ProfileStatProp), Message),()=>{
      return ProfileController.GetRoleCount()
    }),


    // Program endpoints
    CreateProgram: update([ProgramPayload],Result(text, Message), (payload)=>{
     return ProgramController.CreateProgram(payload)
    }),

    GetAllProgram:query([], Result(Vec(DisplayProgram), Message),()=>{
     return ProgramController.GetAllProgram()
    }),

    ProgramStats:query([],Result(ProgramStat,Message),()=>{
     return ProgramController.ProgramStats()
    }),

    // Stock endpoints
    CreateStock:update([StockPayload], Result(text, Message),(payload)=>{
      return StockController.CreateStock(payload)
    }),

    GetAllStock:query([], Result(Vec(Stock), Message),()=>{
      return StockController.GetAllStock()
    }),

    StockStats:query([],Result(StockStat,Message),()=>{
     return StockController.StockStats()
    }),

    AllTransactions: query([],Result(Vec(StockTransactions), Message),()=>{
      return TransactionController.AllTransactions()
    }),

    GetStore: query([], Result(Vec(StoreObject),Message),()=>{
     return StockController.GetStore()
    }),
    ChangeRole: update([ChangeRoleProps], Result(text, Message), (payload)=> {  
     return ProfileController.ChangeRole(payload)

    }),
    AddLeaderToProgram: update([text,text], Result(text,Message), (ProgramId,LeaderId)=>{
     return ProgramController.AddLeaderToProgram(ProgramId,LeaderId)
    }),
 

    CitizenRequest: update([text], Result(text, Message), (ProgramId)=>{
     return ProgramController.CitizenRequest(ProgramId)
    }),
  
    ProgramLeaders:query([text],Result(Vec(UserProfile),Message),(ProgramId)=>{
      return ProgramController.ProgramLeaders(ProgramId)
    }),

    ProgramCitizens:query([text],Result(Vec(UserProfile),Message),(ProgramId)=>{
      return ProgramController.ProgramCitizens(ProgramId)
    }),


    ViewRequest: query([text], Result(Vec(UserProfile),Message), (ProgramId)=>{
     return ProgramController.ViewRequest(ProgramId)
    }),
   
    ApproveRequest: update([text, text],Result(text, Message), (ProgramId,ProfileId)=>{
     return ProgramController.ApproveRequest(ProgramId,ProfileId)
    }),

    Transfer:update([StockTransactionsProp],Result(text,Message),(payload)=> {
     return  TransactionController.Transfer(payload)
    }),


    Distribute: update([StockTransactionsProp],Result(text,Message),(payload)=>{
     return TransactionController.Distribute(payload)
   })
      
});


