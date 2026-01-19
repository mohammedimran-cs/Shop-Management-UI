import { useEffect, useState } from "react";
import { getAllCategories } from "../api/categoryApi";
import { addProduct,updateProduct, deleteProduct,getAllProducts } from "../api/productApi";


import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success", time: 3000 });
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    wholeSalePrice: "",
    price: "",
    stock: "",
    barcode: "",
    categoryId: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      wholeSalePrice: "",
      price: "",
      stock: "",
      barcode: "",
      categoryId: "",
    });
    setEditingProduct(null);
  };


  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 },
    borderRadius: 2,
    width: {
      xs: "80%",   // mobile
      sm: "60%",   // small tablets
      md: 500,     // desktop
    },
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      wholeSalePrice: product.wholeSalePrice,
      price: product.price,
      stock: product.stock,
      barcode: product.barcode,
      categoryId: product.categoryId,
    });
    setOpen(true);
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteProduct(deleteId);
      const prod = await getAllProducts();
      setProducts(prod);

      setToast({ open: true, message: "Product deleted", severity: "success", time: 3000 });
    } catch {
      setToast({ open: true, message: "Delete failed", severity: "error", time: 3000 });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
};

  const handleChange = (e) => {
    setErrors({...errors, [e.target.name]: ""});
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form);
        setToast({ open: true, message: "Product updated", severity: "success", time: 3000 });
      } else {
        await addProduct(form);
        setToast({ open: true, message: "Product added", severity: "success", time: 3000 });
      }

      // Refresh products list
      const prod = await getAllProducts();
      setProducts(prod);
      resetForm();
      setOpen(false);
    } catch (err) {
      if(err.response?.data?.status === 'input error'){
        setErrors(err.response.data.message);
        return;
      }
      const message =
        err.response?.data?.message || "Failed to add product";

      setToast({
        open: true,
        message,
        severity: "error",
        time: 3000,
      });
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getAllProducts();
        const cats = await getAllCategories();

        setProducts(prod);
        setCategories(cats);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to load data. Please try again.";

        setToast({ open: true, message, severity: "error", time: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if(loading){
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress size={30} sx={{ color: "blue"}} />
        </Box>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        mb={2}
      >
        {/* <Typography variant="h5">Products</Typography> */}
          <Button variant="contained" 
              onClick={() => {
                  resetForm();
                  setOpen(true)
              }}
          >
            Add Product
          </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowY: "auto", marginTop: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><b>S.No</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Whole Sale Price</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Stock</b></TableCell>
              <TableCell><b>Barcode</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>₹ {p.wholeSalePrice}</TableCell>
                <TableCell>₹ {p.price}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>{p.barcode}</TableCell>
                <TableCell>{p.categoryName}</TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button size="small" variant="contained" onClick={() => handleEditClick(p)}>
                      Edit
                    </Button>
                    <Button size="small" variant="contained" color="error" onClick={() => openDeleteConfirm(p.id)}>
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={open} onClose={() => {
        setErrors({});
        setOpen(false)
      }}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Add New Product
          </Typography>

          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Wholesale Price"
            name="wholeSalePrice"
            value={form.wholeSalePrice}
            onChange={handleChange}
            margin="normal"
            type="number"
            error={!!errors.wholeSalePrice}
            helperText={errors.wholeSalePrice}
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            margin="normal"
            type="number"
            error={!!errors.price}
            helperText={errors.price}
          />

          <TextField
            fullWidth
            label="Stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            margin="normal"
            type="number"
            error={!!errors.stock}
            helperText={errors.stock}
          />

          <TextField
            fullWidth
            label="Barcode"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
            margin="normal"
            error={!!errors.barcode}
            helperText={errors.barcode}
          />

          <TextField
            select
            fullWidth
            label="Category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            margin="normal"
            error={!!errors.categoryId}
            helperText={errors.categoryId}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => {
                setErrors({});
                setOpen(false)
            }}>
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirmed}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={toast.time}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
