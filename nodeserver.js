var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var fs = require('fs')
var users = JSON.parse(fs.readFileSync('users.json', 'utf8'))
const path = require('path')
const router = express.Router()


app.use(express.static('.'))

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/api', function (request, response) {
  console.log('start api function 1.9')
  var newP = request.body
  console.log(newP)
  var flag = true
  for (var i = 0; i < users.db.length; i++) {
    if (users.db[i].name === newP.name) {
      flag = false
    }
  }
  // if person not found - person can be create
  if (flag) {
    users.db.push(newP)
    response.send(201)
    console.log('person created')
    var rawJson = JSON.stringify(users)
    fs.writeFileSync('users.json', rawJson)
  } else {
    response.send(400)
    console.log('person not created')
  }
  console.log(users)
})

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/signUp.html'))
})

app.get('/Allpersons', function (req, res) {
  var headHtml = '<html><html><head> <link rel="stylesheet" type="text/css" base href="/style.css">  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><title>All Persons</title></head><body>'
  var endHtml = '</body></html>'
  var htmlBody = '<h2>Users List</h2><ul class="list-group">'
  res.status(200)
  for (var i = 0; i < users.db.length; i++) {
    htmlBody += '<li class="list-group-item">'
    htmlBody += '<span> Name : ' + users.db[i].name
    htmlBody += '</span><span> Age : ' + users.db[i].age
    htmlBody += '</span><span> Is Male? : '
    htmlBody += users.db[i].isMale ? 'Yes' : 'no'
    htmlBody += '</span><span> Country : ' + users.db[i].country
    htmlBody += '</span></li>'
  }
  res.send(headHtml + htmlBody + endHtml)
})
app.use('/', router)
app.listen(process.env.PORT || 3000 , function () {
  console.log('up and running on port ' + process.env.PORT)
})
