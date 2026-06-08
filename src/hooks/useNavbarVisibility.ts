import { useEffect, useRef, useState } from "react";

export function useNavbarVisibility() {
  const [navbarVisible, setNavbarVisible] = useState(true);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setNavbarVisible(true);
      } else if (currentScrollY > prevScrollY.current) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return navbarVisible;
}