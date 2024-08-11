const http = require('http');

const fs = require('fs')

const requests = require('requests');
const { chown } = require('fs/promises');

const homeFile = fs.readFileSync("home.html",'utf-8');

const replaceValue = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp)
    console.log(orgval);
    temperature = temperature.replace("{%mintemp%}",orgval.main.temp_min)
    temperature = temperature.replace("{%maxtemp%}",orgval.main.temp_max)
    temperature = temperature.replace("{%location%}",orgval.name)
    temperature = temperature.replace("{%country%}",orgval.sys.country)
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main)
    return temperature
}

const Server = http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Kannod&appid=b7406c322eaf624a78db29b8ec1c37ca")
        .on('data',  (chunk)=> {
            const objectdata = JSON.parse(chunk)
            const arr = [objectdata]
        const realTimeData = arr.map((value)=>replaceValue(homeFile,value)).join("")
        res.write(realTimeData)
        })
        .on('end',  (err) =>{
        if (err) return console.log('connection closed due to errors', err);
        res.end()
        console.log('end');
});

    }
})

Server.listen(8000,"127.0.0.1")