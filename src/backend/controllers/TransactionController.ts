import { v4 as uuidv4 } from "uuid";
import { Err,Ok, ic  } from "azle/experimental";
import { 
    StockTransactionsProp,
    StockTransactions,
    StoreObject,
} from "../data/dataType";
import { RoleAuth  } from "../utils/authentication";
import getCurrentDate from "../utils/timeUtil";
import { 
    ProgramStorage, 
    UserProfileStorage,
    StoreStorage, 
    StockStorage, 
    StockTransactionStorage
} from "../store/storage";


class TransactionController {

   static Transfer=(payload:StockTransactionsProp)=> {
        try{
           const {  StockId, ReceiverId, Quantity } = payload;
           const UserProfileOpt = UserProfileStorage.get(ic.caller());
           const StockOpt = StockStorage.get(StockId);
           const  StoreOpt = StoreStorage.get(ReceiverId)
          if(!UserProfileOpt){
            return Err({NoProfile: "No Profile"})
          }
          if (!RoleAuth(UserProfileOpt.Role,["HIGH_OFFICIAL"])) {
            return Err({ Unauthorized: "Access Denied" });
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
          const newQuantity = (Number(StockOpt.RemainingStock) - Number(Quantity)).toString()
  
          StockOpt.RemainingStock = newQuantity;
          const NewTransaction : StockTransactions = {
            TransactionId: uuidv4(),
            StockId,
            SenderId: UserProfileOpt.ProfileId,
            ReceiverId,
            Quantity,
            TransactionType: { TRANSFER: "TRANSFER"},
            Status: { PENDING:"ACCEPT"},
            CreatedAt: getCurrentDate()
          }
  
          if(!StoreOpt){
             const newStore = {
                 stores:[{
                  StockId,
                  ProgramId: StockProgramOpt.ProgramId,
                  StockName: StockOpt.StockName,
                  Quantity
                }
                 ]
             }
  
             StoreStorage.insert(ReceiverId,newStore)
          }else{
          const otherStore = {
                  StockId,
                  ProgramId: StockProgramOpt.ProgramId,
                  StockName: StockOpt.StockName,
                  Quantity
          }
  
          StoreOpt.stores.push(otherStore)
          StoreStorage.insert(ReceiverId,StoreOpt)
        }
          StockStorage.insert(StockOpt.StockId, StockOpt);
          StockTransactionStorage.insert(NewTransaction.TransactionId,NewTransaction);
          return Ok("Transferred!")
        }catch(error: any) {
          return Err({Error:`Error occured ${error.message}`})
        }
      }
   
   static Distribute=(payload:StockTransactionsProp)=>{
    try{
        const {  StockId, ReceiverId, Quantity } = payload;
        const UserProfileOpt = UserProfileStorage.get(ic.caller());
        const receiveStoreOpt = StoreStorage.get(ReceiverId)
        
       if(!UserProfileOpt){
         return Err({NoProfile: "No Profile"})
       }
       const StoreOpt = StoreStorage.get(UserProfileOpt.ProfileId)
       if (!RoleAuth(UserProfileOpt.Role,["LOCAL_LEADER"])) {
        return Err({ Unauthorized: "Access Denied" });
      }

       if(!StoreOpt) {
         return Err({NotFound: "Stock not found"})
       }

       const ItemsExist = StoreOpt.stores.findIndex((item:StoreObject)=>(
         item.StockId == StockId
       ))
       
       if(ItemsExist == -1){
         return Err({NotFound:"Not stock for the item"})
       }

       const StockOpt = StoreOpt.stores[ItemsExist]

       const StockProgramOpt = ProgramStorage.get(StockOpt.ProgramId);

       if(!StockProgramOpt) {
         return Err({ NotFound: "Not program found"})
       }

       if(!StockProgramOpt.Citizens.includes(ReceiverId)){
         return Err({NotFound: "Add citizen to list"})
       }

       if(StockOpt.Quantity < Quantity){
       return Err({Error: "No enough stock"})
       }
       const newQuantity = Number(StockOpt.Quantity) - Number(Quantity)
       if(!receiveStoreOpt){
         const newStore = {
           stores:[{
            StockId,
            ProgramId: StockProgramOpt.ProgramId,
            StockName: StockOpt.StockName,
            Quantity
          }
           ]
       }

       StoreStorage.insert(ReceiverId,newStore)
       }else {
         const otherStore = {
           StockId,
           ProgramId: StockProgramOpt.ProgramId,
           StockName: StockOpt.StockName,
           Quantity
         }
         receiveStoreOpt.stores.push(otherStore)
   StoreStorage.insert(ReceiverId,receiveStoreOpt)
       }

       StoreOpt.stores[ItemsExist].Quantity = newQuantity.toString();

       StoreStorage.insert(UserProfileOpt.ProfileId,StoreOpt)
     const NewTransaction : StockTransactions = {
         TransactionId: uuidv4(),
         StockId,
         SenderId: UserProfileOpt.ProfileId,
         ReceiverId,
         Quantity,
         TransactionType: { TRANSFER: "DISTRIBUTE"},
         Status: { PENDING:"ACCEPTED"},
         CreatedAt: getCurrentDate()
       }
        
       StockTransactionStorage.insert(NewTransaction.TransactionId,NewTransaction);
       return Ok("Sent to be approved!")
     }catch(error: any) {
       return Err({Error:`Error occured ${error.message}`})
     }
  };

  static  AllTransactions=()=>{
    try{
        const Transactions = StockTransactionStorage.values()
        if(Transactions.length== 0 ){
          return Err({NotFound: "Empty transaction"})
        }
        return Ok(Transactions)
    }catch(error: any){
      return Err({Error: `Error Occured ${error.message}`})
    }
  }


}

export default TransactionController