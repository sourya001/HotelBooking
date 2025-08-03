import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({}),
});

export default upload;
// This middleware uses multer to handle file uploads. It can be configured further to specify storage options, file size limits, and file type restrictions.
