import { useEffect, useState } from 'react';
import { DayData } from '../../lib/types';
import Modal from '../Modal';
import GameDetailsWrapper from './GameDetailsWrapper';
import Image from 'next/image';
import { filterTags } from '@/app/lib/data';
import moment from 'moment';

interface Props {
	data: DayData;
	styleClass?: string;
	highlight?: boolean;
	translateDirection?: 'left' | 'right' | undefined;
}

const CalendarItemWrapper = ({
	data,
	highlight = false,
	translateDirection = undefined,
}: Props) => {
	const [imageData, setImageData] = useState<{
		src: string;
		mature: boolean;
	} | null>();
	const [showModal, setShowModal] = useState<boolean>(false);

	const openModal = () => {
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
	};

	useEffect(() => {
		setShowModal(false);
		setImageData(null);
		if (data.game_releases.length) {
			const item = data.game_releases.find((item) => item.background_image);
			if (!item) return;
			setImageData({
				src: item.background_image || '',
				mature:
					!!item?.tags?.find((tag) => filterTags.includes(tag.slug)) || false,
			});
		}
	}, [data]);

	return (
		data &&
		data.game_releases && (
			<>
				<li
					key={data.date}
					className={`
					${
						data.game_releases.length
							? 'cursor-pointer hover:z-10 hover:scale-150 transition-all duration-300'
							: ''
					}
					${
						data.game_releases.length && translateDirection
							? `translate-${translateDirection}`
							: ''
					}`}
					onClick={data.game_releases.length ? openModal : undefined}
				>
					<div
						className={`flex gap-[1px] h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 shadow shadow-custom-secondary/75 border-2 border-custom-purple rounded-md relative bg-no-repeat bg-[size:100%_100%] overflow-hidden transition-all duration-300 select-none
						${
							data.date === moment.utc().toISOString(false).slice(0, 10)
								? '!border-custom-blue'
								: ''
						}
						${data.isCurrentMonth ? '' : 'opacity-50 hover:opacity-100'}
						${data.game_releases.length === 0 ? 'bg-custom-alt-gray' : 'bg-custom-gray'}
						${
							highlight
								? '!shadow-md !shadow-custom-red !border-custom-red !opacity-100'
								: ''
						}
						${translateDirection ? 'translated-child' : ''}`}
					>
						{imageData &&
							(imageData.src ? (
								<Image
									src={imageData.src}
									alt='Game cover art'
									width={400}
									height={225}
									className={`w-full h-full text-center
								${!imageData.src ? 'bg-empty' : ''}
								${imageData?.mature ? 'blur' : ''}`}
								/>
							) : (
								<div className='bg-empty' />
							))}
						<div className='absolute top-0 bottom-0 left-0 right-0 flex'>
							<div
								className={`opacity-90 me-auto self-start relative transition-all duration-300 border-[1.1rem] md:border-[1.25rem] lg:border-[1.5rem] border-custom-purple !border-b-transparent !border-r-transparent text-custom-secondary font-bold text-sm md:text-base lg:text-lg xl:text-xl
								${
									data.date === moment.utc().toISOString(false).slice(0, 10)
										? '!border-custom-blue'
										: ''
								}`}
							>
								<span className='absolute block top-[-1rem] left-[-1.05rem] md:top-[-1.20rem] md:left-[-1.25rem] lg:top-[-1.35rem] lg:left-[-1.40rem] w-[1.25rem] h-[1.25rem] md:w-[1.5rem] md:h-[1.5rem] lg:w-[1.75rem] lg:h-[1.75rem] text-center rotate-[-45deg]'>
									{data.dayOfMonth}
								</span>
							</div>
							{data.game_releases.length > 0 && (
								<div className='absolute opacity-80 ms-auto self-end relative transition-all duration-300 border-[0.85rem] lg:border-[0.95rem] xl:border-[1.1rem] border-green-700 border-t-transparent border-l-transparent text-white font-semibold text-xs lg:text-sm xl:text-base'>
									<span className='absolute bottom-[-0.75rem] right-[-0.75rem] lg:bottom-[-0.95rem] lg:right-[-0.95rem] xl:bottom-[-1.15rem] xl:right-[-1.15rem] w-[1rem] h-[1rem] lg:w-[1.25rem] lg:h-[1.25rem] xl:w-[1.5rem] xl:h-[1.5rem] text-center rotate-[-45deg]'>
										{data.game_releases.length}
									</span>
								</div>
							)}
						</div>
					</div>
				</li>
				{showModal && data.game_releases.length && (
					<Modal closeModal={closeModal}>
						<div className='flex flex-col gap-1 bg-custom-secondary border-2 border-custom-secondary rounded overflow-y-auto shadow-md shadow-custom-primary'>
							{data.game_releases?.map((game) => (
								<GameDetailsWrapper key={game.id} game={game} />
							))}
						</div>
					</Modal>
				)}
			</>
		)
	);
};

export default CalendarItemWrapper;
