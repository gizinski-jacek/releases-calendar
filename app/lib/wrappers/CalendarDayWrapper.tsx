import { useEffect, useState } from 'react';
import { DayData } from '../types';
import Modal from '../Modal';
import GameDetailsWrapper from './GameDetailsWrapper';

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
					className={`shadow shadow-gray-500 bg-gray-800 border-[1px] border-purple-700 rounded-md relative min-h-[80px] bg-no-repeat bg-[size:100%_100%] transition-all hover:z-10 hover:scale-150
					${data.isCurrentMonth ? '' : 'opacity-50 hover:opacity-100'}
					${data.game_releases.length ? 'cursor-pointer' : ''}
					${!data.game_releases.length || bgImage ? '' : 'bg-empty'}`}
					style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
					onClick={data.game_releases.length ? openModal : undefined}
				>
					<span
						className={`font-bold text-2xl px-2 rounded-tl rounded-br leading-[1.8rem] 
						${data.isCurrentDay ? 'text-yellow-300 bg-blue-700' : 'bg-purple-700'}`}
					>
						{data.dayOfMonth}
					</span>
					{data.game_releases.length > 0 && (
						<span className='absolute right-0 bottom-0 bg-green-700 font-bold px-1 text-sm rounded-tl rounded-br '>
							{data.game_releases.length}
						</span>
					)}
				</li>
				{showModal && data.game_releases.length && (
					<Modal closeModal={closeModal}>
						{data.game_releases?.map((game) => (
							<GameDetailsWrapper key={game.id} game={game} />
						))}
					</Modal>
				)}
			</>
		)
	);
};

export default CalendarItemWrapper;
