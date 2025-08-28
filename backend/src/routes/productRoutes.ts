import { Router } from "express";

const router = Router();

// Ruta GET para listar productos (por ahora devolveremos algo fijo)
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Producto 1", price: 100 },
    { id: 2, name: "Producto 2", price: 200 }
  ]);
});

// Ruta POST para crear un producto
router.post("/", (req, res) => {
  const newProduct = req.body;
  res.status(201).json({
    message: "Producto creado con éxito",
    product: newProduct
  });
});

export default router;
