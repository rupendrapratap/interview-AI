const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
const app = require("./src/app")
const connecttodb = require("./src/config/database")

connecttodb() 

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})