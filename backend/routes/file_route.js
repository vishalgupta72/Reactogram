const express = require("express");
const router = express.Router();

// router.post("/uploadFile", function(req, res){
//     console.log(req.body)
//     res.json({"fileName": "req.file.fieldname"});
// })

const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const upload = multer({
  //   storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return resizeBy
        .status(400)
        .json({ error: "file types allowed are .jpeg, .jpg, .png" });
    }
  },
});

router.post("/uploadFile", upload.single("file"), async function (req, res) {
  // console.log(req.files?.[0].filename);
  // console.log(req.file);

  const fileResponse = await uploadToGoFile(
    req.file,
    "8b09e407-611b-49b6-b465-6314a1014d89"
  );
  // console.log(fileResponse);

  if (fileResponse instanceof Error) {
    // send unsuccessfull response
    return res
      .status(204)
      .json({ message: "Something went wrong while uploading the file!" });
  } else {
    // save the json data in database
    return res.status(201).json({
      url: fileResponse.data.url,
      filename: fileResponse.data.image.filename,
      delete_url: fileResponse.data.delete_url,
      thumb_url: fileResponse.data.thumb.url,
    });
  }
});

/**
 * @throws {Error}
 * @param {File} file
 * @returns {Promise<{ "data": { url: string, delete_url: string, image: {filename: string, url: string }, thumb: { url: string } } }>}
 */
async function uploadToGoFile(file) {
  try {
    const formData = new FormData();
    formData.append("image", new Blob([file.buffer]), file.originalname);

    const res = await fetch(
      "https://api.imgbb.com/1/upload?key=" + process.env.IMGBB_KEY,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);

    return error;
  }
}

// async function getBase64(file) {
//     return new Promise(res => {
//         var reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = function () {
//             console.log(reader.result);
//             return res(reader.result);
//         };
//         reader.onerror = function (error) {
//             console.log("Error: ", error);
//             return res(null)
//         };
//     })
// }

// const downloadFile = (req, res)=>{
//     const fileName = req.params.filename;
//     const path = __basedir + "/uploads/";

//     res.download(path+fileName, (error)=>{
//         if(error){
//             res.status(500).send({message: "File cannot be download "+error})
//         }
//     })
// }
// router.get("/files/:filename", downloadFile);

module.exports = router;
