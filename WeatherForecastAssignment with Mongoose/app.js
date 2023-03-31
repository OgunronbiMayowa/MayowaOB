import express from "express";
import bodyParser from "body-parser";
import htpps from "https"
import request from "request";
import { response } from "express";
import fetch from "node-fetch";
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from "ejs";
import mongoose from "mongoose";
import _ from "lodash";


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect your db to a specified port and give the db a name 
mongoose.connect("mongodb://localhost:27017/weatherForecastDB", {useNewUrlParser: true});

// Create a Schema for User
var userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  password: Array
});

// Create a model for User. Monogoose automatically creates a Collection called users 
var User = mongoose.model("User", userSchema);

// Create a new User document
var admin = new User({
  fullName: "Mayowa Ogunronbi",
  email: "ogunronbimayowa13@gmail.com",
  password: ["1234", "1234"]
})

var myData = "";

app.get("/", function(req, res) {
    res.render("signIn");
});

app.get("/signUp", function(req, res) {
    res.render("signUp");
})

app.get("/dashboard", function(req, res) {
    // Current Weather API 
    const apiKeyCurrentDefault = "92e617ad070b749d589b460106c1e10d";
    const unitCurrentDefault = "metric"
    const urlCurrenDefault = "https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=" + apiKeyCurrentDefault + "&units=" + unitCurrentDefault ;

    fetch(urlCurrenDefault, {
        method:"get"
    }).then(response=> response.json()).then(dataDefault=> {
        // data for the weatherCurrent (data)
        const tempMinDefault = dataDefault.main.temp_min;
        const tempMaxDefault = dataDefault.main.temp_max;
        const humidityDefault = dataDefault.main.humidity;
        const pressureDefault = dataDefault.main.pressure;
        const descriptionDefault = dataDefault.weather[0].description
        const imageDefault = "http://openweathermap.org/img/wn/" + dataDefault.weather[0].icon + "@2x.png";
    
        res.render("dashboard", {
            tempMinDefault: tempMinDefault, tempMaxDefault: tempMaxDefault, humidityDefault: humidityDefault, pressureDefault: pressureDefault, descriptionDefault: descriptionDefault, imageDefault: imageDefault
        });
    })

})

app.get("/result", function(req, res) {
    res.render("result");

})

app.post("/signUp", function(req, res) {
    myData = new User (req.body);
    myData.save().then(item => {
        res.render("signIn")
    }).catch(e => {
        res.status(400).send(e)
    })
})

app.post("/", function(req, res) {
    var fullNameInput = _.startCase(_.toLower(req.body.fullName));
    User.findOne({fullName: fullNameInput}, function(e, result) {
        if(e) {
            console.log(e)
        } else {
            if (result === null) {
                res.redirect("/signUp")
            } else {
                res.redirect("/dashboard")
            }
        }
    })
})

app.post("/dashboard", function(req, res) {
    // Current Weather API 
    const cityCurrent = req.body.location;
    const apiKeyCurrent = "92e617ad070b749d589b460106c1e10d";
    const unitCurrent = "metric"
    const urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCurrent + "&appid=" + apiKeyCurrent + "&units=" + unitCurrent ;
    
    // 5-day Weather Forecast API 
    const city = req.body.location;
    const apiKey = "92e617ad070b749d589b460106c1e10d";
    const unit = "metric"
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=" + unit ;

    async function APIs() {
        const [weatherCurrent, weatherForecast] = await Promise.all([
            fetch(urlCurrent),
            fetch(url)
        ]);
        const data = await weatherCurrent.json();
        const data1 = await weatherForecast.json();
        return [data, data1];
    }
    
    APIs().then(([data, data1]) => {
        // data for the weatherCurrent (data)
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const description = data.weather[0].description
        const image = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";


        // data for the weatherForecast (data1)
        // Temperature data 
        const temp1 = data1.list[2].main.temp;  
        const temp2 = data1.list[10].main.temp;
        const temp3 = data1.list[18].main.temp;
        const temp4 = data1.list[26].main.temp;
        const temp5 = data1.list[34].main.temp;
 
        // Humidity data 
        const humidity1 = data1.list[2].main.humidity;
        const humidity2 = data1.list[10].main.humidity;
        const humidity3 = data1.list[18].main.humidity;
        const humidity4 = data1.list[26].main.humidity;
        const humidity5 = data1.list[34].main.humidity;
 
        // Pressure data 
        const pressure1 = data1.list[2].main.pressure;
        const pressure2 = data1.list[10].main.pressure;
        const pressure3 = data1.list[18].main.pressure;
        const pressure4 = data1.list[26].main.pressure;
        const pressure5 = data1.list[34].main.pressure;
 
         // Weather Description 
        const description1 = data1.list[2].weather[0].description;   
        const description2 = data1.list[10].weather[0].description;
        const description3 = data1.list[18].weather[0].description;
        const description4 = data1.list[26].weather[0].description;
        const description5 = data1.list[34].weather[0].description;
 
        // Weather Images
        const image1 = "http://openweathermap.org/img/wn/" + data1.list[2].weather[0].icon + "@2x.png";
        const image2 = "http://openweathermap.org/img/wn/" + data1.list[10].weather[0].icon + "@2x.png";
        const image3 = "http://openweathermap.org/img/wn/" + data1.list[18].weather[0].icon + "@2x.png";
        const image4 = "http://openweathermap.org/img/wn/" + data1.list[26].weather[0].icon + "@2x.png";
        const image5 = "http://openweathermap.org/img/wn/" + data1.list[34].weather[0].icon + "@2x.png";
        

        res.render("result", {
            temp: temp, temp1: temp1, temp2: temp2, temp3: temp3, temp4: temp4, temp5: temp5,
            humidity: humidity, humidity1: humidity1, humidity2: humidity2, humidity3: humidity3, humidity4: humidity4, humidity5: humidity5,
            pressure: pressure, pressure1: pressure1, pressure2: pressure2, pressure3: pressure3, pressure4: pressure4, pressure5: pressure5,
            description: description, description1: description1, description2: description2, description3: description3, description4: description4, description5: description5,
            image: image, image1: image1, image2: image2, image3: image3, image4: image4, image5: image5,
            city: city
        });

    }).catch(error => {
        console.log(error);
    });
        
})

// app.post("/", function(req, res) {
//     res.render("signIn");
// })

app.listen(1200, function() {
    console.log("Server now running on port 1200");
})