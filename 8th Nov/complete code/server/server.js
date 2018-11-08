var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var app = express();
var router = express.Router();
console.log(__dirname);

var db = mongojs('mongodb://localhost/trainDb',[]);

app.use(express.static(path.join(__dirname,"../dist/train/")));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

router.post("/api/registerUser",function(req,res){
    console.log(req.body);
    db.users.insert({firstname:req.body.fname,lastname:req.body.lname},function(err,docs){
        res.json(docs);
    });
});

router.get("/api/listusers",function(req,res){
    db.users.find({},function(err,docs){
        res.json(docs);
    });
});

router.get("/api/editUser/:id",function(req,res){
    db.users.findOne({_id:mongojs.ObjectId(req.params.id)},function(err,docs){
        res.json(docs);
    });
});

router.put("/api/updateUser",function(req,res){
    db.users.findAndModify({
        query:{_id:mongojs.ObjectId(req.body._id)},
        update:{$set:{firstname:req.body.firstname,lastname:req.body.lastname}},
        new:true
    },
    function(err,doc){
        if(doc){
            res.json(doc);
        }
    
    })
});

router.delete("/api/deleteUser/:id",function(req,res){
    db.users.remove({_id:mongojs.ObjectId(req.params.id)},function(err,docs){
        res.json(docs);
    });
});

app.use(router);
app.listen(3000);
console.log("server is listening on port 3000");