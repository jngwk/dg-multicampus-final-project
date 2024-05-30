const useCustomNavigate = () => {
  //   const navigate = useCustomNavigate();
  const moveToLogin = () => {
    console.log("move to login");
  };
  const moveToSignUp = () => {
    console.log("move to signup");
  };
  return { moveToLogin, moveToSignUp };
};

export default useCustomNavigate;
