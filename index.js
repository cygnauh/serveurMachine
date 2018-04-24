//Serveur

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    bodyParser = require('body-parser'),
    fs = require('fs');

const store = require('./store')

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "projetdelamour",
    database: "tutorial_node_database"
});

app.use(require('express').static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

con.connect(function(err) {
    if (err) throw err;
});

app.get('/sound', function (req, res) {
    getSound('SELECT * FROM sound', function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            // code to execute on data retrieval
            console.log("result from db is : ",data);
            console.log(JSON.stringify(data));
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
            res.json(JSON.stringify(data));
            res.end();
        }
    });
});

app.get('/test', function (req, res) {
            res.end("hello test");
});


// app.get('/sound/:sound', function (req, res) {
//
//
//         con.query("SELECT * FROM sound", function (err, result, fields) {
//             if (err) throw err;
//             // console.log("sound : ",req.params.sound.toString());
//             if(result){
//                 console.log(result)
//                 return result
//             }
//         });
//
//
//     con.end()
// });



app.post('/data', function(req, res){

    // var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    var sql = "INSERT INTO story (title, content) VALUES ('Company Inc', 'Highway 37')";

    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function(err, result){
            if(err) throw err;
            console.log("1 record inserted");
        });
    });

    res.send(req.body.username)


    console.log('body: ', req.body)
});


function getSound(query, callback)
{
    con.query(query, function(err, result)
    {
        if (err)
            callback(err,null);
        else
            callback(null,result[0].url);
    });
}



app.listen(7555, () => {
    console.log('Server running on http://localhost:7555')
})