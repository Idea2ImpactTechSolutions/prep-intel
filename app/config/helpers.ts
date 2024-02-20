require("dotenv").config();
export const generateClientId = (length: number) => {
  var result = "";
  var characters = "123456789123456789123456789";
  var charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const sendSuccess = (message: string, code: number, data: any) => {
  var success = {
    status: code,
    message,
    data,
  };

  return success;
};
