import style from '../styles/LoadingSpinner.module.scss';

const LoadingSpinner = () => {
	return (
		<div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[75]'>
			<div className='absolute top-0 left-0 right-0 bottom-0 bg-black/50' />
			<div className={style.spinner}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
