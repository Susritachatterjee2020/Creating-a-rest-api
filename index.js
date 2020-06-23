const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'StudentDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));


//Get all students
app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM Student', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get an students
app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Student WHERE StudentID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an students
app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Student WHERE StudentID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert an students
app.post('/students', (req, res) => {
    let stu = req.body;
    var sql = "SET @StudentID = ?;SET @Name = ?;StudentAGE @ = ?;SET @Standard = ?; \
    CALL StudentAddOrEdit(@StudentID,@Name,@StudentAGE,@Standard);";
    mysqlConnection.query(sql, [stu.StudentID, stu.Name, stu.StudentAGE, stu.Standard], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted student id : '+element[0].StudentID);
            });
        else
            console.log(err);
    })
});

//Update an students
app.put('/employees', (req, res) => {
    let stu = req.body;
    var sql = "SET @StudentID = ?;SET @Name= ?;SET @StudentAGE = ?;SET @Standard = ?; \
    CALL StudentAddOrEdit(@StudentID,@Name,@StudentAGE,@Standard);";
    mysqlConnection.query(sql, [stu.StudentID, stu.Name, stu.StudentAGE, stu.Standard], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});
