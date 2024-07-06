import React from "react";

const useExpCheck = () => {
  const [isExpiredModalVisible, setIsExpiredModalVisible] = useState(false);
  const [isExpiringModalVisible, setIsExpiringModalVisible] = useState(false);

  const checkForExpiringMemberhip = async () => {
    try {
      if (Cookies.get("expAlert") === false) return;
      try {
        const expState = await checkExp();
        if (expState === "expired") {
          console.log(expState);
          setIsExpiredModalVisible(true);
        } else if (expState === "expiring") {
          console.log(expState);
          setIsExpiringModalVisible(true);
        }
      } catch (error) {
        console.log("error checking expdate");
      }
    } catch (error) {}
  };

  const ExpAlertModals = () => {
    return (
      <>
        {!isExpiringModalVisible && (
          <AlertModal
            headerEmoji={"⚠️"}
            line1={"회원님의 회원권이 7일 뒤에 만료됩니다."}
            line2={"'내정보'에서 간편하게 연장하세요!"}
            button1={{
              label: "다시 보지 않기",
              onClick: () => {
                Cookies.set("expAlert", false, 1);
              },
            }}
            button2={{
              label: "확인",
              onClick: () => setIsExpiringModalVisible(false),
            }}
          />
        )}
        {!isExpiredModalVisible && (
          <AlertModal
            headerEmoji={"⚠️"}
            line1={"회원님의 회원권이 만료됐습니다."}
            line2={"'내정보'에서 간편하게 연장하세요!"}
            button1={{
              label: "다시 보지 않기",
              onClick: () => {
                Cookies.set("expAlert", false, 1);
              },
            }}
            button2={{
              label: "확인",
              onClick: () => setIsExpiredModalVisible(false),
            }}
          />
        )}
      </>
    );
  };

  return { checkForExpiringMemberhip, ExpAlertModals };
};

export default useExpCheck;
