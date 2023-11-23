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
import Button from './components/reusables/Button';

moment.updateLocale('en', {
	week: {
		dow: 1,
	},
});

const Home = () => {
	const [fetching, setFetching] = useState<boolean>(true);
	const [showMature, setShowMature] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<number>(moment.utc().year());
	const [selectedMonth, setSelectedMonth] = useState<number>(
		moment.utc().month()
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
		setShowMature(!showMature);
	};

	const changeHighlithedWeekDay = (value: number) => {
		highlightWeekDay === value
			? setHighlightWeekDay(null)
			: setHighlightWeekDay(value);
	};

	const setPresentDate = () => {
		const date = moment.utc();
		setSelectedYear(date.year());
		setSelectedMonth(date.month());
		setDaysInSelectedMonth(getDaysInMonth(date.year(), date.month()));
	};

	const selectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setSelectedYear(Number(value));
	};

	const selectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		setSelectedMonth(Number(value));
	};

	return (
		<main className='flex min-w-[640px] min-h-screen flex-col items-center justify-between px-2 md:py-1 md:px-4 lg:py-2 lg:px-8 xl:py-3 xl:px-12 relative'>
			{fetching && <LoadingSpinner />}
			<div className='mb-4 w-full flex flex-col'>
				<section className='text-base md:text-lg lg:text-xl flex justify-center gap-8 select-none font-semibold'>
					<Button styleClass='!px-1 !leading-6' cta={setPresentDate}>
						Reset Date
					</Button>
					<span
						className='transition-all duration-300 opacity-75 hover:opacity-100 active:text-custom-red cursor-pointer'
						onClick={decrementMonth}
					>
						&#10094;
					</span>
					<select
						name='year'
						id='year-select'
						value={selectedYear}
						onChange={selectYear}
						className='cursor-pointer bg-transparent hover:text-custom-red transition-all duration-300 z-20'
					>
						{Array.from(Array(moment().year() + 3 - 1970).keys()).map(
							(year, i) => (
								<option key={year} value={i + 1970}>
									{year + 1970}
								</option>
							)
						)}
					</select>
					<select
						name='month'
						id='month-select'
						value={selectedMonth}
						onChange={selectMonth}
						className='cursor-pointer bg-transparent hover:text-custom-red transition-all duration-300 z-20'
					>
						{moment.months().map((month, i) => (
							<option key={month} value={i}>
								{month}
							</option>
						))}
					</select>
					<span
						className='transition-all duration-300 opacity-75 hover:opacity-100 active:text-custom-red cursor-pointer'
						onClick={incrementMonth}
					>
						&#10095;
					</span>
					<Button
						styleClass={`!px-1 !leading-6 hover:opacity-100 active:opacity-100
					${
						showMature
							? 'opacity-100 !bg-custom-red !border-custom-secondary !text-custom-primary'
							: 'opacity-50'
					}`}
						cta={toggleMature}
					>
						+18
					</Button>
					<ThemeSwitcher />
				</section>
				<ul className='my-3 grid grid-cols-28 gap-4'>
					{(
						(screenIsSmall && moment.weekdaysShort(true)) ||
						moment.weekdays(true)
					).map((day, i) => (
						<Button
							key={day}
							styleClass={
								highlightWeekDay === i
									? '!shadow-md !shadow-custom-red !border-custom-red !bg-custom-blue'
									: ''
							}
							cta={() => changeHighlithedWeekDay(i)}
						>
							{day}
						</Button>
					))}
				</ul>
				<ul className='flex-1 grid grid-cols-28 gap-4'>
					{calendarData &&
						(showMature ? calendarData : filterMature(calendarData)).map(
							(item, index, array) => (
								<CalendarItemWrapper
									key={item.date}
									data={item}
									styleClass={getGridItemStyleClass(item, index, array)}
									highlight={moment(item.date).weekday() === highlightWeekDay}
									translateDirection={
										index + 1 === 1 || (index + 1) % 7 === 1
											? 'right'
											: (index + 1) % 7 === 0
											? 'left'
											: undefined
									}
								/>
							)
						)}
				</ul>
			</div>
		</main>
	);
};

export default Home;
