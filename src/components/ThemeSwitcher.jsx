// src/components/ThemeSwitcher.jsx
import { useTheme } from './ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  const getTextColor = () => {
    if (theme === 'premium') return 'text-slate-300';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getBgColor = () => {
    if (theme === 'premium') return 'bg-slate-800';
    return 'bg-slate-100 dark:bg-slate-800';
  };

  const getButtonStyles = (themeOption, isActive) => {
    if (isActive) {
      if (theme === 'premium') return 'bg-slate-700 text-white shadow-sm';
      return 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm';
    } else {
      if (theme === 'premium') return 'text-slate-300 hover:text-white';
      return 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${getTextColor()}`}></span>
      <div className={`flex ${getBgColor()} rounded-lg p-1`}>
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${getButtonStyles(themeOption, theme === themeOption.value)}`}
          >
            <span className="mr-1">{themeOption.icon}</span>
            {themeOption.name}
          </button>
        ))}
      </div>
    </div>
  );
}