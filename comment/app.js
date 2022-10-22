const fs = require("fs");
const express = require("express");
const app = new express();
let port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/demo.html");
});
app.get("/comment", (req, res) => {
  Promise.all([readFilePromise("user.txt"), readFilePromise("comment.txt")])
    .then((data) => {
      data = JSON.stringify(getUserComment(data));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.write(data);
      return res.end();
    })
    .catch((err) => {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end(err);
    });
});
const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(new Error(err));
      }
      data = JSON.parse(data);
      return resolve(data);
    });
  });
};
function getUserComment(data) {
  let user_comment = [];
  let users = data[0];
  let comments = data[1];
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < comments.length; j++) {
      if (users[i]["id"] == comments[j]["user_id"]) {
        var object = {
          id: comments[j]["id"],
          user_id: comments[j]["user_id"],
          user_name: users[i]["name"],
          comment_content: comments[j]["content"],
          created_at: comments[j]["created_at"],
        };
        user_comment.push(object);
      }
    }
  }
  return user_comment;
}
app.post("/comment", (req, res) => {
  console.log(req.body);
});
app.listen(port, () => {
  console.log(`server running: http://127.0.0.1:${port}`);
});
