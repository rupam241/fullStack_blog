import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.history.scrollRestoration = "manual"; // Disable browser scroll restoration
        window.scrollTo(0, 0); // Scroll to top
        return () => {
            window.history.scrollRestoration = "auto"; // Restore on cleanup
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
