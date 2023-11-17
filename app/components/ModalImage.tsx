interface Props {
	children: React.ReactNode;
	closeModal: () => void;
}

const ModalImage = ({ children, closeModal }: Props) => {
	return (
		<div
			className='w-screen h-screen absolute top-0 left-0 z-50'
			onClick={closeModal}
		>
			<div className='absolute top-0 left-0 right-0 bottom-0 bg-black/75' />
			<div className='absolute top-[50%] translate-y-[-50%] left-0 relative z-20'>
				{children}
			</div>
		</div>
	);
};

export default ModalImage;
