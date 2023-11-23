import Image from 'next/image';
import { useState } from 'react';
import ModalImage from '@/app/components/ModalImage';
import bgEmpty from '/public/empty-background.png';

interface Props {
	gallery: { id: number; image: string }[] | null | undefined;
}

const Gallery = ({ gallery }: Props) => {
	const [slideIndex, setSlideIndex] = useState<number>(0);
	const [openImage, setOpenImage] = useState<string | null>(null);

	const prevSlide = () => {
		if (!gallery) return;
		if (slideIndex <= 0) {
			setSlideIndex(gallery.length - 1);
		} else {
			setSlideIndex((prevState) => prevState - 1);
		}
	};

	const nextSlide = () => {
		if (!gallery) return;
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

	return gallery && gallery.length > 0 ? (
		<>
			<div className='w-full h-auto max-w-[600px] relative select-none'>
				<div
					className='absolute top-[50%] translate-y-[-50%] left-0 z-10 border-[1px] border-custom-gray-600 hover:border-custom-gray-400 active:border-white text-custom-gray-500 hover:text-white active:text-white text-sm md:text-base lg:text-lg p-2 md:p-3 lg:p-4 box-border cursor-pointer select-none transition-all duration-300 bg-black/50 hover:bg-black/75 active:bg-black/90 text-white rounded-tr-md rounded-br-md'
					onClick={prevSlide}
				>
					&#10094;
				</div>
				{gallery.map((item, index) => {
					return (
						<div
							key={item.id}
							className={`${index === slideIndex ? 'w-unset' : 'w-0'}`}
						>
							<Image
								src={item.image}
								alt='Game Image'
								width={600}
								height={337}
								className='w-full h-auto text-center'
								onClick={() => openModal(item.image)}
							/>
						</div>
					);
				})}
				<div
					className='absolute top-[50%] translate-y-[-50%] right-0 z-10 border-[1px] border-custom-gray-600 hover:border-custom-gray-400 active:border-white text-custom-gray-500 hover:text-white active:text-white text-sm md:text-base lg:text-lg p-2 md:p-3 lg:p-4 box-border cursor-pointer select-none transition-all duration-300 bg-black/50 hover:bg-black/75 active:bg-black/90 text-white rounded-tl-md rounded-bl-md'
					onClick={nextSlide}
				>
					&#10095;
				</div>
			</div>
			<div className='flex justify-center items-center gap-1 md:gap-2 lg:gap-3 p-1 pb-4'>
				<div
					className='text-lg md:text-xl lg:text-2xl box-border cursor-pointer select-none px-1 transition-all duration-300 font-bold text-custom-secondary/60 hover:text-custom-secondary/80 active:text-custom-secondary'
					onClick={prevSlide}
				>
					&#10094;
				</div>
				<div className='flex items-center gap-1 md:gap-2 lg:gap-3'>
					{gallery.map((item, index) => {
						return (
							<span
								key={item.id}
								className={`inline transition-all duration-300 h-3 border-[2px] border-custom-secondary/60 w-3 md:h-4 md:w-4 bg-custom-secondary/60 hover:bg-custom-secondary/80 active:bg-custom-secondary rounded-lg cursor-pointer ${
									index === slideIndex
										? '!bg-custom-secondary !border-custom-secondary'
										: ''
								}`}
								onClick={() => changeSlideWithDots(index)}
							/>
						);
					})}
				</div>
				<div
					className='text-lg md:text-xl lg:text-2xl box-border cursor-pointer select-none px-1 transition-all duration-300 font-bold text-custom-secondary/60 hover:text-custom-secondary/80 active:text-custom-secondary'
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
						className='w-full h-auto text-center'
						onClick={closeModal}
					/>
				</ModalImage>
			)}
		</>
	) : (
		<div className='relative select-none bg-empty text-center'>
			<Image src={bgEmpty} alt='No game image' />
		</div>
	);
};

export default Gallery;
