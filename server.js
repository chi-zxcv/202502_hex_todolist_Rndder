const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errHAndle = require("./errorHandle");
const todos = [
  {
    title: "明天要上班",
    id: uuidv4(),
  },
  {
    title: "晚上要上課",
    id: uuidv4(),
  },
];

const requestListener = function (request, response) {
  console.log(request.url);
  console.log(request.method);
  //首頁

  //const header = { "Content-Type": "text/plain" };
  const header = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";
  // Get the data as utf8 strings.
  // If an encoding is not set, Buffer objects will be received.
  //request.setEncoding("utf8");

  // Readable streams emit 'data' events once a listener is added.
  request.on("data", (chunk) => {
    console.log(chunk);
    body += chunk;
  });

  if (request.url == "/todos" && request.method == "GET") {
    response.writeHead(200, header);
    //response.write("index"); 原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    ); //變成json內容
    response.end(); //資料傳送過去 for get data
  } else if (request.url == "/todos" && request.method == "POST") {
    // The 'end' event indicates that the entire body has been received.
    request.on("end", () => {
      try {
        //console.log(body); // 這是JSON格式
        //console.log(JSON.parse(body).title); // 轉成物件格式
        const title = JSON.parse(body).title;
        console.log(title);
        if (title !== undefined) {
          //deal with this topic
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          ); //變成json內容
          response.end(); //資料傳送過去
        } else {
          errHAndle(response);
        }
      } catch (error) {
        // uh oh! bad json!
        console.log(error, "程式錯誤");
        errHAndle(response);
      }
    });
  } else if (request.url == "/todos" && request.method == "DELETE") {
    response.writeHead(200, header);
    todos.length = 0;
    //response.write("index"); 原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    ); //變成json內容
    response.end(); //資料傳送過去 for get data
  } else if (request.url.startsWith("/todos/") && request.method == "DELETE") {
    const id = request.url.split("/").pop();
    const index = todos.findIndex((element) => element.id == id);
    console.log(id, index);
    if (index !== -1) {
      todos.splice(index, 1);
      response.writeHead(200, header);
      response.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      ); //變成json內容
      response.end(); //資料傳送過去
    } else {
      errHAndle(response);
    }
  } else if (request.url.startsWith("/todos/") && request.method == "PATCH") {
    request.on("end", () => {
      try {
        //console.log(body); // 這是JSON格式
        //console.log(JSON.parse(body).title); // 轉成物件格式
        const todo = JSON.parse(body).title;
        const id = request.url.split("/").pop();
        const index = todos.findIndex((element) => element.id == id);
        console.log(todo, id, index);
        //response.end(); //資料傳送過去 //
        if (todo !== undefined && index !== -1) {
          //deal with this topic
          todos[index].title = todo;
          response.writeHead(200, header);
          response.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          ); //變成json內容
          response.end(); //資料傳送過去
        } else {
          errHAndle(response);
        }
      } catch (error) {
        // uh oh! bad json!
        console.log(error, "程式錯誤");
        errHAndle(response);
      }
    });
  } else if (request.method == "OPTIONS") {
    response.writeHead(200, header);
    response.end();
  } else {
    response.writeHead(404, header);
    //response.write("not found"); //原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "fail",
        message: "無此網站路由",
      })
    ); //變成json內容
    response.end(); //資料傳送過去
  }
  /*
  if (request.url == "/" && request.method == "GET") {
    response.writeHead(200, header);
    //response.write("index"); 原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "success",
        data: [],
      })
    ); //變成json內容
    response.end(); //資料傳送過去
  } else if (request.url == "/" && request.method == "DELETE") {
    response.writeHead(200, header);
    //response.write("刪除成功"); //原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "DELETE",
        data: [],
      })
    ); //變成json內容
    response.end(); //資料傳送過去
  } else if (request.method == "OPTIONS") {
    response.writeHead(200, header);
    response.end();
  } else {
    response.writeHead(404, header);
    //response.write("not found"); //原本只有顯示內容
    response.write(
      JSON.stringify({
        status: "fail",
        message: "無此網站路由",
      })
    ); //變成json內容
    response.end(); //資料傳送過去
  }
*/ //basic knowledge
};
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
