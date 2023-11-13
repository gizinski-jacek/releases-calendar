import { useEffect, useState } from 'react';
import { DayData } from '../../lib/types';
import Modal from '../Modal';
import GameDetailsWrapper from './GameDetailsWrapper';
import Image from 'next/image';
import bgEmpty from '/public/empty-background.png';
import { filterTags } from '@/app/lib/data';

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
						className={`flex gap-[1px] h-16 md:h-20 lg:h-24 xl:h-28 shadow shadow-gray-500 bg-purple-800 border-2 border-purple-700 rounded-md relative bg-no-repeat bg-[size:100%_100%] transition-all select-none
						${highlight ? 'shadow-lg border-white' : ''}
						${translateOnHover ? 'translated-child' : ''}`}
					>
						{data.game_releases.length > 1 &&
						styleClass.includes('col-span-8') ? (
							<>
								<Image
									src={firstItemData?.src || bgEmpty}
									alt='Game 1 cover'
									width={400}
									height={225}
									className={`w-full h-full rounded-tl rounded-bl
									${!firstItemData ? 'bg-empty' : ''}
									${firstItemData?.mature ? 'blur' : ''}`}
								/>
								<Image
									src={secondItemData?.src || bgEmpty}
									alt='Game 2 cover'
									width={400}
									height={225}
									className={`w-full h-full rounded-tr rounded-br
									${!secondItemData ? 'bg-empty' : ''}
									${secondItemData?.mature ? 'blur' : ''}`}
								/>
							</>
						) : (
							<Image
								src={firstItemData?.src || bgEmpty}
								alt='Game cover'
								width={400}
								height={225}
								className={`w-full h-full rounded
								${!firstItemData ? 'bg-empty' : ''}
								${firstItemData?.mature ? 'blur' : ''}`}
							/>
						)}
						<span
							className={`absolute top-0 left-0 font-bold text-sm md:text-base lg:text-lg xl:text-xl ps-[1px] pe-[4px] pb-[2px] leading-5 rounded-tl rounded-br
						${data.isCurrentDay ? 'text-yellow-300 bg-blue-700' : 'bg-purple-700'}`}
						>
							{data.dayOfMonth}
						</span>
						{data.game_releases.length > 0 && (
							<span className='absolute bottom-0 right-0 bg-green-700 font-bold text-xs md:text-sm lg:text-base xl:text-lg px-[2px] md:px-1 rounded-tl rounded-br'>
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
