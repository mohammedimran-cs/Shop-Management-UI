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

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (state) => {
    setOpen(state);
  };

  const handleLogout = () => {
    logout();
  };

  const drawerLinks = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
      <List>
        {/* <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem> */}

        <ListItem button component={Link} to="/">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/billing">
          <ListItemText primary="Billing" />
        </ListItem>
      </List>

      <Divider />

      <List>
        {user && (
          <>
            {/* <ListItem>
              <ListItemText primary={user.email} />
            </ListItem> */}

            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
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
            <Button color="inherit" component={Link} to="/">
              products
            </Button>

            {/* <Button color="inherit" component={Link} to="/products">
              Products
            </Button> */}

            <Button color="inherit" component={Link} to="/Billing">
              Billing
            </Button>

            {user && (
              <>
                {/* <Typography sx={{ display: "flex", alignItems: "center" }}>
                  {user.email}
                </Typography> */}

                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
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
