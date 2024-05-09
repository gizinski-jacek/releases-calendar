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
	groupByDate,
	nextMonthDaysToObj,
	prevMonthDaysToObj,
} from './lib/utils';
import CalendarItemWrapper from './components/wrappers/CalendarDayWrapper';
import LoadingSpinner from './components/LoadingSpinner';
import ThemeSwitcher from './components/ThemeSwitcher';
import Button from './components/reusables/Button';
import Modal from './components/Modal';

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
	const [showYearSelectGrid, setShowYearSelectGrid] = useState<boolean>(false);
	const [showMonthSelectGrid, setShowMonthSelectGrid] =
		useState<boolean>(false);

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
					startDate,
					endDate,
				});
				const grouped = groupByDate(res.data, selectedYear, selectedMonth);
				const sorted = grouped.sort((a, b) => a.date.localeCompare(b.date));
				setCalendarData(sorted);
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

	const changeHighlightedWeekDay = (value: number) => {
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

	const handleChangeYear = (value: number) => {
		setSelectedYear(value);
		setShowYearSelectGrid(false);
	};

	const handleChangeMonth = (value: number) => {
		setSelectedMonth(value);
		setShowMonthSelectGrid(false);
	};

	const toggleShowMonthGrid = () => {
		setShowMonthSelectGrid((prevState) => !prevState);
		setShowYearSelectGrid(false);
	};

	const toggleShowYearGrid = () => {
		setShowYearSelectGrid((prevState) => !prevState);
		setShowMonthSelectGrid(false);
	};

	const closeModal = () => {
		setShowYearSelectGrid(false);
		setShowMonthSelectGrid(false);
	};

	return (
		<main className='flex min-w-[640px] min-h-screen flex-col items-center justify-between px-2 md:py-1 md:px-4 lg:py-2 lg:px-8 xl:py-3 xl:px-12 2xl:py-4 2xl:px-16 relative'>
			{fetching && <LoadingSpinner />}
			<div className='mb-4 w-full flex flex-col'>
				<section className='items-center text-base md:text-lg lg:text-xl flex justify-center gap-4 select-none font-semibold'>
					<Button styleClass='!px-1 !leading-6' cta={setPresentDate}>
						Reset Date
					</Button>
					<span
						className='transition-all hover:bg-custom-gray rounded-lg px-2 py-1 duration-300 opacity-75 hover:opacity-100 active:text-custom-red cursor-pointer'
						onClick={decrementMonth}
					>
						&#10094;
					</span>
					<div className='flex gap-4'>
						<div
							className='cursor-pointer hover:bg-custom-gray rounded-lg px-2 py-1 transition-all duration-300'
							onClick={toggleShowYearGrid}
						>
							{selectedYear}
						</div>
						<div
							className='cursor-pointer hover:bg-custom-gray rounded-lg px-2 py-1 transition-all duration-300'
							onClick={toggleShowMonthGrid}
						>
							{moment.monthsShort()[selectedMonth]}
						</div>
						{showYearSelectGrid && (
							<Modal closeModal={closeModal}>
								<div className='grid grid-cols-10 mb-0 bg-custom-primary border border-2 rounded-lg border-custom-secondary transition-all duration-300'>
									{Array.from(
										new Array(moment().year() + 3 - 1970),
										(x, i) => moment().year() + 3 - (i + 1970 + 1)
									).map((year) => (
										<div
											key={year + 1970}
											className={`${
												year + 1970 === selectedYear
													? 'text-custom-red'
													: 'hover:bg-custom-gray'
											} text-center cursor-pointer rounded-lg p-1 transition-all duration-300 relative`}
											onClick={() => handleChangeYear(year + 1970)}
										>
											{year + 1970}
										</div>
									))}
								</div>
							</Modal>
						)}
						{showMonthSelectGrid && (
							<Modal closeModal={closeModal}>
								<div className='grid grid-cols-4 mb-0 bg-custom-primary border border-2 rounded-lg border-custom-secondary transition-all duration-300'>
									{moment.months().map((month, i) => (
										<div
											key={month}
											className={`${
												i === selectedMonth
													? 'text-custom-red'
													: 'hover:bg-custom-gray'
											} text-center cursor-pointer rounded-lg p-2 transition-all duration-300 relative`}
											onClick={() => handleChangeMonth(i)}
										>
											{month}
										</div>
									))}
								</div>
							</Modal>
						)}
					</div>
					<span
						className='transition-all hover:bg-custom-gray rounded-lg px-2 py-1 duration-300 opacity-75 hover:opacity-100 active:text-custom-red cursor-pointer'
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
				<ul className='my-3 grid grid-cols-7 gap-4'>
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
							cta={() => changeHighlightedWeekDay(i)}
						>
							{day}
						</Button>
					))}
				</ul>
				<ul className='flex-1 grid grid-cols-7 gap-4'>
					{calendarData &&
						(showMature ? calendarData : filterMature(calendarData)).map(
							(item, index, array) => (
								<CalendarItemWrapper
									key={item.date}
									data={item}
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
