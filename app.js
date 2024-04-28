const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/day.js");

const app = express();
app.set('view engine' , 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser : true});

// const tasks = ["task1" , "task2", "task3"];
// const works =[];
const taskschema = {
    name : String
};

const taskmodel = mongoose.model("Task",taskschema);

const task1 = new taskmodel({
    name : "Welcome to youe todolist!"
});
const task2 = new taskmodel({
    name : "Hit the + button to add a new item"
});
const task3 = new taskmodel({
    name : "<-- this is to delete an item"
});

const defaulttask = [task1, task2, task3]

const listSchema = {
    name : String,
    tasks : [taskschema]
}
const newtodo = mongoose.model("List",listSchema);

app.get("/",function(req,res){
    var day = date.getdate();
    taskmodel.find({},function(err,result){
        if(result.length === 0)
        {
            taskmodel.insertMany(defaulttask,function(err){
                if(err) console.log(err);
                else console.log("done");
            });
            res.redirect("/");
        }
        else
        {

            res.render("list",{listtitle : day, newwork : result});
        }
    });
    
})

app.post("/",function(req,res){

    const taskname = req.body.newtask;

    const task = new taskmodel({
        name : taskname
    });
    var day = date.getdate();
    if(req.body.workbtn === day)
    {
        task.save();
        res.redirect("/");
    }
    else
    {  
       newtodo.findOne({name : req.body.workbtn},function(err,result){
        result.tasks.push(task);
        result.save();
        res.redirect("/"+result.name);
       });
    }
})

app.post("/delete",function(req,res){
    const delid = req.body.check;
    const listname = req.body.listname;
    var day = date.getdate();
    if(listname == day)
    {
        taskmodel.deleteOne({_id: delid},function(err){
            if(err) console.log(err);
            else res.redirect("/");
        });
    }
    else
    {
        newtodo.findOneAndUpdate({name : listname},{$pull: {tasks : {_id : delid}}},function(err,result){
            if(!err)
            {
                res.redirect("/"+listname);
            }
        });
    }
});


app.get("/:newlist",function(req,res){
    const newlistname = _.capitalize(req.params.newlist);
    
    newtodo.findOne({name : newlistname},function(err,result){
        if(!result){
            const list = new newtodo(
                {
                    name : newlistname,
                    tasks : defaulttask
                });
            list.save();
            res.redirect("/"+newlistname);
        }
        else {
            // console.log("nothing new");
            res.render("list",{listtitle: result.name, newwork : result.tasks});
        }
    });
});


app.listen(process.env.PORT || 4000,function(){
    console.log("server is hosted on port 4000");
})