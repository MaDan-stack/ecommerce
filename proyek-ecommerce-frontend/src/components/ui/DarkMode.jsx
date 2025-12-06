import { useTheme } from "../../contexts/ThemeContext";
import LightButton from "../../assets/website/light-mode-button.png";
import DarkButton from "../../assets/website/dark-mode-button.png";

const DarkMode = () => {
  // 2. Ambil state dan fungsi dari context
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        aria-label="Toggle light mode"
        className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 absolute right-0 z-10 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      >
        <img src={LightButton} alt="Light mode" />
      </button>

      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300"
      >
        <img src={DarkButton} alt="Dark mode" />
      </button>
    </div>
  );
};

export default DarkMode;