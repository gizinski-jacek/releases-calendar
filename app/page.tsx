'use client';

import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { GroupedByDay } from './lib/types';
import {
	daysInMonthToObject,
	filterMature,
	getDateInString,
	getDaysInMonth,
	groupByDay,
	nextMonthDaysObjToDisplay,
	previousMonthDaysObjToDisplay,
	sortByMetacriticScore,
} from './lib/utils';
import CalendarItemWrapper from './lib/CalendarItemWrapper';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Home = () => {
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
		...previousMonthDaysObjToDisplay(selectedYear, selectedMonth),
		...[...daysInMonthToObject(selectedYear, selectedMonth)],
		...nextMonthDaysObjToDisplay(selectedYear, selectedMonth),
	]);

	useEffect(() => {
		setDaysInSelectedMonth(getDaysInMonth(selectedYear, selectedMonth));
	}, [selectedYear, selectedMonth]);

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.post('/api', {
					year: selectedYear,
					month: selectedMonth,
					date: `${getDateInString(
						selectedYear,
						selectedMonth
					)},${getDateInString(
						selectedYear,
						selectedMonth,
						daysInSelectedMonth
					)}`,
				});
				const filtered = excludeMature ? filterMature(res.data) : res.data;
				const grouped = groupByDay(filtered, selectedYear, selectedMonth);
				const sorted = sortByMetacriticScore(grouped);
				const calendarData = [
					...previousMonthDaysObjToDisplay(selectedYear, selectedMonth),
					...sorted,
					...nextMonthDaysObjToDisplay(selectedYear, selectedMonth),
				];
				setCalendarData(calendarData);
			} catch (error) {
				console.error(error);
				console.error('API error');
			}
		})();
	}, [selectedYear, selectedMonth, daysInSelectedMonth, excludeMature]);
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-12'>
			<div className='calendar-month p-4 w-full min-h-full'>
				<ul id='days-of-week' className='day-of-week grid grid-cols-7 gap-4'>
					{weekdays.map((day) => {
						return (
							<li id={day} key={day}>
								{day}
							</li>
						);
					})}
				</ul>
				<ul id='calendar-days' className='days-grid grid grid-cols-7 gap-4'>
					{calendarData?.map((item) => (
						<CalendarItemWrapper key={item.date} data={item} />
					))}
				</ul>
			</div>
		</main>
	);
};

export default Home;
