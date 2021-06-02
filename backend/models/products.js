const mongoose = require('mongoose')
const path = require('path')
const productImageBasePath ='uploads/images'

let projectSchemaOptions = {
    toJSON: {
        virtuals: true
    }
}
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 6
    },
    description: {
        type: String,
        maxLength: 4000
       
    },
    imageName: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, projectSchemaOptions)

productSchema.virtual('imagePath').get(function() {
    if(this.imageName !== null) {
        return path.join('/', productImageBasePath, this.imageName)
    }
})




module.exports = mongoose.model('Product', productSchema)
module.exports.productImageBasePath = productImageBasePath