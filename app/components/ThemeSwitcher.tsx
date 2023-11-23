'use client';

import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
	const { systemTheme, theme, setTheme } = useTheme();
	const currentTheme = theme === 'system' ? systemTheme : theme;

	return (
		<div
			className='self-center transition-all duration-300 w-12 rounded cursor-pointer m-1 border-2 border-custom-blue rounded-xl bg-gradient-to-r from-black from-50% to-white to-50%'
			onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
		>
			<div
				className={`w-3 h-3 m-[0.2rem] rounded-lg bg-custom-red transition-all duration-300
				${currentTheme === 'dark' ? '' : 'translate-x-[1.6rem]'}`}
			/>
		</div>
	);
};

export default ThemeSwitcher;
