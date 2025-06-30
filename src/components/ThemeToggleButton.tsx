import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icons } from './icons';
import Button from './ui/Button';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? (
        <Icons.Moon className="h-5 w-5" />
      ) : (
        <Icons.Sun className="h-5 w-5 text-orange-400" />
      )}
    </Button>
  );
};

export default ThemeToggleButton;