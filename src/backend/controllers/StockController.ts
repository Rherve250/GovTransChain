import { v4 as uuidv4 } from "uuid";
import { Err,Ok, ic  } from "azle/experimental";
import { 
    StockTransactionsProp,
    StockTransactions,
    StoreObject,
    StockPayload,
    Stock,
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
import { StockStats } from "../utils/systemStatistics";


class StockController {

    static  CreateStock=(payload:StockPayload)=>{
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
  
          if (!RoleAuth(UserProfile.Role,["HIGH_OFFICIAL"])) {
            return Err({ Unauthorized: "Access Denied" });
          }
          
          if(!ProgramOpt) {
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
          return Ok("Created successfully");
        }catch(error:any){
          return Err({Error: `Error Occured ${error.message}`})
        }
      };
    
    static  GetAllStock=()=>{
        try{
           const Stocks = StockStorage.values()
           if(Stocks.length == 0) {
            return Err({NotFound:"Stock is Empty"})
           }
           return Ok(Stocks)
        }catch(error: any) {
          return Err({Err: `Error occured ${error.message}`})
        }
      };

    static  StockStats=()=>{
        try{
          const Stocks = StockStorage.values();
  
          if(Stocks.length === 0){
            return Err({NotFound: "Empty Content"})
          }
        
         const StocksStats = StockStats(Stocks);
         return Ok(StocksStats)
    
        }catch(error:any){
          return Err({Error: `Error Occured ${error.message}`})
        }
      }
   
    static GetStore=()=>{
        try{
            const UserProfile = UserProfileStorage.get(ic.caller())
  
           if(!UserProfile){
             return Err({NoProfile: "No Profile"})
           }
           const StoreOpt = StoreStorage.get(UserProfile.ProfileId)
           if(!StoreOpt){
            return Err({NotFound: "No Stores"})
           }
           if(StoreOpt.stores.length == 0 ){
            return Err({NotFound:"Empty stock"})
           }
           console.log(StoreOpt.stores)
           return Ok(StoreOpt.stores)
        }catch(error: any) {
          return Err({Error: `Error Occured ${error.message}`})
        }
      }

}

export default StockController