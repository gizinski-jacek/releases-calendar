interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10'>
			<div className='flex justify-center items-center w-4/5 h-4/5'>
				<div
					className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
					onClick={closeModal}
				/>
				<div className='w-full h-full z-30 border-2 rounded-tl-lg rounded-bl-lg rounded-br-lg overflow-scroll shadow-md shadow-gray-500 bg-gray-800 border-purple-800'>
					<div className='flex flex-col gap-1'>{children}</div>
				</div>
				<div className='self-start w-0 z-20 mt-[4px] cursor-pointer'>
					<span
						className='border-2 p-1 pb-1.5 border-l-0 rounded-tr-lg rounded-br-lg text-red-500 text-2xl shadow shadow-gray-500 modal-close-btn bg-gray-800 border-purple-800'
						onClick={closeModal}
					/>
				</div>
			</div>
		</div>
	);
};

export default Modal;
