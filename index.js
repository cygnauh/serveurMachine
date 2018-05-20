var express = require('express')
var moment = require('moment')
var app = express(),
    server = require('http').createServer(app),
    bodyParser = require('body-parser'),
    cors = require("express-cors"),
    mysql = require('mysql');

const path = require('path')
const PORT = process.env.PORT || 5000

const user = ''
const password = ''

// var con = mysql.createConnection({
//     host: "us-cdbr-iron-east-04.cleardb.net",
//     user: "b339e2448721c6",
//     password: "efc16dbe",
//     database: "heroku_b716132ec2d76fe"
// });


// {multipleStatements: true}
var con  = mysql.createPool({
    connectionLimit : 100,
    host: "us-cdbr-iron-east-04.cleardb.net",
    user: "b339e2448721c6",
    password: "efc16dbe",
    database: "heroku_b716132ec2d76fe",
    multipleStatements: true
});


app
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(cors({
        allowedOrigins :['localhost:*', '127.0.0.1:*','127.0.0.1:8081','127.0.0.1:8080', '0.0.0.0:*'],
        headers:['X-Requested-With', 'Content-Type', 'authorization']
    }))

// con.connect(function(err) {
//     if (err) throw err;
// });



//route


app.get('/', (req, res) => res.render('pages/index'))

/*
app.get('/', (req, res) =>
        if(user != 'bddi' & password!='projetdelamour')
            res.redirect('/login')

        else
            res.render('pages/index')

       )

app.get('/login', (req, res) =>
        if(user == 'bddi' & password =='projetdelamour')
            res.redirect('/')
        else
            res.render('pages/login')
       )

app.get('/login/success', (req, res) =>
       if(req.body.user && req.body.user=='bddi')
            user = req.body.user
        else
            res.status(401)

        if(req.body.password && req.body.password=='projetdelamour')
            password = req.body.password
      )
*/





app.post('/addsound', function(req, res){
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        let name=bodyJson.name.toString()
        let url=bodyJson.url.toString()
        let type=bodyJson.type.toString()

        //CHECK IF there is already

        var getEverySound = "SELECT name FROM sound";
        getHelper(getEverySound, function(err,data){
            if (err) {
                // error handling code goes here
                console.log("ERROR : ",err);
            } else {
                var canAdd = true
                for(var i=0; i<data.length;i++){
                    if(data[i].name === name){
                        canAdd = false
                    }
                }
                if(canAdd == true){
                    var sql = "INSERT INTO sound (name, url, type) VALUES ('"+name+"', '"+url+"','"+type+"')";
                    getHelper(sql, function(err,data){
                        if (err) {
                            // error handling code goes here
                            console.log("ERROR : ",err);
                        } else {
                            console.log("1 record inserted");
                            res.status(201).json(data);
                        }
                    });

                    console.log("cant add")
                }else{
                    res.status(200).write("can't add, sound already exist");
                }
                console.log(JSON.parse(JSON.stringify(data)))

            }
        });


        // const getList = (getEverySound, queryParams) => {
        //     return new Promise(function(resolve, reject){
        //         con.query(queries[getEverySound], queryParams, function(err, result, fields){
        //             if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
        //             else reject(err);
        //         });
        //     });
        // };
        //
        // module.exports = {
        //     getList
        // };




    });
});

// ---- get every sounds

app.get('/everysounds', function (req, res) {
    getHelper("SELECT * FROM sound", function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            res.status(200).json(data);
        }
    });
});

// ---- get a sound from its name

app.get('/sound', function (req, res) {

    //http://localhost:8080/sound?sound=foret

    var sound_name='';

    if(req.param('sound')){
        sound_name = req.param('sound');
    }


    getHelper("SELECT * FROM sound WHERE name ='" + sound_name +"'", function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
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
            res.status(200).json(data);
        }
    });
});


// ---- get every non place sound

app.get('/sounds', function (req, res) {
    getHelper("SELECT * FROM sound WHERE type != 'place'", function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            res.status(200).json(data);
        }
    });
});


// ---- delete sound

