import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './products.controller';

const router = Router();

router.get('/', getProducts);        // Listar productos
router.get('/:id', getProductById);  // Obtener producto por id
router.post('/', createProduct);     // Crear producto
router.put('/:id', updateProduct);   // Actualizar producto
router.delete('/:id', deleteProduct); // Eliminar producto

export default router;
