const express = require('express');
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/')
    }, 
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }

})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: (req, file, cb)=>{
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg"){
            cb(null, true);
        }
        else{
            cb(null, false);
            return resizeBy.status(400).json({error: "file types allowed are .jpeg, .jpg, .png"})
        }
    }
})

router.post("/uploadFile", upload.single('file'), function(req, res){
    res.json({"fileName": req.file.fieldname});
})


const downloadFile = (req, res)=>{
    const fileName = req.params.filename;
    const path = __basedir + "/uploads/";

    res.download(path+fileName, (error)=>{
        if(error){
            res.status(500).send({message: "File cannot be download "+error})
        }
    })
}
router.get("/files/:filename", downloadFile);

module.exports = router;