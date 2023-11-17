interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10'>
			<div className='flex justify-center items-center w-[90%] h-[90%]'>
				<div
					className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
					onClick={closeModal}
				/>
				<div className='w-full h-full z-30 border-2 border-secondary rounded-tl-lg rounded-bl-lg rounded-br-lg overflow-auto shadow-md shadow-primary bg-primary'>
					<div className='flex flex-col gap-1 bg-secondary'>{children}</div>
				</div>
				<div className='self-start w-0 z-20 cursor-pointer transition-all'>
					<span
						className='pt-0 p-1 border-2 border-l-0 border-secondary rounded-tr-lg rounded-br-lg text-red-500 text-2xl shadow shadow-gray-500 modal-close-btn'
						onClick={closeModal}
					/>
				</div>
			</div>
		</div>
	);
};

export default Modal;
