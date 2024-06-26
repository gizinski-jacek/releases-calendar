import moment from 'moment';
import { GameData, GroupedByDay } from './types';
import { filterTags } from './data';

export const filterMature = (data: GroupedByDay): GroupedByDay => {
	const array = data.map((day) => {
		const filtered = day.game_releases.filter((item) => {
			if (!item.tags) return false;
			if (item.tags.find((tag) => filterTags.includes(tag.slug))) return false;
			return true;
		});
		return { ...day, game_releases: filtered };
	});
	return array;
};

export const groupByDate = (
	data: GameData[],
	year: number,
	month: number
): GroupedByDay => {
	const grouped = [
		...prevMonthDaysToObj(year, month),
		...daysInMonthToObject(year, month),
		...nextMonthDaysToObj(year, month),
	].map((day) => {
		return {
			...day,
			game_releases: data.filter((item) => item.released === day.date),
		};
	});
	return grouped;
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

export const getDaysInPrevMonth = (year: number, month: number): number => {
	const dayCount = moment
		.utc()
		.year(year)
		.month(month - 1)
		.endOf('month')
		.isoWeekday();
	return dayCount;
};

export const getDaysInMonth = (year: number, month: number): number => {
	const dayCount = moment
		.utc()
		.year(year)
		.month(month)
		.startOf('month')
		.daysInMonth();
	return dayCount;
};

export const getDaysInNextMonth = (year: number, month: number): number => {
	const dayCount =
		7 - moment.utc().year(year).month(month).endOf('month').isoWeekday();
	return dayCount;
};

export const prevMonthDaysToObj = (
	year: number,
	month: number
): GroupedByDay => {
	const prevMonthDays = getDaysInPrevMonth(year, month);
	const daysInPrevMonth = getDaysInMonth(year, month - 1);
	const arr = [...Array(prevMonthDays)].map((x, i) => {
		return {
			date: getDateInString(year, month - 1, daysInPrevMonth - i),
			dayOfMonth: daysInPrevMonth - i,
			isCurrentMonth: false,
			game_releases: [] as GameData[],
		};
	});
	return arr.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
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
			game_releases: [] as GameData[],
		};
	});
	return arr.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
};

export const nextMonthDaysToObj = (
	year: number,
	month: number
): GroupedByDay => {
	const nextMonthDays = getDaysInNextMonth(year, month);
	const arr = [...Array(nextMonthDays)].map((x, i) => {
		return {
			date: getDateInString(year, month + 1, i + 1),
			dayOfMonth: i + 1,
			isCurrentMonth: false,
			game_releases: [] as GameData[],
		};
	});
	return arr.sort((a, b) => a.dayOfMonth - b.dayOfMonth);
};
