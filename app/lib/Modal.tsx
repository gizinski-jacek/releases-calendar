interface Props {
	children: React.ReactNode;
	closeModal: () => void;
	fullW?: boolean;
	fullH?: boolean;
	bgColor?: string;
	borderC?: string;
}

const Modal = ({
	children,
	closeModal,
	fullW = false,
	fullH = false,
	bgColor = 'bg-gray-800',
	borderC = 'border-purple-800',
}: Props) => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 z-10 flex justify-center items-center'>
			<div
				className={`flex justify-center items-center 
				${fullW ? 'w-full' : 'w-4/5'} ${fullH ? 'h-full' : 'h-4/5'}`}
			>
				<div
					className='absolute top-0 left-0 right-0 bottom-0 bg-black/75'
					onClick={closeModal}
				/>
				<div
					className={`w-full h-full border-2 rounded-tl-lg rounded-bl-lg rounded-br-lg overflow-scroll relative shadow-md shadow-gray-500 
					${bgColor} ${borderC}`}
				>
					<div className='flex flex-col gap-1'>{children}</div>
				</div>
				<div className='self-start w-0 z-10 mt-[4px] cursor-pointer'>
					<span
						className={`border-2 p-1 pb-1.5 border-l-0 rounded-tr-lg rounded-br-lg text-red-500 text-2xl shadow shadow-gray-500 modal-close-btn 
						${bgColor} ${borderC}`}
						onClick={closeModal}
					/>
				</div>
			</div>
		</div>
	);
};

export default Modal;
