const express=require('express')
const mongoose=require('mongoose')
const router=express.Router()
const Book=require('./Models/bookModel')
router.get('/',async (req,res)=>{
    const page=parseInt(req.query.page,10)||1
    const limit=parseInt(req.query.limit,10)||10
    const currentPage=page>0?page:1
    const pageLimit=limit>0?limit:10
    const skip=(currentPage-1)*pageLimit

    try {
        const books=await Book.find().skip(skip).limit(pageLimit)
        res.json({
            books,
            currentPage
        })
    } catch (err) {
        res.status(500).json({
            message:"Unable to retrieve books"
        })
    }
})
router.post('/',async (req,res)=>{
    const{title,author,category}=req.body
    if(!title || !author){
        return res.status(400).json({
            message:"Title and author are required"
        })
    }

    try {
        const newBook=await Book.create({title,author,category})
        return res.status(201).json(newBook)
    } catch (err) {
            return res.status(500).json({
            message:"Unable to create book"
        })
}
        res.status(201).json(newBook)

})
router.patch('/:id',async (req,res)=>{
    const {status}=req.body

    if(!['Available','Unavailable'].includes(status)){
        return res.status(400).json({
            message:"Status must be Available or Unavailable"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            message:"Invalid book ID"
        })
    }

    try {
        const updatedBook=await Book.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true,runValidators:true}
        )

        if(!updatedBook){
            return res.status(404).json({
                message:"Book not found"
            })
        }

        return res.json(updatedBook)
    } catch (err) {
        return res.status(500).json({
            message:"Unable to update book"
        })
    }
})
module.exports=router