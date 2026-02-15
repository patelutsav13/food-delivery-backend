// const router = require('express').Router();
// const Food = require('../models/Food');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); 
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// router.get('/', async (req, res) => {
//     try
//     {
//         const foods = await Food.find();
//         res.json(foods);
//     }
//     catch (err) 
//     {
//         res.status(500).json({ error: err.message });
//     }
// });

// router.post('/', async (req, res) => {
//   const newFood = new Food(req.body);
//   await newFood.save();
//   res.json(newFood);
// });

// router.delete('/:id', async (req, res) => {
//   await Food.findByIdAndDelete(req.params.id);
//   res.json({ msg: "Deleted" });
// });
// module.exports = router;


const router = require('express').Router();
const Food = require('../models/Food');
const multer = require('multer');
const path = require('path');

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Rename file to avoid duplicates (e.g., food-123456789.jpg)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 2. GET All Foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single food
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: 'Food not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. POST New Food (With Image Upload Middleware)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Construct the Image URL
    // If a file was uploaded, use its path. Otherwise, use a placeholder.
    let imageUrl = '';
    if (req.file) {
      // Use BASE_URL from env or default to localhost
      // Ideally, in production, BASE_URL should be set to the backend URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const newFood = new Food({
      name,
      category,
      price,
      image: imageUrl
    });

    await newFood.save();
    res.json(newFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT/UPDATE Food
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Find existing food
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ msg: 'Food not found' });

    // Update fields
    food.name = name || food.name;
    food.category = category || food.category;
    food.price = price || food.price;

    // Update image if new file was uploaded
    if (req.file) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      food.image = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await food.save();
    res.json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE Food
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
