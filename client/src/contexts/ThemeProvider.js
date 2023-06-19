import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ThemeContext = React.createContext()

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
    const [isLightTheme, setTheme] = useLocalStorage('theme',true)

    function toggleTheme() {
        setTheme(!isLightTheme);
        if (!isLightTheme === false) document.body.style.backgroundColor = "#161616"
        else document.body.style.backgroundColor = "#FFFFFF"
    }

    
    return (
        <ThemeContext.Provider value={{ isLightTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
