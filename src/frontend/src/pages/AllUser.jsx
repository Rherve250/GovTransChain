import React  from "react";
import Table from "../myComponents/Table";
import DashCard from "../myComponents/DashCard";





const Users=()=> {
    return(
        <>
		<h1 className="text-5xl p-4 font-bold text-gray-800 dark:text-white">
				Users
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-[95%] mx-auto mb-3">
				<DashCard name="Total Users" account={300}/>
				<DashCard  name="Total Programs" account={400}/>
				<DashCard name="Stock" account={3}/>
			</div>
            <div className="w-[95%]  mx-auto">
               <Table/>
			 
            </div>
			</>
			
		
    )
}

export default Users