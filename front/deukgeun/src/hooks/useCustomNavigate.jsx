import { useNavigate as useReactRouterNavigate } from "react-router-dom";

const useCustomNavigate = () => {
  const navigate = useReactRouterNavigate();

  const customNavigate = (path, options) => {
    console.log(`${path}로 이동`);
    navigate(path, options);
  };

  return customNavigate;
};

export default useCustomNavigate;
