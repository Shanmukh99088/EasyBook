const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser")
const path = require("path")
const cors = require("cors")


dotenv.config();

const app = express();


//app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true })); 

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname,'uploads')));

app.use("/",userRoute);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://main.d1d0bnvalj6fok.amplifyapp.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Specify allowed HTTP methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Specify allowed headers
  next();
});


const corsOptions = {
  origin: 'https://main.d1d0bnvalj6fok.amplifyapp.com',
  optionsSuccessStatus: 200, 
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connected...")
}).catch((err)=>{
    console.log(err)
})
app.listen(process.env.PORT || 5000,()=>{
    console.log("server running...")
})
