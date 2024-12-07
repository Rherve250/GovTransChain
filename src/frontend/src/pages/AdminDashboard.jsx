import React from "react";
import DashCard from "../myComponents/DashCard";
import Chart from "../myComponents/Chart";
import BarChart from "../myComponents/BarChart";
import DashTable from "../myComponents/DashTable";
import ProgramDashTable from "../myComponents/GramTable";
import TransactionTable from "../myComponents/TransactionTable";


const AdminDashboard=()=> {
    return(
        <>
		<h1 className="text-5xl p-4 font-bold text-gray-800 dark:text-white">
				Dashboard
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-[95%] mx-auto mb-3">
                <DashCard name="Total Users" account={300}/>
				<DashCard  name="Total Programs" account={400}/>
				<DashCard name="Stock" account={3}/>
			</div>
            <div className="w-[95%]  mx-auto">
               <div className="grid grid-cols-12 gap-6">
                   <Chart/>
                   <DashTable />
                   <BarChart/>
                   <ProgramDashTable />
                   <TransactionTable/> 

               </div>
            </div>
	</>
			
		
    )
}

export default AdminDashboard