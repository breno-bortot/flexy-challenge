// Wenn ist das Nunstück git und Slotermeyer? Ja! Beiherhund das Oder die Flipperwaldt gersput! palapinga

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/products')
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Product.productImageBasePath)
const fs = require('fs')
const { urlencoded } = require('express')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose Data Base...'))

app.use(express.static('./public'))
app.use(express.json())
app.use(urlencoded({ extended: false }))
//---------------Uploading Images middleware-----------------------------
// Set storage Engine 
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
})

// init upload
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


function uploadFile(req, res, next) {
    const upload = multer({
        storage: storage,
        limits: { fileSize: 5000000 },
        fileFilter: (req, file, callback) => {
            callback(null, imageMimeTypes.includes(file.mimetype))
        }
    }).single('image')

    upload(req, res, function (err) {
        if (err) {
           return res.json({ error: err.message })
        } else if (req.file === undefined) {
           return res.json({ error: 'No file Selected!' })
        }
        next()
    })
}



//---------- Endpoints ----------------

// Todos Produtos
app.get('/produtos', async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Um Produto
app.get('/produtos:id', getProduct, (req, res) => {
    res.json(req.body)
})

// Criar Produto
app.post('/produtos', uploadFile, async (req, res) => {
    const fileName = req.file !== null ? req.file.filename : null
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        imageName: fileName,
        stock: req.body.stock
    })
    try {
        const newProduct = await product.save()
        res.status(201).json({ message: `New Product ${newProduct.title} created`, newProduct })


    } catch (err) {
        if (product.imageName !== null) {
            removeImage(product.imageName)
        }

        res.status(400).json({ error: err.message })
    }
})


// Atualizar Produto
app.put('/produtos/:id', uploadFile, getProduct, async (req, res) => {
    try {
        console.log(req.body) 
        
        if (req.body.title != null) {
            console.log('entrou title')
            res.product.title = req.body.title
        }
        if (req.body.description != null) {
            console.log('entrou description')
            res.product.description = req.body.description
        }
        if (req.body.stock != null) {
            console.log('entrou stock')
            res.product.stock = req.body.stock
        }
 
        if (req.file != null && req.file != '') {
            console.log('entrou file')
            removeImage(res.product.imageName)
            res.product.imageName = req.file.filename
        }

        const updatedProduct = await res.product.save()
        res.status(200).json({ message: `Product ${updatedProduct.title} updated`, updatedProduct })


    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})
// Deletar Produto
app.delete('/produtos/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.status(200).json({ message: 'Product Deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


//-------- Middleware----------

async function getProduct(req, res, next) {
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ error: 'Cannot find product' })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
    res.product = product
    next()
}


//------------Function to remove images from File Storage
function removeImage(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}








app.listen(5000, () => console.log('Server started at Port 5000...'))
