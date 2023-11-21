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
	styleClass = '',
	highlight = false,
	translateDirection = undefined,
}: Props) => {
	const [firstImageData, setFirstImageData] = useState<{
		src: string;
		mature: boolean;
	} | null>();
	const [secondImageData, setSecondImageData] = useState<{
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
		setFirstImageData(null);
		setSecondImageData(null);
		if (data.game_releases.length) {
			const item = data.game_releases.find((item) => item.background_image);
			setFirstImageData({
				src: item?.background_image || '',
				mature:
					!!item?.tags?.find((tag) => filterTags.includes(tag.slug)) || false,
			});
			if (data.game_releases.length > 1 && styleClass.includes('col-span-8')) {
				const itemArray = data.game_releases.filter(
					(item) => item.background_image
				);
				if (itemArray.length > 1) {
					setSecondImageData({
						src: itemArray[1].background_image || '',
						mature:
							!!itemArray[1].tags?.find((tag) =>
								filterTags.includes(tag.slug)
							) || false,
					});
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
					${
						data.game_releases.length
							? 'cursor-pointer hover:z-10 hover:scale-150 transition-all'
							: ''
					}
					${
						data.game_releases.length && translateDirection
							? `translate-${translateDirection}`
							: ''
					}
					${styleClass}`}
					onClick={data.game_releases.length ? openModal : undefined}
				>
					<div
						className={`flex gap-[1px] h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 shadow shadow-custom-secondary/75 bg-custom-secondary/20 border-2 border-custom-purple rounded-md relative bg-no-repeat bg-[size:100%_100%] overflow-hidden transition-all select-none
						${
							data.date === moment().utc().toISOString(false).slice(0, 10)
								? '!border-custom-blue'
								: ''
						}
						${highlight ? '!shadow-md !shadow-custom-red !border-custom-red' : ''}
						${translateDirection ? 'translated-child' : ''}`}
					>
						{data.game_releases.length > 1 &&
						styleClass.includes('col-span-8') ? (
							<>
								{firstImageData && (
									<Image
										src={firstImageData.src}
										alt='First game cover art'
										width={400}
										height={225}
										className={`w-full h-full text-center
									${!firstImageData.src ? 'bg-empty' : ''}
									${firstImageData?.mature ? 'blur' : ''}`}
									/>
								)}
								{secondImageData && (
									<Image
										src={secondImageData.src}
										alt='Second game cover art'
										width={400}
										height={225}
										className={`w-full h-full text-center
									${!secondImageData.src ? 'bg-empty' : ''}
									${secondImageData?.mature ? 'blur' : ''}`}
									/>
								)}
							</>
						) : (
							firstImageData && (
								<Image
									src={firstImageData.src}
									alt='Game cover art'
									width={400}
									height={225}
									className={`w-full h-full text-center
								${!firstImageData.src ? 'bg-empty' : ''}
								${firstImageData?.mature ? 'blur' : ''}`}
								/>
							)
						)}
						<div className='absolute top-0 bottom-0 left-0 right-0 flex'>
							<div
								className={`opacity-90 me-auto self-start relative transition-all border-[1.1rem] md:border-[1.25rem] lg:border-[1.5rem] border-custom-purple !border-b-transparent !border-r-transparent text-custom-secondary font-bold text-sm md:text-base lg:text-lg xl:text-xl
								${
									data.date === moment().utc().toISOString(false).slice(0, 10)
										? '!border-custom-blue'
										: ''
								}`}
							>
								<span className='absolute block top-[-1rem] left-[-1.05rem] md:top-[-1.20rem] md:left-[-1.25rem] lg:top-[-1.35rem] lg:left-[-1.40rem] w-[1.25rem] h-[1.25rem] md:w-[1.5rem] md:h-[1.5rem] lg:w-[1.75rem] lg:h-[1.75rem] text-center rotate-[-45deg]'>
									{data.dayOfMonth}
								</span>
							</div>
							{data.game_releases.length > 0 && (
								<div className='absolute opacity-80 ms-auto self-end relative transition-all border-[0.85rem] lg:border-[0.95rem] xl:border-[1.1rem] border-green-700 border-t-transparent border-l-transparent text-white font-semibold text-xs lg:text-sm xl:text-base'>
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
