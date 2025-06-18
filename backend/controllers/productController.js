
const Product = require('../models/Product');

//Crear producto(solo para admin)
const createProduct = async (req, res) => {
  try {
    //const { name, description, price, stock, image, category } = (req.body);

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
  } catch (error) {
    console.error('Error al crear producto', error);
    res.status(500).json({ message: 'Error al crear producto'});
  }
};

//Obtener todos los productos 
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};


//Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar producto' })
  }
};

//Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto' })
  }
};

//Obtener producto por id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
};


export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct};