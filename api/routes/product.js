const Product = require("../models/Product")
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken")
const router = require("express").Router()

//Create a Product.
router.post("/", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const newProduct = new Product(req.body)

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct)
    }catch(err){
        res.status(500).json(err)
    }
})

//Update
router.put("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id,
            {
                $set: req.body
            },{new: true})
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})

//delete
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted!")
    }catch(err){
        res.status(500).json(err)
    }
})

//Get Product 
router.get("/find/:id", async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err)
    }
})
//Get Product by query parameters 
router.get("/find", async (req, res) => {
    const productName = req.query.name; // Retrieve the 'name' query parameter
    try {
      const product = await Product.findOne({ name: productName }); // Search by 'name'
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" }); // Handle cases where no product is found
      }
    } catch (err) {
      res.status(500).json(err); // Handle server errors
    }
  });
  

//Get all products.
router.get("/", async(req, res)=>{
    const qNew = req.query.new
    const qCategory = req.query.category
    // console.log(qNew, qCategory)
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5) 
        }
        else if(qCategory){
            products = await Product.find({categories: {$in: [qCategory]}})
        }
        else{
            products = await Product.find()
        }
        res.status(200).json(products)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router