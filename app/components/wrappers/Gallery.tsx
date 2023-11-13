import Image from 'next/image';
import { useState } from 'react';
import ModalImage from '@/app/components/ModalImage';
import bgEmpty from '/public/empty-background.png';

interface Props {
	gallery: { id: number; image: string }[];
}

const Gallery = ({ gallery }: Props) => {
	const [slideIndex, setSlideIndex] = useState<number>(0);
	const [openImage, setOpenImage] = useState<string | null>(null);

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

	const changeSlideWithDots = (value: number) => {
		setSlideIndex(value);
	};

	const openModal = (value: string) => {
		setOpenImage(value);
	};

	const closeModal = () => {
		setOpenImage(null);
	};

	return gallery.length > 0 ? (
		<>
			<div className='w-full h-auto max-w-[600px] relative select-none'>
				<div
					className='absolute top-[50%] translate-y-[-50%] left-0 text-xl box-border cursor-pointer select-none p-4 transition-all bg-black/50 hover:bg-black/75 text-white rounded-tr-md rounded-br-md'
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
								alt='Game Image'
								width={600}
								height={337}
								className='w-full h-auto'
								onClick={() => openModal(item.image)}
							/>
						</div>
					);
				})}
				<div
					className='absolute top-[50%] translate-y-[-50%] right-0 text-xl box-border cursor-pointer select-none p-4 transition-all bg-black/50 hover:bg-black/75 text-white rounded-tl-md rounded-bl-md'
					onClick={nextSlide}
				>
					&#10095;
				</div>
			</div>
			<div className='flex justify-center items-center gap-2 p-1 pb-4'>
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
								className={`inline transition-all h-4 w-4 bg-gray-500 hover:bg-gray-300 rounded-lg cursor-pointer ${
									index === slideIndex ? 'bg-white hover:bg-white' : ''
								}`}
								onClick={() => changeSlideWithDots(index)}
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
			{openImage && (
				<ModalImage closeModal={closeModal}>
					<img
						src={openImage}
						alt='Game Image'
						className='w-full h-auto'
						onClick={closeModal}
					/>
				</ModalImage>
			)}
		</>
	) : (
		<div className='relative select-none bg-empty'>
			<Image src={bgEmpty} alt='No game images' />
		</div>
	);
};

export default Gallery;