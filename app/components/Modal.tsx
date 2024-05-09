interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-[75]'>
			<div className='flex justify-center items-start w-[85%] h-[85%]'>
				<div
					className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
					onClick={closeModal}
				/>
				<div className='flex max-h-full z-30'>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
