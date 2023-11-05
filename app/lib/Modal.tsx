interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center'>
			<div
				className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
				onClick={closeModal}
			/>
			<div className='w-4/5 h-4/5 p-4 bg-gray-700 border-4 border-green-700 rounded-lg z-10 overflow-scroll relative'>
				<span
					className='text-red-500 absolute top-0 right-4 text-2xl'
					onClick={closeModal}
				>
					X
				</span>
				<div>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
