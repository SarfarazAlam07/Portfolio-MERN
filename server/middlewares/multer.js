const multer = require("multer");

const storage = multer.memoryStorage();

const singleUpload = multer({ 
    storage 
}).single("file"); // Frontend se jo field aayega uska naam "file" hona chahiye

module.exports = singleUpload;