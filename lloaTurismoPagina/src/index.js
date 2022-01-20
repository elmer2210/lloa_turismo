const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const expressSesscion = require('express-session');
const flash = require('connect-flash');
const MySQLStore = require("express-mysql-session");
const passport = require('passport')

const {database} = require('./keys');
const morgan = require("morgan");
const multer = require('multer');
const e = require("connect-flash");

//Storage de imagen
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/img_uploads'),
    filename: (req, file, cb)=>{
        let ext = path.extname(file.originalname);
        ext = ext.length > 1 ? ext : '.' + mime.extension(file.mimetype);
        const fileName = `${req.user.user_name}-${file.fieldname}-${Date.now()}-${ext}`;
        cb(null, fileName)
    }
});

//Initialitation
const app = express();
require('./database');
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views') );
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));

app.set('view engine', '.hbs')

//Middleware
app.use(expressSesscion({
    secret: 'mySecretApp',
    resave:false,
    saveUninitialized:false,
    store: new MySQLStore(database)
}))
app.use(flash());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'))
app.use(express.json()); 

//Guardamos la imagen
app.use(multer({
    storage:storage,
    fileFilter:(req, file, callback)=>{
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4') {
            return callback(new Error('Only images and videos are allowed'))
        } else {
            callback(null, true)
        }
    },
    dest: path.join(__dirname, 'public/img/img_uploads')
}).single('file'));

//Glovals Variables
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next()
})

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/gallery',require('./routes/gallery'));
app.use('/blog', require('./routes/blog'));
app.use('/new', require('./routes/new'));
app.use('/video', require('./routes/video'));
app.use('/menssage', require('./routes/message'));

//Static File
app.use(express.static(path.join(__dirname, 'public')));

//Server Listening
app.listen(app.get('port'), ()=> {
    console.log("The Server is listening on port: ", app.get('port'));
})
