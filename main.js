var express = require('express');

const async = require('hbs/lib/async')
const mongo = require('mongodb');
const { ObjectId } = require('mongodb')



var app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient
// var url = 'mongodb://localhost:27017'

var url = 'mongodb://leduchuy2207:leduchuy2002@ac-uijn7xw-shard-00-00.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-01.q7dpd26.mongodb.net:27017,ac-uijn7xw-shard-00-02.q7dpd26.mongodb.net:27017/test?replicaSet=atlas-hoj30z-shard-0&ssl=true&authSource=admin'

app.get('/', (req,res) =>{
    res.render('home')
})

app.get('/homepage', async(req,res)=>{
    var page = req.query.page
    
    //1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNTOY");

    if (page == 1) {
        let products = await dbo.collection("TOY").find().limit(4).toArray()
        res.render('homepage', {'products': products})
    } else if (page == 2) {
        let products = await dbo.collection("TOY").find().skip(4).limit(4).toArray()
        res.render('homepage', {'products': products})
    } else if (page == 3) {
        let products = await dbo.collection("TOY").find().skip(8).limit(4).toArray()
        res.render('homepage', {'products': products})
    } else {
        let products = await dbo.collection("TOY").find().toArray()
        res.render('homepage', {'products': products})
    }  
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")
   
    let products = await dbo.collection('TOY').find({$or:[{'name': new RegExp(name,'i')},{'price': new RegExp(name)}]}).toArray() //{'_id': ObjectId(name) : tim theo id 
    res.render('AllProduct',{'products':products})
})

app.post('/sortName', async(req,res)=>{
    let name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")
    
    let products = await dbo.collection('TOY').find({'name': new RegExp(name,'i')}).sort({'name':1}).toArray()
    res.render('AllProduct',{'products':products})
})

app.post('/ascending', async(req,res)=>{
    let sortPrice = req.body.txtPrice

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")

    let products = await dbo.collection('TOY').find({'name': new RegExp(sortPrice,'i')}).sort({'price':1}).toArray()

    res.render('AllProduct',{'products':products})
})

app.post('/decrease', async(req,res)=>{
    let sortPrice = req.body.txtPrice

    let server = await MongoClient.connect(url)

    let dbo = server.db("ATNTOY")

    let products = await dbo.collection('TOY').find({'name': new RegExp(sortPrice, 'i')}).sort({'price':-1}).toArray()

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
    let dbo = client.db("ATNTOY");
    //3.insert product vao database ATNToys, trong table product
    await dbo.collection("TOY").insertOne(product);
    //goi lai trang home
    if (product == null) {
        res.render('/')
    }
    res.redirect('/viewAll')
})

app.get('/viewAll',async (req,res)=>{
    var page = req.query.page

    // 1.ket noi den database server voi dia chi la url
    let client= await MongoClient.connect(url);
    //2.truy cap database ATNToys
    let dbo = client.db("ATNTOY");
    // tra ve toan bo bang product
    if (page == 1) {
        let products = await dbo.collection("TOY").find().limit(5).toArray()
        res.render('AllProduct',{'products':products})
    } else if (page == 2) {
        let products = await dbo.collection("TOY").find().skip(5).limit(5).toArray()
        res.render('AllProduct',{'products':products})
    } else {
        let products = await dbo.collection("TOY").find().toArray()
        res.render('AllProduct',{'products':products})
    }
    //hien thi trang viewProduct voi Product trong Database tra ve
    
})

app.get('/update',async(req,res)=>{
    let id = req.query.id;
    const client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")
    let products = await dbo.collection("TOY").findOne({_id : ObjectId(id)})
    res.render('update', {'products': products})

})

app.post('/updateProduct', async(req,res)=>{
    let id = req.body._id;
    let name = req.body.txtName
    let price =req.body.txtPrice
    let picURL = req.body.txtPicture
    let description = req.body.txtDescription
    let amount = req.body.txtAmount

    let client = await MongoClient.connect(url)
    let dbo = client.db("ATNTOY")

    console.log(id)
    await dbo.collection("TOY").updateOne({_id: ObjectId(id)}, {
        $set: {
            'name':name,
            'price': price,
            'picURL':picURL,
            'description': description,
            'amount': amount
        }
    })
    res.redirect('/viewAll')
})

app.get('/delete',async(req,res)=>{
    let id = mongo.ObjectId(req.query.id); 
    const client = await MongoClient.connect(url);
    let dbo = client.db("ATNTOY");
    // const dbo = client.dbo('ATNTOY');
    let collection = dbo.collection('TOY')
    
    let products = await collection.deleteOne({'_id' : id});
    // let products = await dbo.collection("TOY").deleteOne({'_id': id})  
    // res.render('AllProduct',{'products':products})
    res.redirect('/viewAll')
})

app.get('/create',(req,res)=>{
    res.render('NewProduct')
})

const PORT = process.env.PORT || 8000
app.listen(PORT)
console.log("Dậy Đi Ông Cháu Ơi")

