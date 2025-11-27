'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>The current theme is: {theme}</p>
      <Button className="mr-2" onClick={() => setTheme('light')}>Light Mode</Button>
      <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
    </div>
  );
};
export default ThemeChanger;
