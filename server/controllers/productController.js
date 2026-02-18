import {Product} from '../models/Product.js'

export const addProduct = async (req,res) =>{
    try{
        const {name,description,price,category,imageUrl, whStock} = req.body
        let product = await Product.findOne({name})
        if(product){
            Product.whStock += Number(whStock)
            await Product.save()
            return res.status(200).json({msg:'Stock Updated',product})
        }
        product= new Product({
            name,
            description,
            price,
            category,
            whStock:whStock,
            imageUrl,
        })

        await product.save()
        res.status(201).json({msg:'Product added to warehouse',product})

    }catch(err){
        console.error(err)
        res.status(500).json({msg:'error while adding product'})
    }
}

export const getAllProducts = async (req,res)=>{
    try{
        const product = await Product.find()
        res.status(200).json(product)
        return product.data

    }catch(err){
        console.error(err)
        res.status(500).json({msg:'error while fetching all the products'})
    }
}