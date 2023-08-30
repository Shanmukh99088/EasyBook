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

app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connected...")
}).catch((err)=>{
    console.log(err)
})
app.listen(process.env.PORT || 5000,()=>{
    console.log("server running...")
})
