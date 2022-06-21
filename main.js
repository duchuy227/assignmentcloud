var express = require('express')
var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://leduchuy227:leduchuy227@ac-uijn7xw-shard-00-00.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-01.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-02.q7dpd26.mongodb.net:27017/test?replicaSet=atlas-hoj30z-shard-0&ssl=true&authSource=admin'

app.get('/', (req,res) =>{
    res.render('home')
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOYS")
   
    let products = await dbo.collection('TOYS').find({'name': new RegExp(name,'i')}).toArray()
    res.render('AllProduct',{'products':products})
})

app.post('/NewProduct',async (req,res)=>{
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let description = req.body.txtDescription
    let amount = req.body.txtAmount
    let product = {
        'name':name,
        'price': price,
        'picURL':picURL,
        'description': description,
        'amount': amount
    }
    //insert product vao database
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNTOYS");
    //3.insert product vao database ATNToys, trong table product
    await dbo.collection("TOYS").insertOne(product);
    //goi lai trang home
    if (product == null) {
        res.render('/')
    }
    res.redirect('/viewAll')
})

app.get('/viewAll',async (req,res)=>{
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNTOYS");
    //tra ve toan bo bang product
    let products = await dbo.collection("TOYS").find().toArray()
    //hien thi trang viewProduct voi Product trong Database tra ve
    res.render('AllProduct',{'products':products})
})

app.get('/create',(req,res)=>{
    res.render('NewProduct')
})

const PORT = process.env.PORT || 8000
app.listen(PORT)
console.log("Dậy Đi Ông Cháu Ơi")