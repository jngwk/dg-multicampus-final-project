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
                    <TableRow key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    );
};

const TableRow = ({ item }) => {
    return (
        <tr className="bg-white border-y-2 border-gray-200 text-sm">
            <td className="px-4 py-2">{item.id}</td>
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.email}</td>
            <td className="px-4 py-2">{item.phone}</td>
            <td className="px-4 py-2">{item.website}</td>
        </tr>
    );
};

export default Table;
