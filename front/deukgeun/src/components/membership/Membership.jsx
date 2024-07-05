import React, { useState } from "react";

const MembershipTable = ({ stats }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const itemsPerPage = 10;

  const tableHeader = (
    <thead>
      <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider rounded-tl-lg">
          등록 날짜
        </th>
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
          만료 날짜
        </th>
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
          멤버십 가입 이유
        </th>
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
          성별
        </th>
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
          나이
        </th>
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wider rounded-tr-lg">
          운동 경력
        </th>
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody className="bg-white">
      {stats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((membership, index) => (
        <tr
          key={index}
          className="transition-all hover:bg-gray-100 hover:shadow-lg"
        >
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.regDate}
          </td>
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.expDate}
          </td>
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.userMemberReason}
          </td>
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.userGender}
          </td>
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.userAge}
          </td>
          <td className="px-6 py-4 text-sm whitespace-nowrap border-b">
            {membership.userWorkoutDuration}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="container mx-auto p-6 relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {isVisible ? '▲' : '▼'}
      </button>
      {isVisible && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
          <table className="min-w-full">
            {tableHeader}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {tableBody}
            </div>
          </table>
          <div className="flex justify-between items-center bg-gray-100 px-4 py-3 border-t border-gray-200 sm:px-6">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, stats.length)}
                </span>{' '}
                of <span className="font-medium">{stats.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(stats.length / itemsPerPage)))}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipTable;