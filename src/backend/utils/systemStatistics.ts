import { nat, text } from "azle/experimental";
import { ProfileStatProp, UserProfile } from "../data/dataType";

const ProgramStats=(Programs:any)=> {

    let totalProgram = Programs.length;
    let totalEnrolled = 0;
    let totalBenefecials = 0;
    Programs.forEach((Program:any) => {
      totalEnrolled += Program.Citizens.length
      totalBenefecials += Number(Program.Beneficials)
    });
    return {
      totalProgram,
      totalEnrolled,
      totalBenefecials
    };
  }
  
  const StockStats=(Stocks: any)=>{
    let totalStock = Stocks.length;
    let totalQuantity= 0;
    let totalRemaining = 0;
    Stocks.forEach((Stock:any) => {
        totalQuantity += Number(Stock.Quantity)
        totalRemaining += Number(Stock.RemainingStock)
      
    });
    return {
        totalStock,
        totalQuantity,
        totalRemaining,
    };
  
  }

  const getRoleCounts=(userProfiles: UserProfile[] = []):ProfileStatProp[] =>{
    const roles = ['HIGH_OFFICIAL', 'LOCAL_LEADER', 'CITIZEN'];
    return roles.map(role => ({
        Role: role,
        count: userProfiles.filter(profile => Object.values(profile.Role)[0] == role).length.toString(),
    }));
}

  export {
    ProgramStats,
    StockStats,
    getRoleCounts
  }