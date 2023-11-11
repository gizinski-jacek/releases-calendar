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
	sortByMetacriticScore,
} from './lib/utils';
import CalendarItemWrapper from './lib/wrappers/CalendarDayWrapper';
import LoadingSpinner from './components/LoadingSpinner';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
				const filtered = excludeMature ? filterMature(res.data) : res.data;
				const grouped = groupByDate(filtered, selectedYear, selectedMonth);
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
	}, [selectedYear, selectedMonth, daysInSelectedMonth, excludeMature]);

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

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-12 relative'>
			{fetching && <LoadingSpinner />}
			<div className='p-2 w-full flex-1 flex flex-col'>
				<section className='mb-2 text-xl flex justify-center gap-8'>
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
				<ul className='mb-2 grid grid-cols-28 gap-4'>
					{weekdays.map((day) => {
						return (
							<li key={day} className='col-span-4'>
								{day}
							</li>
						);
					})}
				</ul>
				<ul className='flex-1 grid grid-cols-28 gap-4'>
					{calendarData?.map((item, index, array) => {
						let styleClass = 'col-span-4';
						if (item.game_releases.length > 0) {
							// Days with game releases
							if ((index + 1) % 7 > 1) {
								// Days 2-6 of the week
								if (
									item.game_releases.length > 1 &&
									array[index + 1].game_releases.length === 0 &&
									array[index - 1].game_releases.length === 0 &&
									array[index - 2].game_releases.length === 0 &&
									item.game_releases.filter((item) => item.background_image)
										.length > 1
								) {
									styleClass = 'col-span-8';
								} else if (
									array[index + 1].game_releases.length === 0 ||
									(array[index - 1].game_releases.length === 0 &&
										array[index - 2].game_releases.length === 0)
								) {
									styleClass = 'col-span-6';
								}
							} else if (index === 0 || (index + 1) % 7 === 1) {
								// First day the week
								if (array[index + 1].game_releases.length === 0) {
									styleClass = 'col-span-6';
								}
							} else if ((index + 1) % 7 === 0) {
								// Last day the week
								if (
									array[index - 1].game_releases.length === 0 &&
									array[index - 2].game_releases.length === 0
								) {
									styleClass = 'col-span-6';
								}
							}
						} else if (item.game_releases.length === 0) {
							// Days without game releases
							if ((index + 1) % 7 > 1) {
								if (
									array[index + 1].game_releases.length > 0 ||
									array[index - 1].game_releases.length > 0
								) {
									styleClass = 'col-span-2';
								}
							} else if (index + 1 === 1 || (index + 1) % 7 === 1) {
								if (array[index + 1].game_releases.length > 0) {
									styleClass = 'col-span-2';
								}
							} else if ((index + 1) % 7 === 0) {
								if (array[index - 1].game_releases.length > 0) {
									styleClass = 'col-span-2';
								}
							}
						}
						return (
							<CalendarItemWrapper
								key={item.date}
								data={item}
								styleClass={styleClass}
							/>
						);
					})}
				</ul>
			</div>
		</main>
	);
};

export default Home;
