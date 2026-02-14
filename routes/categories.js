// // const router = require('express').Router();
// // const Category = require('../models/Category');

// // router.get('/', async (req, res) => {
// //   const cats = await Category.find();
// //   res.json(cats);
// // });

// // router.post('/', async (req, res) => {
// //   const newCat = new Category(req.body);
// //   await newCat.save();
// //   res.json(newCat);
// // });

// // router.delete('/:id', async (req, res) => {
// //   await Category.findByIdAndDelete(req.params.id);
// //   res.json({ msg: "Deleted" });
// // });
// // module.exports = router;

// const router = require('express').Router();
// const Category = require('../models/Category');

// // GET All Categories
// router.get('/', async (req, res) => {
//   try {
//     const cats = await Category.find();
//     res.json(cats);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST New Category (Now saves sales number)
// router.post('/', async (req, res) => {
//   try {
//     const { name, sales } = req.body;
//     const newCat = new Category({ 
//       name, 
//       sales: sales || 0 // Default to 0 if user doesn't enter anything
//     });
//     await newCat.save();
//     res.json(newCat);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE Category
// router.delete('/:id', async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ msg: "Deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const router = require('express').Router();
const Category = require('../models/Category');
const Food = require('../models/Food'); // Import Food model to delete related items

// GET All Categories
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST New Category (With Duplicate Check)
router.post('/', async (req, res) => {
  try {
    const { name, sales } = req.body;

    // 1. Check if category already exists (Case Insensitive)
    // This regex matches exact name ignoring case (e.g. "Burger" == "burger")
    const existingCat = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCat) {
      return res.status(400).json({ msg: "Category already exists!" });
    }

    // 2. Save new category
    const newCat = new Category({ 
      name, 
      sales: sales || 0 
    });
    await newCat.save();
    res.json(newCat);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Category (And related Foods)
router.delete('/:id', async (req, res) => {
  try {
    // 1. Find the category first to get its name
    const categoryToDelete = await Category.findById(req.params.id);

    if (!categoryToDelete) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const categoryName = categoryToDelete.name;

    // 2. Delete the category
    await Category.findByIdAndDelete(req.params.id);

    // 3. Delete all foods associated with this category
    await Food.deleteMany({ category: categoryName });

    res.json({ msg: "Category and related foods deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;