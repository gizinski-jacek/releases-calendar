import moment from 'moment';
import { GameData, GroupedByDay } from './types';

export const filterMature = (data: GameData[]): GameData[] => {
	const filterTags = ['sexual-content', 'nsfw'];
	const filtered = data.filter((item) => {
		if (!item.tags) return false;
		if (item.tags.find((tag) => filterTags.includes(tag.slug))) return false;
		return true;
	});
	return filtered;
};

export const groupByDay = (
	data: GameData[],
	year: number,
	month: number
): GroupedByDay => {
	const grouped = data.reduce((prev, curr) => {
		prev[Number(curr.released.slice(-2)) - 1].game_releases =
			prev[Number(curr.released.slice(-2)) - 1].game_releases || [];
		prev[Number(curr.released.slice(-2)) - 1].game_releases.push(curr);
		return prev;
	}, daysInMonthToObject(year, month));
	return grouped;
};

export const sortByMetacriticScore = (data: GroupedByDay): GroupedByDay => {
	let sorted = data.map((item) => {
		{
			if (item.game_releases.length < 2) return item;
			return {
				...item,
				game_releases: item.game_releases.sort(
					(a, b) => (b.metacritic || 0) - (a.metacritic || 0)
				),
			};
		}
	});
	return sorted;
};

export const getDateInString = (
	year: number,
	month: number,
	day?: number
): string => {
	const date = moment
		.utc()
		.year(year)
		.month(month)
		.date(day || 1)
		.toISOString(false)
		.slice(0, 10);
	return date;
};

export const getDaysInMonth = (year: number, month: number): number => {
	const daysInMonth = moment
		.utc()
		.year(year)
		.month(month)
		.startOf('month')
		.daysInMonth();
	return daysInMonth;
};

export const daysInMonthToObject = (
	year: number,
	month: number
): GroupedByDay => {
	const arr = [...Array(getDaysInMonth(year, month))].map((x, i) => {
		return {
			date: getDateInString(year, month, i + 1),
			dayOfMonth: i + 1,
			isCurrentMonth: true,
			isCurrentDay: moment().date() === i + 1,
			game_releases: [] as GameData[],
		};
	});
	return arr;
};

export const previousMonthDaysObjToDisplay = (
	year: number,
	month: number
): GroupedByDay => {
	const lastMonthLastWeekDayCount = moment
		.utc()
		.year(year)
		.month(month - 1)
		.endOf('month')
		.isoWeekday();
	const daysInMonth = moment
		.utc()
		.year(year)
		.month(month - 1)
		.daysInMonth();
	const arr = [...Array(lastMonthLastWeekDayCount)].map((x, i) => {
		return {
			date: getDateInString(year, month - 1, daysInMonth - i),
			dayOfMonth: daysInMonth - i,
			isCurrentMonth: false,
			isCurrentDay: false,
			game_releases: [] as GameData[],
		};
	});
	return arr.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
};

export const nextMonthDaysObjToDisplay = (
	year: number,
	month: number
): GroupedByDay => {
	const nextMonthFirstWeekDayCount =
		7 - moment.utc().year(year).month(month).endOf('month').isoWeekday();
	const arr = [...Array(nextMonthFirstWeekDayCount)].map((x, i) => {
		return {
			date: getDateInString(year, month + 1, i + 1),
			dayOfMonth: i + 1,
			isCurrentMonth: false,
			isCurrentDay: false,
			game_releases: [] as GameData[],
		};
	});
	return arr;
};
