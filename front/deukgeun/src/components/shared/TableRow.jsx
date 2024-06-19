//TableRow Component

import React from 'react';

// width값을 넘길 경우 마우스 휠로 스크롤 조정
const handleWheel = (e) => {
    if (e.deltaY !== 0) {
        e.currentTarget.scrollLeft += e.deltaY;
        e.preventDefault();
    }
};

const TableRow = ({ columns }) => {
    return (
        <tr className="bg-white border-y-2 border-gray-200 text-sm text-center ">
            {columns.map((column, index) => (
                <td key={index} className="py-2 min-w-[50px] max-w-[200px] overflow-x-auto whitespace-nowrap scrollbar-hide" onWheel={handleWheel}>
                    {column}
                </td>
            ))}
        </tr>
    );
};

export default TableRow;
