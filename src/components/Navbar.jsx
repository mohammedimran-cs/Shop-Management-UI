import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Avatar, Menu, MenuItem} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { NavLink } from "react-router-dom";



export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const aOpen = Boolean(anchorEl);


  const toggleDrawer = (state) => {
    setOpen(state);
  };

  const handleLogout = () => {
    logout();
  };

  const drawerLinks = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <List>
      <ListItem
        button
        component={NavLink}
        to="/"
        sx={{
          "&.active": {
            backgroundColor: "#e3f2fd",
          },
          "&.active .MuiListItemText-primary": {
            color: "#1976d2",      // ✅ BLUE WHEN SELECTED
            fontWeight: "bold",
          },
          "&:hover": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <ListItemText primary="Products" />
      </ListItem>

      <ListItem
        button
        component={NavLink}
        to="/billing"
        sx={{
          "&.active": {
            backgroundColor: "#e3f2fd",
          },
          "&.active .MuiListItemText-primary": {
            color: "#1976d2",
            fontWeight: "bold",
          },
          "&:hover": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <ListItemText primary="Billing" />
      </ListItem>

      <ListItem
        button
        component={NavLink}
        to="/setting"
        sx={{
          "&.active": {
            backgroundColor: "#e3f2fd",
          },
          "&.active .MuiListItemText-primary": {
            color: "#1976d2",
            fontWeight: "bold",
          },
          "&:hover": {
            backgroundColor: "#f1f1f1",
          },
        }}
      >
        <ListItemText primary="Setting" />
      </ListItem>

      </List>
      <Divider />

      <List>
        {user && (
          <>
            <ListItem>
              <ListItemText primary={user.email}
                sx={{ 
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: 1.3
                }}
              />
            </ListItem>

            <Box sx={{ px: 2, mt: 1 }}>
              <Button 
                variant="contained"
                color="primary"
                
                onClick={handleLogout}
              >
              <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </Button>
            </Box>

          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, marginBottom: { xs: 0.5, sm: 0.5 } }}>
            Shop Management
          </Typography>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
        <Button
            color="inherit"
            component={NavLink}
            to="/"
            sx={{
              "&.active": {
                color: "#ffffff",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2", // nice underline effect
              },
            }}
          >
            Products
          </Button>

          <Button
            color="inherit"
            component={NavLink}
            to="/billing"
            sx={{
              "&.active": {
                color: "#ffffff",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2",
              },
            }}
          >
            Billing
          </Button>

          <Button
            color="inherit"
            component={NavLink}
            to="/setting"
            sx={{
              "&.active": {
                color: "#ffffff",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2",
              },
            }}
          >
            Setting
          </Button>

          {user && (
            <>
              <Avatar
                onClick={handleOpen}
                sx={{
                  bgcolor: "#ffffff",
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                }}
              >
                <Typography variant="h6" fontWeight={"bold"}  color="#1976d2">
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Typography>
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={aOpen}
                onClose={handleClose}
                PaperProps={{
                  sx: { mt: 1, width: 220, p: 1 },
                }}
              >
              <Box sx={{ p: 1, maxWidth: 220 }}>
                <Typography 
                  variant="body2" 
                  // fontWeight="bold"
                  sx={{ 
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: 1.3
                  }}
                >
                  {user.email || "User"}
                </Typography>
              </Box>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ mt: 1 }}>
                  <Logout fontSize="small" sx={{ mr: 1 }} />
                  Logout 
                </MenuItem>
              </Menu>
            </>
          )}

          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={open} onClose={() => toggleDrawer(false)}>
        {drawerLinks}
      </Drawer>
    </>
  );
}
