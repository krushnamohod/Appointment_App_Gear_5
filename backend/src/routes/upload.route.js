import express from 'express';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/single', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
        message: 'File uploaded successfully',
        url: fileUrl
    });
});

export default router;
