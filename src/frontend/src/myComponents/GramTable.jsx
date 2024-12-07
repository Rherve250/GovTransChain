import React from "react";



const ProgramDashTable=()=>{
    return(
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Top Channels</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Program Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Leaders</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Citizens</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Beneficials</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="text-gray-800 dark:text-gray-100">Umuganda</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center">23</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-green-500">45</div>
                </td>
                <td className="p-2">
                  <div className="text-center">267</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )

}

export default ProgramDashTable