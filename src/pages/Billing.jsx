import { useEffect, useState } from "react";
import api from "../api/api";
import { getAllProducts } from "../api/productApi";
import { jsPDF } from "jspdf";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
} from "@mui/material";

export default function Billing() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.toLowerCase().includes(search.toLowerCase())
  );

  // Add product to bill
  const addToBill = (product) => {
    const exists = billItems.find(item => item.productId === product.id);

    if (exists) {
      setBillItems(billItems.map(item =>
        item.productId === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setBillItems([
        ...billItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
        },
      ]);
    }
  };

  // Change quantity
  const changeQty = (productId, qty) => {
    if (qty <= 0) return;

    setBillItems(
      billItems.map(item =>
        item.productId === productId
          ? { ...item, qty }
          : item
      )
    );
  };

  // Remove item from bill
  const removeFromBill = (productId) => {
    setBillItems(billItems.filter(item => item.productId !== productId));
  };

  // Calculate totals
  const subTotal = billItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const finalTotal = discount
    ? Math.max(0, subTotal - Number(discount))
    : subTotal;

const downloadPDF = (orderData = {}, items = []) => {
  const doc = new jsPDF();

  // -------- HEADER --------
  doc.setFontSize(16);
  doc.text("SHOP BILL", 80, 15);

  // -------- ORDER DETAILS --------
  doc.setFontSize(10);

  const dateText = orderData.billDate
    ? new Date(orderData.billDate).toLocaleString()
    : new Date().toLocaleString();

  doc.text(`Order ID   : ${orderData.orderId || "N/A"}`, 14, 30);
  doc.text(`Date       : ${dateText}`, 14, 36);
  doc.text(`Total      : INR ${orderData.totalAmount || 0}`, 14, 42);
  doc.text(`Created By : ${orderData.createdBy || "N/A"}`, 14, 48);

  // -------- TABLE HEADER (MANUAL) --------
  let y = 60;

  doc.text("S.No   Product        Qty   Price   Total", 14, y);
  y += 8;

  doc.text("--------------------------------------------------------", 14, y);
  y += 6;

  // -------- TABLE ROWS --------
  if (items.length === 0) {
    doc.text("No items available from frontend", 14, y);
  } else {
    items.forEach((i, index) => {
      const line = `${index + 1}      ${
        i.name || "Product"
      }        ${i.qty || 0}      ${i.price || 0}      ${
        (i.price || 0) * (i.qty || 0)
      }`;

      doc.text(line, 14, y);
      y += 8;
    });
  }

  // -------- FOOTER --------
  y += 6;
  doc.text("--------------------------------------------------------", 14, y);
  y += 8;
  doc.text(`Grand Total: INR ${orderData.totalAmount || 0}`, 14, y);

  // -------- SAVE FILE --------
  doc.save(`order-${orderData.orderId || "bill"}.pdf`);
};






  // Generate Bill
  const generateBill = async () => {
    if (billItems.length === 0) {
      setToast({ open: true, message: "Add at least one item", severity: "error" });
      return;
    }

    try {
      const payload = {
        items: billItems.map(i => ({
          productId: i.productId,
          qty: i.qty,
        })),
        discount: discount ? Number(discount) : 0,
      };

      const res = await api.post("/orders", payload);

      setToast({
        open: true,
        message: `Bill generated! Order #${res.data.orderId}`,
        severity: "success",
      });

      // ✅ Generate PDF after success
      downloadPDF(res.data, billItems);
      // reset bill
      setBillItems([]);
      setDiscount("");
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Billing failed",
        severity: "error",
      });
    }
    //   // ===== PDF GENERATION (separate try) =====
    // try {
    //   downloadPDF(res.data, billItems || []);
    // } catch (pdfError) {
    //   console.error("PDF failed:", pdfError);
    //   setToast({
    //     open: true,
    //     message: "Bill saved, but PDF failed to generate",
    //     severity: "warning",
    //   });
    // }

    // // Reset bill only after everything
    // setBillItems([]);
    // setDiscount("");
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" mb={2}>
        POS Billing
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* LEFT SIDE: Product Search & List */}
        <Box>
          <Paper sx={{ p: 2, height: { xs: "25vh", md: "70vh", lg: "75vh" }, overflowY: "auto" }}>
            <TextField
              fullWidth
              label="Search by name or barcode"
              value={search}
              onChange={e => setSearch(e.target.value)}
              margin="normal"
            />

            {filteredProducts.map(p => (
              <Box
                key={p.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                p={1}
                border="1px solid #ddd"
                borderRadius={1}
              >
                <Typography>
                  {p.name} — ₹ {p.price}
                </Typography>

                <Button
                  size="small"
                  variant="contained"
                  onClick={() => addToBill(p)}
                >
                  Add
                </Button>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* RIGHT SIDE: Bill Table */}
        <Box>
          <Paper sx={{ p: 2, height: "75vh" }}>
            <Typography variant="h6" mb={1}>
              Current Bill
            </Typography>

            <TableContainer sx={{ maxHeight: "45vh", overflowY: "auto" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Item</b></TableCell>
                    <TableCell><b>Price</b></TableCell>
                    <TableCell><b>Qty</b></TableCell>
                    <TableCell><b>Total</b></TableCell>
                    <TableCell><b>Action</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {billItems.map(item => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>₹ {item.price}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={item.qty}
                          onChange={e =>
                            changeQty(item.productId, Number(e.target.value))
                          }
                          sx={{ width: 70 }}
                        />
                      </TableCell>
                      <TableCell>
                        ₹ {item.price * item.qty}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeFromBill(item.productId)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Totals Section */}
            <Box mt={2}>
              <Typography>
                Subtotal: <b>₹ {subTotal}</b>
              </Typography>

              <TextField
                label="Discount"
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                margin="normal"
                fullWidth
              />

              <Typography>
                Grand Total: <b>₹ {finalTotal}</b>
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={generateBill}
              >
                Generate Bill
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

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
