import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = (props) => {
    const CustomInput = forwardRef((props, ref) => (
      <button className={`h-11 py-3 px-4 w-[120px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold
        border-gray-400 focus:border-peach-fuzz focus:border-2 focus:outline-none peer my-2 `} onClick={props.onClick} ref={ref}>
        {props.value}
      </button>
    ));
  
    return (
      <div>
        <DatePicker
          shouldCloseOnSelect
          selected={props.selectedDate}
          onChange={props.setSelectedDate}
          dateFormat="yyyy/MM/dd"
          customInput={<CustomInput/>}
          showPopperArrow={false}
        />
      </div>
    );
  };
  
  export default CustomDatePicker;