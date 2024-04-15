const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    nombre:{
        type:String
    },
    imagen:{
        type:String
    },
    categoria:{
        type:String
    },
    cantidad:{
        type: Number
    },
    precio:{
        type: Number
    },
    unidad:{
        type:String
    }

}, { timestamps: true });

const Product = model("Product", productSchema);
module.exports = Product;
