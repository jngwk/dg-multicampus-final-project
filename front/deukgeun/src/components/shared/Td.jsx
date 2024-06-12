import React from "react";

const Td = ({item}) => {
    return (
        <>
        <tr className="bg-white border-y-2 border-gray-200">
            <td className="px-4 py-3">{item.id}</td>
            <td className="px-4 py-3">{item.name}</td>
            <td className="px-4 py-3">{item.email}</td>
            <td className="px-4 py-3">{item.phone}</td>
            <td className="px-4 py-3">{item.website}</td>

        </tr>
        </>
    )
};

export default Td;