import axios from 'axios';
import querystring from 'querystring';

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
		let results = [] as any;
		let nextPage: string | null = `${process.env.API_URI}?${query}`;
		while (nextPage) {
			const res: any = await axios.get(nextPage);
			results = [...results, ...res.data.results];
			nextPage = res.data.next;
		}
		return new Response(JSON.stringify(results), { status: 200 });
	} catch (error: any) {
		console.log(error);
		return new Response('API Error', { status: 500 });
	}
}
