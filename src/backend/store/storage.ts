import { Principal, StableBTreeMap,text } from "azle/experimental";
import { UserProfile, Program, Stock, StockTransactions, Store } from "../data/dataType";





const UserProfileStorage = StableBTreeMap<Principal,UserProfile>(0);
const ProgramStorage = StableBTreeMap<text, Program>(1);
const StockStorage = StableBTreeMap<text,Stock>(2)
const StockTransactionStorage = StableBTreeMap<text,StockTransactions>(3)
const StoreStorage = StableBTreeMap<text, Store>(4)


export {
    UserProfileStorage,
    ProgramStorage,
    StockTransactionStorage,
    StoreStorage,
    StockStorage
}