app.delete('/deletesounds', function (req, res) {

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        // at this point, `body` has the entire request body stored in it as a string

        console.log(bodyJson.names)
        console.log(bodyJson.names.length)

        for(var i = 0 ; i<bodyJson.names.length; i++){
            var sql = "DELETE FROM sound WHERE name ='"+bodyJson.names[i]+"'" ;
            console.log(sql, 'sql')
            getHelper(sql, function(err,data){
                if (err) {
                    // error handling code goes here
                    console.log("ERROR : ",err);
                } else {
                    console.log("1 record inserted");
                    res.status(200).write(bodyJson[i]+ "delete");
                }
            });
        }
    });
});

// ---- post a story

app.post('/createStory', function(req, res){
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        let _title=bodyJson.title.toString()
        let _content=bodyJson.content.toString()


        //treat the ' in the string
        var title = _title.replace(/'/g, "''");
        var content = _content.replace(/'/g, "''");
        var sql = "INSERT INTO story (title, content) VALUES ('"+title+"', '"+content+"'); SELECT LAST_INSERT_ID();";

        getHelper(sql, function(err,data){
            if (err) {
                // error handling code goes here
                console.log("ERROR : ",err);
            } else {
                console.log(data)
                console.log("1 record inserted");
                res.status(200).json(data);
            }
        });

        //second task return the LAST ADD ID

    });
});

// ---- get every stories

app.get('/stories', function (req, res) {
    getHelper('SELECT * FROM story', function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);
        } else {
            res.status(200).json(data);
        }
    });
});

// ---- delete story

app.delete('/deletestories', function (req, res) {

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        // at this point, `body` has the entire request body stored in it as a string


        for(var i = 0 ; i<bodyJson.ids.length; i++){
            var sql = "DELETE FROM story WHERE id ='"+bodyJson.ids[i]+"'" ;
            console.log(sql, 'sql')
            getHelper(sql, function(err,data){
                if (err) {
                    // error handling code goes here
                    console.log("ERROR : ",err);
                } else {
                    res.status(200).write(bodyJson[i]+ "delete");
                }
            });
        }
    });
});


// ---- post a story sound

app.post('/createstorysound', function(req, res){
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        let story_id=bodyJson.storyId
        let sound_id=bodyJson.soundId
        let addAtTime=bodyJson.addAtTime

        // console.log(story_id)
        // at this point, `body` has the entire request body stored in it as a string

        var sql = "INSERT INTO story_sounds (story_id, sound_id, time) VALUES ( '"+story_id+"', '"+sound_id+"','"+addAtTime+"' )";
        getHelper(sql, function(err,data){
            if (err) {
                // error handling code goes here
                console.log("ERROR : ",err);
            } else {
                console.log("1 record inserted");
                res.status(200).json(data);
            }
        });
    });
});


// ---- get every story sounds

app.get('/storysounds', function (req, res) {
    getHelper('SELECT * FROM story_sounds', function(err,data){
        if (err) {
            console.log("ERROR : ",err);
        } else {
            res.status(200).json(data);
        }
    });
});

// ---- delete story sound

app.delete('/deletestorysound', function (req, res) {
    // res.status(200).write(" test delete");
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body);
        let bodyJson = JSON.parse(body)
        // at this point, `body` has the entire request body stored in it as a string

        console.log("hello")
        console.log(bodyJson)

        // res.status(200).write(bodyJson[i]+ "delete");


        for(var i = 0 ; i<bodyJson.ids.length; i++){
            var sql = "DELETE FROM story_sounds WHERE id ='"+bodyJson.ids[i]+"'" ;
            console.log(sql, 'sql')
            getHelper(sql, function(err,data){
                if (err) {
                    // error handling code goes here
                    console.log("ERROR : ",err);
                } else {
                    console.log("1 record inserted");
                    res.status(200).write(bodyJson[i]+ "delete");
                }
            });
        }
    });
});



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

function getHelper(query, callback) {
    con.query(query, function(err, result)
    {
        if (err)
            callback(err,null);
        else
            callback(null,result);
    });
}
