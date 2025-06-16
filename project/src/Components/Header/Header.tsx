import {
    Avatar,
    Dropdown,
    DropdownDivider,
    DropdownItem,
    Navbar,
    NavbarBrand,
    NavbarCollapse,
    NavbarLink,
    NavbarToggle,
} from "flowbite-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const dark = localStorage.getItem("darkMode") === "true";
        setDarkMode(dark);
        document.documentElement.classList.toggle("dark", dark);

        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setIsAdmin(payload.isAdmin === true || payload.role === "admin");
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }

        const searchParams = new URLSearchParams(location.search);
        const q = searchParams.get("q") || "";
        setSearchTerm(q);
    }, [location]);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
        document.documentElement.classList.toggle("dark", newMode);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/");
    };


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    };

    return (
        <Navbar fluid rounded className="bg-gray-100 dark:bg-gray-900">
            <NavbarBrand>
                <Link to="/" className="flex items-center">
                    <img
                        src="/img/bc-card-svgrepo-com.svg"
                        className="mr-3 h-6 sm:h-9"
                        alt="Adi Logo"
                    />
                    <span className="self-center text-xl font-semibold text-gray-900 dark:text-white">
                        Adi Card Site
                    </span>
                </Link>
            </NavbarBrand>

            <form onSubmit={handleSearchSubmit} className="flex items-center ml-4">
                <input
                    type="text"
                    placeholder="חפש כרטיסים..."
                    className="rounded-l px-3 py-1 border border-gray-300 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="חיפוש כרטיסים"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-r"
                >
                    חפש
                </button>
            </form>

            <div className="flex items-center gap-4 md:order-2">
                <button
                    onClick={toggleDarkMode}
                    className="text-xl"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        <FaSun className="text-yellow-300" />
                    ) : (
                        <FaMoon className="text-gray-800" />
                    )}
                </button>

                <Dropdown
                    arrowIcon={false}
                    inline
                    label={<Avatar alt="User" img="/img/man.svg" rounded />}
                >
                    <DropdownDivider />
                    {!isLoggedIn ? (
                        <>
                            <DropdownItem>
                                <Link to="/signin" className="block w-full">
                                    התחברות
                                </Link>
                            </DropdownItem>
                            <DropdownItem>
                                <Link to="/register" className="block w-full">
                                    הרשמה
                                </Link>
                            </DropdownItem>
                        </>
                    ) : (
                        <DropdownItem onClick={logout}>התנתקות</DropdownItem>
                    )}
                </Dropdown>

                <NavbarToggle />
            </div>

            <NavbarCollapse>
                <NavbarLink href="/">
                    <span className="text-gray-900 dark:text-white">בית</span>
                </NavbarLink>
                <NavbarLink href="/about">
                    <span className="text-gray-900 dark:text-white">עלינו</span>
                </NavbarLink>
                {isLoggedIn && (
                    <NavbarLink href="/favorites">
                        <span className="text-gray-900 dark:text-white">אהובים</span>
                    </NavbarLink>
                )}
                {isAdmin && (
                    <NavbarLink href="/CreateCard">
                        <span className="text-gray-900 dark:text-white">צור כרטיס</span>
                    </NavbarLink>
                )}
            </NavbarCollapse>
        </Navbar>
    );
};

export default Header;
