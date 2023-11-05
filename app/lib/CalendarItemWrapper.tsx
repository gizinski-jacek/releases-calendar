import { useEffect, useState } from 'react';
import { DayData } from './types';
import Modal from './Modal';

const CalendarItemWrapper = ({ data }: { data: DayData }) => {
	const [bgImage, setBgImage] = useState<string | null | undefined>(null);
	const [showModal, setShowModal] = useState<boolean>(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		if (data.game_releases.length) {
			setBgImage(
				data.game_releases.find((item) => item.background_image)
					?.background_image
			);
		}
	}, [data]);

	return (
		data &&
		data.game_releases && (
			<>
				<li
					key={data.date}
					className={`bg-gray-800 rounded-md relative min-h-[80px] bg-no-repeat bg-[size:100%_100%] calendar_day
					${data.isCurrentMonth ? '' : 'opacity-50'} 
					${data.isCurrentDay ? 'text-yellow-500' : ''} 
					${data.game_releases.length ? 'cursor-pointer' : ''}
					${!data.game_releases.length || bgImage ? '' : 'bg-empty'}`}
					style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
					onClick={data.game_releases.length ? openModal : undefined}
				>
					<span className='font-bold text-2xl bg-blue-500 px-1 m-0 rounded'>
						{data.dayOfMonth}
					</span>
					{data.game_releases.length > 0 && (
						<span className='absolute right-0 bottom-0 bg-green-700 px-1 text-sm rounded'>
							{data.game_releases.length}
						</span>
					)}
				</li>
				{showModal && data.game_releases.length && (
					<Modal closeModal={closeModal}>
						{data.game_releases?.map((item) => {
							return (
								<div key={item.id}>
									<div>{item.released}</div>
									<div>{item.name}</div>
									<div>{item.metacritic}</div>
								</div>
							);
						})}
					</Modal>
				)}
			</>
		)
	);
};

export default CalendarItemWrapper;
