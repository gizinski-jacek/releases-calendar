import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import Provider from './hooks/Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Games Releases Calendar',
	description: 'Games Releases Calendar',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='en'>
			<body className={`transition-all duration-300 ${inter.className}`}>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
};

export default RootLayout;
