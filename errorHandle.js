function errorHandle(response) {
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  response.writeHead(400, header);
  response.write(
    JSON.stringify({
      status: "fail",
      message: "欄位未填寫正確，或無此todo ID2",
    })
  ); //變成json內容
  response.end(); //資料傳送過去
}

module.exports = errorHandle;
