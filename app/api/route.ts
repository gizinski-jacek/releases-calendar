import axios, { AxiosResponse } from 'axios';
import querystring from 'querystring';
import { GameData } from '../lib/types';

export async function POST(request: Request) {
	try {
		if (!process.env.RAWG_IO_API_KEY) {
			console.error('Provide API key');
			return;
		}
		const { startDate, endDate } = await request.json();
		if (!startDate || !endDate) {
			return new Response('Provide date', { status: 500 });
		}
		const query = querystring.stringify({
			key: process.env.RAWG_IO_API_KEY,
			page_size: '40',
			dates: `${startDate},${endDate}`,
		});
		let results = [] as GameData[];
		let nextPage: string | null = `https://api.rawg.io/api/games?${query}`;
		while (nextPage && results.length < 120) {
			const res: AxiosResponse<{
				count: number;
				results: GameData[];
				previous: string | null;
				next: string | null;
			}> = await axios.get(nextPage);
			results = [...results, ...res.data.results];
			nextPage = res.data.next;
		}
		return new Response(JSON.stringify(results), { status: 200 });
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			console.log('RAWG API Error: ', error.message);
			return new Response(error.message, { status: error.status || 500 });
		} else {
			console.log('An unexpected RAWG API Error occurred: ', error);
			return new Response('An unexpected RAWG API Error occurred', {
				status: 500,
			});
		}
	}
}
