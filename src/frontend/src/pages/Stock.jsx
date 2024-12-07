import React  from "react";
import DashCard from "../myComponents/DashCard";
import StockTable from "../myComponents/Tables/StockTable";

const Stock=()=> {
    return(
        <>
		<h1 className="text-5xl p-4 font-bold text-gray-800 dark:text-white">
				Stock
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-[95%] mx-auto mb-3">
				<DashCard name="Total Stock" account={30}/>
				<DashCard  name="Total Quantity" account={400}/>
				<DashCard name="Total used" account={3}/>
			</div>
            <div className="w-[95%]  mx-auto">
			<StockTable/>
			 
            </div>
			</>
			
		
    )
}

export default Stock