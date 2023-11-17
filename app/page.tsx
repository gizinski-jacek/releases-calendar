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
import ThemeSwitcher from './components/ThemeSwitcher';

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
	const [screenIsSmall, setSmallScreen] = useState<boolean>(true);

	useEffect(() => {
		setDaysInSelectedMonth(getDaysInMonth(selectedYear, selectedMonth));
	}, [selectedYear, selectedMonth]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setSmallScreen(window.innerWidth < 768);
		}
	}, []);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const toggleScreenIsSmall = () => {
				setSmallScreen(window.innerWidth < 768);
			};

			window.addEventListener('resize', toggleScreenIsSmall);

			return () => window.removeEventListener('resize', toggleScreenIsSmall);
		}
	}, []);

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

	const setPresentDate = () => {
		const date = moment().utc();
		setSelectedYear(date.year());
		setSelectedMonth(date.month());
		setDaysInSelectedMonth(getDaysInMonth(date.year(), date.month()));
	};

	return (
		<main className='flex min-w-[640px] min-h-screen flex-col items-center justify-between px-2 md:py-1 md:px-4 lg:py-2 lg:px-8 xl:py-3 xl:px-12 relative'>
			{fetching && <LoadingSpinner />}
			<div className='mb-4 w-full flex flex-col'>
				<section className='text-base md:text-lg lg:text-xl flex justify-center gap-8 select-none font-semibold'>
					<span className='cursor-pointer' onClick={setPresentDate}>
						Current Month
					</span>
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
					<ThemeSwitcher />
				</section>
				<ul className='my-3 grid grid-cols-28 gap-4'>
					{((screenIsSmall && moment.weekdaysShort()) || moment.weekdays()).map(
						(day, i) => {
							return (
								<li
									key={day}
									className={`col-span-4 transition-all uppercase text-sm lg:text-base text-center font-semibold text-secondary border-2 border-secondary/80 hover:border-secondary/90 active:border-secondary bg-blue/75 hover:bg-blue/90 active:bg-blue hover:shadow active:shadow-md shadow-secondary/75 hover:shadow-secondary/90 active:shadow-secondary/90 rounded cursor-pointer select-none
								${
									highlightWeekDay === i + 1
										? '!shadow-md !shadow-gold !border-gold !bg-blue'
										: ''
								}`}
									onClick={() => changeHighlithedWeekDay(i + 1)}
								>
									{day}
								</li>
							);
						}
					)}
				</ul>
				<ul className='flex-1 grid grid-cols-28 gap-4'>
					{calendarData &&
						(excludeMature ? filterMature(calendarData) : calendarData).map(
							(item, index, array) => {
								// console.log(moment(item.date).weekday());
								// console.log(highlightWeekDay);
								return (
									// TODO: Fix highlighting not working
									// First day of the week issue
									<CalendarItemWrapper
										key={item.date}
										data={item}
										styleClass={getGridItemStyleClass(item, index, array)}
										highlight={
											highlightWeekDay
												? moment(item.date).weekday() === highlightWeekDay
												: undefined
										}
										translateDirection={
											index + 1 === 1 || (index + 1) % 7 === 1
												? 'right'
												: (index + 1) % 7 === 0
												? 'left'
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
