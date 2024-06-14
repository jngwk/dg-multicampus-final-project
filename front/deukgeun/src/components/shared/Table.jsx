//Table Component
import React from 'react';
import TableRow from './TableRow';

const Table = ({ headers, data, extractColumns }) => {
    return (
        <div className="overflow-auto max-w-full ">
            <table className="rounded-t-[20px] overflow-hidden min-w-full table-auto text-gray-800">
                <thead className="justify-between text-left">
                    <tr className="bg-peach-fuzz bg-opacity-50 text-center ">
                        {headers.map((header, index) => (
                            <th key={index} className="text-black px-4 py-2 ">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <TableRow key={item.id} columns={extractColumns(item)} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
