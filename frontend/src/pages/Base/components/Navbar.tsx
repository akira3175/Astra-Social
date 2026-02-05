import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    SearchIcon,
    ChatIcon,
    PersonIcon,
    SettingsIcon,
    LogoutIcon,
    MenuIcon,
    HomeIcon,
    GroupIcon,
    BookmarkIcon
} from "../../../components/ui";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { logout } from "../../../services/authService";
import { useCurrentUser } from "../../../context/currentUserContext";
import NotificationDropdown from "../../../components/Notifications/NotificationDropdown";

interface NavbarProps {
    onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
    const isMobile = useMediaQuery("(max-width: 900px)"); // Equivalent to theme.breakpoints.down("md")
    const { currentUser } = useCurrentUser() ?? {};
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const [showMobileSearch, setShowMobileSearch] = useState(false);
    // const [isChatOpen, setIsChatOpen] = useState(false); // Unused in provided code logic except toggle
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            if (isMobile) {
                setShowMobileSearch(false);
            }
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleChat = () => {
        // setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            <Box
                component="header"
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#ffffff",
                    borderBottom: "1px solid #e0e0e0",
                    zIndex: 1100,
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    boxSizing: "border-box",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "1536px", // max-width xl
                        margin: "0 auto",
                        padding: isMobile ? "0 8px" : "0 16px",
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    {isMobile && (
                        <IconButton
                            aria-label="menu"
                            onClick={toggleMobileMenu}
                            sx={{ marginRight: "8px", outline: "none" }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Logo */}
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        component={Link}
                        // @ts-ignore
                        to="/"
                        sx={{
                            color: "#4f46e5 !important",
                            fontWeight: "bold",
                            textDecoration: "none",
                            flexGrow: isMobile ? 1 : 0,
                            marginRight: isMobile ? 0 : "24px",
                            textAlign: "left",
                            cursor: "pointer",
                        }}
                    >
                        AstraSocial
                    </Typography>

                    {/* Search bar - Desktop */}
                    {!isMobile && (
                        <Box component="form" onSubmit={handleSearch} sx={{ flexGrow: 1, maxWidth: "500px" }}>
                            <TextField
                                placeholder="Tìm kiếm..."
                                size="small"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                startAdornment={<SearchIcon />}
                                className="navbar-search"
                                sx={{
                                    borderRadius: "20px",
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }}
                            />
                        </Box>
                    )}

                    {/* User menu */}
                    <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                        {isMobile && (
                            <IconButton
                                onClick={toggleMobileSearch}
                                sx={{ outline: "none" }}
                            >
                                <SearchIcon />
                            </IconButton>
                        )}

                        {/* Notification Dropdown */}
                        <NotificationDropdown />

                        {/* Chat Icon */}
                        <Link to="/messages">
                            <IconButton
                                onClick={toggleChat}
                                sx={{ outline: "none", color: "inherit" }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Link>

                        <IconButton
                            onClick={handleProfileClick}
                            aria-controls={open ? "profile-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            sx={{ outline: "none", padding: "4px" }}
                        >
                            <Avatar
                                src={currentUser?.avatar}
                                alt={currentUser?.username || "User"}
                                width={36}
                                height={36}
                                style={{
                                    marginLeft: 8,
                                    cursor: "pointer",
                                    border: "2px solid #e2e8f0",
                                    borderRadius: "50%",
                                }}
                            >
                                {!currentUser?.avatar && (currentUser?.firstName?.[0] || currentUser?.username?.[0] || "U")}
                            </Avatar>
                        </IconButton>

                        <Menu
                            id="profile-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem
                                onClick={handleClose}
                                component={Link}
                                to={currentUser ? `/profile/${currentUser.id}` : "/profile"}
                            >
                                <PersonIcon size={20} style={{ marginRight: 8 }} />
                                Trang cá nhân
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/settings">
                                <SettingsIcon size={20} style={{ marginRight: 8 }} />
                                Cài đặt
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon size={20} style={{ marginRight: 8 }} />
                                Đăng xuất
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                {/* Mobile Search Bar overlay or inline */}
                {isMobile && showMobileSearch && (
                    <Box
                        component="form"
                        onSubmit={handleSearch}
                        sx={{
                            position: "absolute",
                            top: "64px",
                            left: 0,
                            right: 0,
                            padding: "8px 16px",
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #e0e0e0",
                            zIndex: 1099,
                        }}
                    >
                        <TextField
                            placeholder="Tìm kiếm..."
                            size="small"
                            fullWidth
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startAdornment={<SearchIcon />}
                            sx={{
                                borderRadius: "20px",
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                            }}
                        />
                    </Box>
                )}
            </Box>

            {/* Mobile Menu Drawer */}
            <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={toggleMobileMenu}
            >
                <Box sx={{ padding: "16px", width: "100%", maxWidth: "300px", boxSizing: "border-box" }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        // @ts-ignore
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        sx={{
                            color: "#4f46e5",
                            fontWeight: "bold",
                            textDecoration: "none",
                            display: "block",
                            marginBottom: "16px",
                        }}
                    >
                        AstraSocial
                    </Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem component={Link} to="/" onClick={() => setMobileMenuOpen(false)}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Trang chủ" />
                    </ListItem>
                    <ListItem
                        component={Link}
                        to={currentUser ? `/profile/${currentUser.email}` : "/profile"}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Trang cá nhân" />
                    </ListItem>
                    <ListItem component={Link} to="/friends" onClick={() => setMobileMenuOpen(false)}>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText primary="Bạn bè" />
                    </ListItem>
                    <ListItem component={Link} to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Thông báo" />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem component={Link} to="/settings" onClick={() => setMobileMenuOpen(false)}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cài đặt" />
                    </ListItem>
                    <ListItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Đăng xuất" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default Navbar;
