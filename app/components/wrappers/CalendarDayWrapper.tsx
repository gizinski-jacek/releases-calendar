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
	const [firstItemData, setFirstItemData] = useState<{
		src: string;
		mature: boolean;
	} | null>();
	const [secondItemData, setSecondItemData] = useState<{
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
		setFirstItemData(null);
		setSecondItemData(null);
		if (data.game_releases.length) {
			const item = data.game_releases.find((item) => item.background_image);
			setFirstItemData({
				src: item?.background_image || '',
				mature:
					!!item?.tags?.find((tag) => filterTags.includes(tag.slug)) || false,
			});
			if (data.game_releases.length > 1 && styleClass.includes('col-span-8')) {
				const itemArray = data.game_releases.filter(
					(item) => item.background_image
				);
				if (itemArray.length > 1) {
					setSecondItemData({
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
						className={`flex gap-[1px] h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 shadow shadow-secondary/75 bg-secondary/20 border-2 border-purple rounded-md relative bg-no-repeat bg-[size:100%_100%] overflow-hidden transition-all select-none
						${highlight ? '!shadow-md !shadow-gold !border-gold' : ''}
						${
							data.date === moment().utc().toISOString(false).slice(0, 10)
								? highlight
									? '!border-gold'
									: '!border-blue'
								: ''
						}
						${translateDirection ? 'translated-child' : ''}`}
					>
						{data.game_releases.length > 1 &&
						styleClass.includes('col-span-8') ? (
							<>
								{firstItemData && (
									<Image
										src={firstItemData.src}
										alt='First game cover art'
										width={400}
										height={225}
										className={`w-full h-full text-center
									${!firstItemData ? 'bg-empty' : ''}
									${firstItemData?.mature ? 'blur' : ''}`}
									/>
								)}
								{secondItemData && (
									<Image
										src={secondItemData.src}
										alt='Second game cover art'
										width={400}
										height={225}
										className={`w-full h-full text-center
									${!secondItemData ? 'bg-empty' : ''}
									${secondItemData?.mature ? 'blur' : ''}`}
									/>
								)}
							</>
						) : (
							firstItemData && (
								<Image
									src={firstItemData.src}
									alt='Game cover art'
									width={400}
									height={225}
									className={`w-full h-full text-center
								${!firstItemData ? 'bg-empty' : ''}
								${firstItemData?.mature ? 'blur' : ''}`}
								/>
							)
						)}
						<span
							className={`transition-all text-secondary absolute top-0 left-0 font-semibold text-sm md:text-base lg:text-lg xl:text-xl px-1 leading-5 rounded-br
						${
							data.date === moment().utc().toISOString(false).slice(0, 10)
								? highlight
									? '!text-primary !bg-gold'
									: '!text-gold !bg-blue'
								: '!bg-purple'
						}`}
						>
							{data.dayOfMonth}
						</span>
						{data.game_releases.length > 0 && (
							<span className='absolute bottom-0 right-0 bg-green-700 text-white font-semibold text-xs lg:text-sm xl:text-base px-[2px] md:px-1 rounded-tl'>
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
