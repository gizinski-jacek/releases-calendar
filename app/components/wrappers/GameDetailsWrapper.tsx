import { storeLinks } from '@/app/lib/data';
import { GameData } from '../../lib/types';
import Gallery from '../Gallery';

interface Props {
	game: GameData;
}

const GameDetailsWrapper = ({ game }: Props) => {
	return (
		<div className='flex gap-4 bg-custom-gray'>
			<div className='min-w-[30%] md:min-w-[40%] lg:min-w-[50%] flex-1 shrink-0 grow p-1 md:p-2'>
				<div className='mb-1 md:mb-2 lg:mb-4 text-lg md:text-xl lg:text-2xl font-bold'>
					{game.name}
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 lg:gap-x-12 gap-y-2 md:gap-y-4'>
					<div>
						<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
							Release Date
						</div>
						<div className='text-sm md:text-base lg:text-lg'>
							{game.released}
						</div>
					</div>
					{game.metacritic && (
						<div>
							<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
								Metacritic Score
							</div>
							<div className='text-sm md:text-base lg:text-lg'>
								{game.metacritic}
							</div>
						</div>
					)}
					{game.esrb_rating && (
						<div>
							<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
								ESRB Rating
							</div>
							<div className='text-sm md:text-base lg:text-lg'>
								{game.esrb_rating.name}
							</div>
						</div>
					)}
					{game.genres?.length && (
						<div>
							<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
								Genres
							</div>
							<div className='text-sm md:text-base lg:text-lg'>
								{game.genres.map((genre) => genre.name).join(', ')}
							</div>
						</div>
					)}
					{game.platforms?.length && (
						<div>
							<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
								Platforms
							</div>
							<div className='text-sm md:text-base lg:text-lg'>
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
							<div className='font-bold text-sm md:text-base lg:text-lg text-custom-secondary/50 italic'>
								Stores
							</div>
							<div className='text-sm md:text-base lg:text-lg'>
								{game.stores
									.sort((a, b) => a.store.name.localeCompare(b.store.name))
									.map((item, i, arr) => (
										<>
											<a
												key={item.store.slug}
												href={storeLinks[item.store.slug]}
												target='_blank'
												rel='noreferrer'
												className='underline'
											>
												{item.store.name}
											</a>
											{i !== arr.length - 1 && ', '}
										</>
									))}
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
