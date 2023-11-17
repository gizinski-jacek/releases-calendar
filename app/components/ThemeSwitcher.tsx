'use client';

import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === 'system' ? systemTheme : theme;

	return (
		<div
			className='self-center transition-all rounded cursor-pointer m-1 border-2 border-secondary rounded-xl bg-blue transition-all w-12'
			onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
		>
			<div
				className={`w-3 h-3 m-[0.2rem] rounded-lg bg-gold transition-all
				${theme === 'dark' ? '' : 'translate-x-6'}`}
			/>
		</div>
	);
};

export default ThemeSwitcher;
