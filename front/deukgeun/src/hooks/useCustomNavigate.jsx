const useCustomNavigate = () => {
  //   const navigate = useNavigate();
  const moveToLogin = () => {
    console.log("move to login");
  };
  const moveToSignUp = () => {
    console.log("move to signup");
  };
  return { moveToLogin, moveToSignUp };
};

export default useCustomNavigate;
