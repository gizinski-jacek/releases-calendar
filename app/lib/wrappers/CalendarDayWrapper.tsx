import { useEffect, useState } from 'react';
import { DayData } from '../types';
import Modal from '../Modal';
import GameDetailsWrapper from './GameDetailsWrapper';
import Image from 'next/image';
import bgEmpty from '/public/empty-background.png';

interface Props {
	data: DayData;
	styleClass?: string;
	highlight?: boolean;
	translateOnHover?:
		| 'hover-translate-child-right'
		| 'hover-translate-child-left'
		| undefined;
}

const CalendarItemWrapper = ({
	data,
	styleClass = '',
	highlight = false,
	translateOnHover = undefined,
}: Props) => {
	const [bgImage, setBgImage] = useState<string | null | undefined>(null);
	const [bgImageSecondary, setBgImageSecondary] = useState<
		string | null | undefined
	>(null);
	const [showModal, setShowModal] = useState<boolean>(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		setShowModal(false);
		setBgImage(null);
		setBgImageSecondary(null);
		if (data.game_releases.length) {
			setBgImage(
				data.game_releases.find((item) => item.background_image)
					?.background_image
			);
			if (data.game_releases.length > 1 && styleClass.includes('col-span-8')) {
				const bgImagesArray = data.game_releases.filter(
					(item) => item.background_image
				);
				if (bgImagesArray.length > 1) {
					setBgImageSecondary(bgImagesArray[1].background_image);
				}
			}
		}
	}, [data, styleClass]);

	return (
		data &&
		data.game_releases && (
			<>
				<li
					key={data.date}
					className={` 
					${data.isCurrentMonth ? '' : 'opacity-50 hover:opacity-100'}
					${data.game_releases.length ? 'cursor-pointer hover:z-10' : ''}
					${data.game_releases.length && translateOnHover ? translateOnHover : ''}
					${
						data.game_releases.length && !translateOnHover
							? 'transition-all hover:scale-150'
							: ''
					}
					${styleClass}`}
					onClick={data.game_releases.length ? openModal : undefined}
				>
					<div
						className={`flex gap-[1px] h-28 shadow shadow-gray-500 bg-purple-800 border-2 border-purple-700 rounded-md relative bg-no-repeat bg-[size:100%_100%] transition-all select-none
						${highlight ? 'shadow-lg border-white' : ''}
						${translateOnHover ? 'translated-child' : ''}`}
					>
						{data.game_releases.length > 1 &&
						styleClass.includes('col-span-8') ? (
							<>
								<Image
									src={bgImage || bgEmpty}
									alt='Game cover 1'
									width={400}
									height={225}
									className={`w-full h-full rounded-tl rounded-bl
								${!bgImage ? 'bg-empty' : ''}`}
								/>
								<Image
									src={bgImageSecondary || bgEmpty}
									alt='Game cover 2'
									width={400}
									height={225}
									className={`w-full h-full rounded-tr rounded-br
								${!bgImageSecondary ? 'bg-empty' : ''}`}
								/>
							</>
						) : (
							<Image
								src={bgImage || bgEmpty}
								alt='Game cover'
								width={400}
								height={225}
								className={`w-full h-full rounded
							${!bgImage ? 'bg-empty' : ''}`}
							/>
						)}
						<span
							className={`absolute top-0 left-0 font-bold text-2xl px-1 rounded-tl rounded-br leading-[1.8rem]
						${data.isCurrentDay ? 'text-yellow-300 bg-blue-700' : 'bg-purple-700'}`}
						>
							{data.dayOfMonth}
						</span>
						{data.game_releases.length > 0 && (
							<span className='absolute bottom-0 right-0 bg-green-700 font-bold px-1 text-sm rounded-tl rounded-br'>
								{data.game_releases.length}
							</span>
						)}
					</div>
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
