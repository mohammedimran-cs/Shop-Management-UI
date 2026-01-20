import { useEffect, useState } from "react";
import { getAllCategories, addCategory } from "../api/categoryApi";
import { getAllProducts } from "../api/productApi";
import api from "../api/api";

import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  CircularProgress
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading,setLoading] = useState(true);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load categories + products (needed to block delete)
  useEffect(() => {
    const load = async () => {
      const cats = await getAllCategories();
      const prods = await getAllProducts();
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    };

    load();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const cats = await getAllCategories();
    const prods = await getAllProducts();
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  const hasProducts = (categoryId) => {
    return products.some((p) => p.categoryId === categoryId);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
        setToast({
        open: true,
        message: "Category name required",
        severity: "error",
        });
        return;
    }
    try {
      await addCategory({ name: newCategory });
      await refreshData();
      setNewCategory("");
      setToast({
        open: true,
        message: "Category added",
        severity: "success",
      });
    } catch(err) {
        setToast({
            open: true,
            message: err.response?.data?.message || "Failed to add category",
            severity: "error",
        });
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingName.trim()) {
      setToast({
        open: true,
        message: "Category name required",
        severity: "error",
      });
      return;
    }

    try {
      await api.put(`/categories/${editingId}`, { name: editingName });
      await refreshData();
      setEditingId(null);
      setEditingName("");
      setToast({
        open: true,
        message: "Category updated",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Update failed",
        severity: "error",
      });
    }
  };

  const openDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await api.delete(`/categories/${deleteId}`);
      await refreshData();
      setToast({
        open: true,
        message: "Category deleted",
        severity: "success",
      });
    } catch {
      setToast({
        open: true,
        message: "Cannot delete category",
        severity: "error",
      });
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  if(loading){
      return (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
          </Box>
      )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Settings
      </Typography>

      {/* <Paper sx={{ p: 2 }}> */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Category
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {/* ADD CATEGORY */}
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="New Category"
                value={newCategory}
                onChange={(e) => {
                        setNewCategory(e.target.value)
                    }
                }
                fullWidth
              />
              <Button variant="contained" onClick={handleAddCategory}>
                Add
              </Button>
            </Box>

            {/* EDIT CATEGORY */}
            {editingId && (
              <Box display="flex-column">
                <TextField
                  label="Edit Category"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  fullWidth
                />
                <Box mt={2} display="flex" gap={2}>
                    <Button
                    variant="contained"
                    color="success"
                    onClick={handleUpdateCategory}
                    >
                    Update
                    </Button>
                    <Button
                    variant="outlined"
                    onClick={() => setEditingId(null)}
                    >
                    Cancel
                    </Button>
                </Box>
              </Box>
            )}

            {/* CATEGORY LIST */}
            <List>
              {categories.map((c) => (
                <ListItem key={c.id} divider>
                  <ListItemText primary={c.name} />

                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={() => startEdit(c)}
                    >
                      <EditIcon />
                    </IconButton>

                    <Tooltip
                      title={
                        hasProducts(c.id)
                          ? "Cannot delete — products exist in this category"
                          : "Delete category"
                      }
                    >
                      <span>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteConfirm(c.id)}
                          disabled={hasProducts(c.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Future section example */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tax Settings (Coming Soon)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              Configure GST, service tax, etc. here in future.
            </Typography>
          </AccordionDetails>
        </Accordion>
      {/* </Paper> */}

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
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

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </Container>
  );
}
