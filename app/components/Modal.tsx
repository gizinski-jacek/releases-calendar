interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-10'>
			<div className='flex justify-center items-center w-[90%] h-[90%]'>
				<div
					className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
					onClick={closeModal}
				/>
				<div className='w-full max-h-full z-30 flex'>
					<div className='flex flex-col gap-1 bg-custom-secondary border-2 border-custom-secondary rounded-tl-lg rounded-bl-lg rounded-br-lg overflow-y-auto shadow-md shadow-custom-primary'>
						{children}
					</div>
					<div
						className='mb-auto transition-all z-20 cursor-pointer bg-custom-gray hover:bg-custom-primary px-1 border-2 border-l-0 border-custom-secondary rounded-tr-lg rounded-br-lg text-custom-red/75 hover:text-custom-red active:text-custom-red text-2xl shadow shadow-custom-gray-500 modal-close-btn'
						onClick={closeModal}
					/>
				</div>
			</div>
		</div>
	);
};

export default Modal;
