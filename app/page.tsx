'use client';

import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { GameData, GroupedByDay } from './lib/types';
import {
	daysInMonthToObject,
	filterMature,
	getDateInString,
	getDaysInMonth,
	getDaysInNextMonth,
	getDaysInPrevMonth,
	getGridItemStyleClass,
	groupByDate,
	nextMonthDaysToObj,
	prevMonthDaysToObj,
	sortByMetacriticScore,
} from './lib/utils';
import CalendarItemWrapper from './components/wrappers/CalendarDayWrapper';
import LoadingSpinner from './components/LoadingSpinner';
import { weekdays } from './lib/data';

const Home = () => {
	const [fetching, setFetching] = useState<boolean>(true);
	const [excludeMature, setExcludeMature] = useState<boolean>(true);
	const [selectedYear, setSelectedYear] = useState<number>(
		moment().utc().year()
	);
	const [selectedMonth, setSelectedMonth] = useState<number>(
		moment().utc().month()
	);
	const [daysInSelectedMonth, setDaysInSelectedMonth] = useState<number>(
		getDaysInMonth(selectedYear, selectedMonth)
	);
	const [calendarData, setCalendarData] = useState<GroupedByDay>([
		...prevMonthDaysToObj(selectedYear, selectedMonth),
		...[...daysInMonthToObject(selectedYear, selectedMonth)],
		...nextMonthDaysToObj(selectedYear, selectedMonth),
	]);
	const [highlightWeekDay, setHighlightWeekDay] = useState<number | null>(null);

	useEffect(() => {
		setDaysInSelectedMonth(getDaysInMonth(selectedYear, selectedMonth));
	}, [selectedYear, selectedMonth]);

	useEffect(() => {
		(async () => {
			try {
				setFetching(true);
				const startDate = getDateInString(
					selectedYear,
					selectedMonth,
					moment.utc().date(1).date() -
						getDaysInPrevMonth(selectedYear, selectedMonth)
				);
				const endDate = getDateInString(
					selectedYear,
					selectedMonth,
					daysInSelectedMonth + getDaysInNextMonth(selectedYear, selectedMonth)
				);
				const res: AxiosResponse<GameData[]> = await axios.post('/api', {
					year: selectedYear,
					month: selectedMonth,
					date: `${startDate},${endDate}`,
				});
				const grouped = groupByDate(res.data, selectedYear, selectedMonth);
				const sortedScores = sortByMetacriticScore(grouped);
				const sortedDates = sortedScores.sort((a, b) =>
					a.date.localeCompare(b.date)
				);
				setCalendarData(sortedDates);
				setFetching(false);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.log('API error: ', error.message);
				} else {
					console.log('An unexpected API error occurred: ', error);
				}
				setFetching(false);
			}
		})();
	}, [selectedYear, selectedMonth, daysInSelectedMonth]);

	const decrementMonth = () => {
		if (selectedMonth === 0) {
			setSelectedYear(selectedYear - 1);
			setSelectedMonth(11);
		} else {
			setSelectedMonth(selectedMonth - 1);
		}
	};

	const incrementMonth = () => {
		if (selectedMonth === 11) {
			setSelectedYear(selectedYear + 1);
			setSelectedMonth(0);
		} else {
			setSelectedMonth(selectedMonth + 1);
		}
	};

	const toggleMature = () => {
		setExcludeMature(!excludeMature);
	};

	const changeHighlithedWeekDay = (value: number) => {
		highlightWeekDay === value
			? setHighlightWeekDay(null)
			: setHighlightWeekDay(value);
	};

	return (
		<main className='flex min-h-screen flex-col items-center justify-between py-6 px-12 relative'>
			{fetching && <LoadingSpinner />}
			<div className='mb-4 w-full flex-1 flex flex-col'>
				<section className='text-xl flex justify-center gap-8 select-none'>
					<span className='cursor-pointer' onClick={decrementMonth}>
						{'<'}
					</span>
					<span>{selectedYear}</span>
					<span>{moment().month(selectedMonth).format('MMMM')}</span>
					<span className='cursor-pointer' onClick={incrementMonth}>
						{'>'}
					</span>
					<span className='cursor-pointer' onClick={toggleMature}>
						+18
					</span>
				</section>
				<ul className='my-4 grid grid-cols-28 gap-4'>
					{weekdays.map((day, i) => {
						return (
							<li
								key={day}
								className={`col-span-4 text-center border-2 border-gray-500 font-bold shadow shadow-gray-500 bg-blue-700 rounded cursor-pointer select-none
								${highlightWeekDay === i ? 'shadow-lg border-white bg-blue-600' : ''}`}
								onClick={() => changeHighlithedWeekDay(i)}
							>
								{day}
							</li>
						);
					})}
				</ul>
				<ul className='flex-1 grid grid-cols-28 gap-4'>
					{calendarData &&
						(excludeMature ? filterMature(calendarData) : calendarData).map(
							(item, index, array) => {
								return (
									<CalendarItemWrapper
										key={item.date}
										data={item}
										styleClass={getGridItemStyleClass(item, index, array)}
										highlight={
											highlightWeekDay
												? (index + 1) % (highlightWeekDay! + 1) === 0
												: undefined
										}
										translateOnHover={
											index + 1 === 1 || (index + 1) % 7 === 1
												? 'hover-translate-child-right'
												: (index + 1) % 7 === 0
												? 'hover-translate-child-left'
												: undefined
										}
									/>
								);
							}
						)}
				</ul>
			</div>
		</main>
	);
};

export default Home;
