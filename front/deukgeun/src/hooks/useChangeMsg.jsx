import {useState} from "react";

  const useChangeMsg = () => {
    const [viewmsg, setViewmsg] = useState(false);
  
    const ChangeMsg = () => {
        setViewmsg(!viewmsg);
    };
  
    return {
        viewmsg,
        ChangeMsg,
    };
  };
  
  export default useChangeMsg;