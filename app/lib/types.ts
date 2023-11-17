export interface GameData {
	added: number;
	added_by_status: null;
	background_image: string | null;
	clip: null;
	community_rating: number;
	dominant_color: string;
	esrb_rating: { id: number; slug: string; name: string } | null;
	genres: { id: number; name: string; slug: string }[] | null;
	id: number;
	metacritic: number | null;
	name: string;
	parent_platforms:
		| { platform: { id: number; name: string; slug: string } }[]
		| null;
	platforms: { platform: { id: number; name: string; slug: string } }[] | null;
	playtime: number;
	rating: number;
	rating_top: number;
	ratings: [];
	ratings_count: number;
	released: string;
	reviews_count: number;
	reviews_text_count: number;
	saturated_color: string;
	score: number | null;
	short_screenshots: { id: number; image: string }[] | null;
	slug: string;
	stores: { store: { id: number; name: string; slug: string } }[] | null;
	suggestions_count: number;
	tags:
		| {
				id: number;
				name: string;
				slug: string;
				games_count: number;
				language: string;
		  }[]
		| null;
	tba: boolean;
	updated: string;
	user_game: null;
}

export interface DayData {
	date: string;
	dayOfMonth: number;
	isCurrentMonth: boolean;
	game_releases: GameData[];
}

export type GroupedByDay = DayData[];
