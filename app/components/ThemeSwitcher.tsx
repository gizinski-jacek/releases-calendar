'use client';

import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
	const { systemTheme, theme, setTheme } = useTheme();

	return (
		<button
			onClick={() =>
				(theme === 'system' ? systemTheme : theme) == 'dark'
					? setTheme('light')
					: setTheme('dark')
			}
		>
			{(theme === 'system' ? systemTheme : theme) == 'dark' ? 'Light' : 'Dark'}
		</button>
	);
};

export default ThemeSwitcher;
