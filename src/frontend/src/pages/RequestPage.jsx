import React  from "react";
import RequestTable from "@/myComponents/Tables/RequestTable";

const RequestPage=()=> {
    return(
        <>
		<h1 className="text-5xl p-4 font-bold text-gray-800 dark:text-white">
				Request Citizens
			</h1>
            <div className="w-[95%]  mx-auto">
            <RequestTable/>
			 
            </div>
			</>
			
		
    )
}

export default RequestPage