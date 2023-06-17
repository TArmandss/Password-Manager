const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());                                                 /* enables front-end and back-ends connection*/
app.use(express.json());                                         /* parses JSON object that was recieved from front-end and then req.body does its job*/

const db = mysql.createConnection({  
  user: "",                         /*Type in your settings*/
  host: "",
  password: "",
  database: "",
});

app.post("/addpassword", (req, res) => {
  const { password, title } = req.body;                           /* Here we are extracting password and title values from front-end */
  const hashedPassword = encrypt(password);
  db.query(                                                       /* To exacute SQL query */
    "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)", /* The SQL query that a user wants to exacute*/
    [hashedPassword.password, title, hashedPassword.iv],          /* An array of objects or parameters that shoud be passed to the query */
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success");
      }
    }
  );
});

app.get("/showpasswords", (req, res) => {
  db.query("SELECT * FROM passwords;", (err, result) => {         /* res contains the data that we get from MySql database*/
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {             
  res.send(decrypt(req.body));
});

app.listen(PORT, () => {
  console.log("Server is running");
});