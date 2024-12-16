import { ic } from "azle/experimental"

const getCurrentDate = () => {
    const timestamp = new Number(ic.time());
    const date = new Date(timestamp.valueOf() / 1_000_000); 
    return date.toISOString().split('T')[0]; 
  };

  export default getCurrentDate