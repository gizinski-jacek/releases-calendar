import axios, { AxiosResponse } from 'axios';
import querystring from 'querystring';
import { GameData } from '../lib/types';

export async function POST(request: Request) {
	try {
		if (!process.env.API_URI) {
			console.error('Provide API URI');
			return;
		}
		if (!process.env.API_key) {
			console.error('Provide API key');
			return;
		}
		const { date } = await request.json();
		if (!date) {
			return new Response('Provide date', { status: 500 });
		}

		const query = querystring.stringify({
			key: process.env.API_key,
			page_size: '40',
			ordering: 'metacritic',
			dates: date,
		});
		let results = [] as GameData[];
		let nextPage: string | null = `${process.env.API_URI}?${query}`;
		while (nextPage) {
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
