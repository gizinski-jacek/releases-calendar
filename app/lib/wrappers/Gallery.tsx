import Image from 'next/image';
import { useState } from 'react';

interface Props {
	gallery: { id: number; image: string }[];
}

const Gallery = ({ gallery }: Props) => {
	const [slideIndex, setSlideIndex] = useState(0);

	const prevSlide = () => {
		if (slideIndex <= 0) {
			setSlideIndex(gallery.length - 1);
		} else {
			setSlideIndex((prevState) => prevState - 1);
		}
	};

	const nextSlide = () => {
		if (slideIndex >= gallery.length - 1) {
			setSlideIndex(0);
		} else {
			setSlideIndex((prevState) => prevState + 1);
		}
	};

	const changeSlideWithDots = (e: React.MouseEvent<HTMLSpanElement>) => {
		const { id } = e.target as HTMLSpanElement;
		setSlideIndex(Number(id));
	};

	return (
		<div className='w-full h-full flex flex-col'>
			<div
				className='absolute top-[40%] left-0 text-xl box-border cursor-pointer select-none p-4 transition-all bg-black/75 hover:bg-black text-white rounded-tr-md rounded-br-md'
				onClick={prevSlide}
			>
				&#10094;
			</div>
			{gallery.map((item, index) => {
				return (
					<div
						key={item.id}
						className={`${index === slideIndex ? 'block' : 'hidden'}`}
					>
						<Image
							src={item.image}
							alt='Image'
							width={800}
							height={450}
							className='w-full h-full'
						/>
					</div>
				);
			})}
			<div
				className='absolute top-[40%] right-0 text-xl box-border cursor-pointer select-none p-4 transition-all bg-black/75 hover:bg-black text-white rounded-tl-md rounded-bl-md'
				onClick={nextSlide}
			>
				&#10095;
			</div>
			<div className='flex justify-center items-center gap-2 m-2 my-8'>
				<div
					className='text-xl box-border cursor-pointer select-none px-1 transition-all text-gray-300 hover:text-white'
					onClick={prevSlide}
				>
					&#10094;
				</div>
				<div className='flex items-center gap-2'>
					{gallery.map((item, index) => {
						return (
							<span
								key={item.id}
								id={`${index}`}
								className={`inline transition-all h-4 w-4 bg-gray-500 hover:bg-gray-300 rounded-lg cursor-pointer ${
									index === slideIndex ? 'bg-white hover:bg-white' : ''
								}`}
								onClick={changeSlideWithDots}
							/>
						);
					})}
				</div>
				<div
					className='text-xl box-border cursor-pointer select-none px-1 transition-all text-gray-300 hover:text-white'
					onClick={nextSlide}
				>
					&#10095;
				</div>
			</div>
		</div>
	);
};

export default Gallery;
