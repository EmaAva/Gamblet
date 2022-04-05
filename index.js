var express=require('express');
var app = express();
//-------------------------------
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
//-------------------------------
var multer=require('multer');
var upload=multer();
app.use(upload.array());
//-------------------------------
var session=require('express-session');
app.use(session({secret:"secret key"}));
//-------------------------------
app.set('view engine','pug');
app.set('views','static/views');
app.use(express.static('static'));
app.use(express.static('static/css'));
app.use(express.static('static/font'));
app.use(express.static('static/images'));
app.use(express.static('static/js'));
//-------------------------------
//-------------------------------
var Users=[];
//-------------------------------
app.get('/', function(req,res){
    res.render('index');
})
//-------------------------------
app.get('/signup',function(req,res){
    res.render('signup');
});
//-------------------------------
app.post('/signup',function(req,res){
    if(!req.body.userid || !req.body.password){
        res.status("400");
        res.send("Invalid details!");
    }else{
        var search=false;
        Users.filter(function(user){
            if(user.userid===req.body.userid){search=true;}
        });
        if(search){
            res.render('signup',{message:"User already exists! Login or choose another user id"});
        }else{
            var newUser={userid:req.body.userid,password:req.body.password};
            Users.push(newUser);
            req.session.user=newUser;
            res.redirect('/login');
        }
    }
});
//-------------------------------
function checkSignIn(req,res,next){
    if(req.session.user){
        next();
    }else{
        var err=new Error("Not logged in");
        console.log(req.session.user);
        next(err);
    }
}
//------------------------------
app.get('/protected_page', checkSignIn,function(req,res){
    res.render('protected_page',{userid:req.session.user.userid})
});
//------------------------------
app.get('/login',function(req,res){
    res.render('login');
});
//------------------------------
app.post('/login',function(req,res){
    console.log(Users);
    if(!req.body.userid||!req.body.password){
        res.render('login',{message:"Please enter both id and password"});
    }else{
        var search=false;
        Users.filter(function(user){
            if(user.userid===req.body.userid && user.password ===req.body.password){
                search=true;
                req.session.user=user;
            }
        });
        if(search){
            res.redirect('/protected_page'); 
        }else{
            console.log("login invalid credentials");
            res.render('login',{message:"Invalid credentials!"});
        }
    }
});
//-------------------------------
app.get('/logout',function(req,res){
    req.session.destroy(function(){
        console.log("user logged out");
    });
    res.redirect('/login');
});
//-------------------------------
app.use('/protected_page',function(err,req,res,next){
    console.log(err);
    res.redirect('/login');
});
//-------------------------------
app.listen(3000,function(){
    console.log('Server is active on port 3000');
})