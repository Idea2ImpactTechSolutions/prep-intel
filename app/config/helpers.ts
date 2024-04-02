export const responseBody = (message: string, code: number, data: any) => {
  return {
    status: code,
    message,
    data,
  };
};
