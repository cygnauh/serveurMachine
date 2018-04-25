//Serveur

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    bodyParser = require('body-parser'),
    fs = require('fs'),
    cors = require("express-cors");

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
app.use(cors({
    allowedOrigins :['localhost:*', '127.0.0.1:*','127.0.0.1:8081', '0.0.0.0:*'],
    headers:['X-Requested-With', 'Content-Type', 'authorization']
}))


// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

con.connect(function(err) {
    if (err) throw err;
});

// ---- get every sounds

app.get('/sounds', function (req, res) {
    getHelper('SELECT * FROM sound', function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            // code to execute on data retrieval
            console.log("result from db is : ",data);
            console.log(JSON.stringify(data));
            res.status(200).json(data);
        }
    });
});

// ---- get a sound from his name

app.get('/sound', function (req, res) {

    //http://localhost:8080/sound?sound=foret

    var sound_name = req.param('sound');

    getHelper("SELECT * FROM sound WHERE name ='" + sound_name +"'", function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            // code to execute on data retrieval
            console.log("result from db is : ",data);
            console.log(JSON.stringify(data));
            res.status(200).json(data);
        }
    });
});



// ---- get every places

app.get('/places', function (req, res) {
    getHelper("SELECT * FROM sound WHERE type = 'place' ", function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            // code to execute on data retrieval
            console.log("result from db is : ",data);
            console.log(JSON.stringify(data));
            res.status(200).json(data);
        }
    });
});

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


// HELPERS


function getHelper(query, callback)
{
    con.query(query, function(err, result)
    {
        if (err)
            callback(err,null);
        else
            callback(null,result);
    });
}



app.listen(8080, () => {
    console.log('Server running on http://localhost:80')
})