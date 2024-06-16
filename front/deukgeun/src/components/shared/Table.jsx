//테이블 화면 코드

import React from 'react';

const Table = ({ headers, data }) => {
    return (
        <table className="rounded-t-[20px] overflow-hidden min-w-full table-auto text-gray-800">
            <thead className="justify-between text-left">
                <tr className="bg-peach-fuzz bg-opacity-50">
                    {headers.map((header, index) => (
                        <th key={index} className="text-black px-4 py-2">
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <TableRow key={item.userId} item={item} />
                ))}
            </tbody>
        </table>
    );
};

const TableRow = ({ item }) => {
    return (
        <tr className="bg-white border-y-2 border-gray-200 text-sm">
            <td className="px-4 py-2">{item.userId}</td>
            <td className="px-4 py-2">{item.userName}</td>
            <td className="px-4 py-2">{item.email}</td>
            <td className="px-4 py-2">{item.address}</td>
            <td className="px-4 py-2">{item.role}</td>
        </tr>
    );
};

export default Table;
