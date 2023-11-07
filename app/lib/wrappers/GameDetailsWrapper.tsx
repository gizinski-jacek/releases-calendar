import { GameData } from '../types';
import { useState } from 'react';
import Gallery from './Gallery';

interface Props {
	game: GameData;
}

const GameDetailsWrapper = ({ game }: Props) => {
	return (
		<div className='flex gap-4 bg-gray-800'>
			<div className='min-w-[50%] flex-1 shrink-0 grow p-2'>
				<div className='mb-4 text-2xl font-bold'>{game.name}</div>
				<div className='grid grid-cols-2 gap-x-12 gap-y-4'>
					<div>
						<div className='font-bold text-gray-400 italic'>Release Date</div>
						<div>{game.released}</div>
					</div>
					{game.metacritic && (
						<div>
							<div className='font-bold text-gray-400 italic'>
								Metacritic Score
							</div>
							<div>{game.metacritic}</div>
						</div>
					)}
					{game.esrb_rating && (
						<div>
							<div className='font-bold text-gray-400 italic'>ESRB Rating</div>
							<div>{game.esrb_rating.name}</div>
						</div>
					)}
					{game.genres?.length && (
						<div>
							<div className='font-bold text-gray-400 italic'>Genres</div>
							<div>{game.genres.map((genre) => genre.name).join(', ')}</div>
						</div>
					)}
					{game.platforms?.length && (
						<div>
							<div className='font-bold text-gray-400 italic'>Platforms</div>
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
							<div className='font-bold text-gray-400 italic'>Stores</div>
							<div>
								{game.stores
									.sort((a, b) => a.store.name.localeCompare(b.store.name))
									.map((item) => item.store.name)
									.join(', ')}
							</div>
						</div>
					)}
				</div>
			</div>
			{game.short_screenshots && (
				<div className='flex-none basis-[600px] shrink grow-0 h-fit'>
					<Gallery gallery={game.short_screenshots} />
				</div>
			)}
		</div>
	);
};

export default GameDetailsWrapper;
