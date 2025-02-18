import { createContext, useState, useEffect, useContext } from "react";

// Create Context
const FontSizeContext = createContext();

// Provider Component
export const FontSizeProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "medium");

    useEffect(() => {
        document.documentElement.style.fontSize = getFontSizeValue(fontSize);
        localStorage.setItem("fontSize", fontSize);
    }, [fontSize]);

    const getFontSizeValue = (size) => {
        switch (size) {
            case "small": return "12px";
            case "medium": return "16px";
            case "large": return "20px";
            case "huge": return "24px";
            default: return "16px";
        }
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

// Hook to use context
export const useFontSize = () => useContext(FontSizeContext);
