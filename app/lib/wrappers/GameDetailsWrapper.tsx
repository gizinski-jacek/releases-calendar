import Image from 'next/image';
import { GameData } from '../types';
import { useState } from 'react';
import Modal from '../Modal';
import Gallery from './Gallery';

interface Props {
	game: GameData;
}

const GameDetailsWrapper = ({ game }: Props) => {
	const [galleryOpen, setGalleryOpen] = useState<boolean>(false);

	const openGallery = () => {
		setGalleryOpen(true);
	};

	const closeGallery = () => {
		setGalleryOpen(false);
	};

	return (
		<div className='flex bg-gray-800'>
			<div className='flex-1 p-2'>
				<div className='mb-4 font-bold'>{game.name}</div>
				<div className='grid grid-cols-2 gap-x-12 gap-y-4'>
					<div>
						<div className='font-bold'>Release Date</div>
						<div>{game.released}</div>
					</div>
					{game.metacritic && (
						<div>
							<div className='font-bold'>Metacritic Score</div>
							<div>{game.metacritic}</div>
						</div>
					)}
					{game.esrb_rating && (
						<div>
							<div className='font-bold'>ESRB Rating</div>
							<div>{game.esrb_rating.name}</div>
						</div>
					)}
					{game.genres?.length && (
						<div>
							<div className='font-bold'>Genres</div>
							<div>
								{game.genres.map((genre) => (
									<div key={genre.id}>{genre.name}</div>
								))}
							</div>
						</div>
					)}
					{game.platforms?.length && (
						<div>
							<div className='font-bold'>Platforms</div>
							<div>
								{game.platforms
									.sort((a, b) =>
										a.platform.name.localeCompare(b.platform.name)
									)
									.map((item) => item.platform.name)
									.join(', ')}
							</div>
						</div>
					)}
					{game.stores?.length && (
						<div>
							<div className='font-bold'>Stores</div>
							<div>
								{game.stores
									.sort((a, b) => a.store.name.localeCompare(b.store.name))
									.map((item) => item.store.name)
									.join(', ')}
							</div>
						</div>
					)}
				</div>
				{game.short_screenshots?.length && (
					<div className='mt-4 pb-3 flex overflow-scroll '>
						{game.short_screenshots.map((pic) => (
							<>
								<Image
									key={pic.id}
									src={pic.image}
									alt='Image'
									width={200}
									height={100}
									className='cursor-pointer'
									onClick={openGallery}
								/>
								{galleryOpen && game.short_screenshots?.length && (
									<Modal
										closeModal={closeGallery}
										fullH={true}
										bgColor='bg-black'
										borderC='border-gray-300'
									>
										<Gallery gallery={game.short_screenshots} />
									</Modal>
								)}
							</>
						))}
					</div>
				)}
			</div>
			<Image
				src={game.background_image || ''}
				alt='Cover Art'
				width={600}
				height={375}
			/>
		</div>
	);
};

export default GameDetailsWrapper;
