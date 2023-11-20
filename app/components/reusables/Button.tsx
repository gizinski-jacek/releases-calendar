interface Props {
	data: any;
	styleClass?: string;
	styleInline?: { [key: string]: string };
	cta: () => any;
}

const Button = ({
	data,
	styleClass = '',
	styleInline = undefined,
	cta,
}: Props) => {
	return (
		<div
			className={`col-span-4 transition-all uppercase text-sm lg:text-base text-center font-semibold text-custom-secondary border-2 border-custom-secondary/80 hover:border-custom-secondary/90 active:border-custom-secondary bg-custom-blue/75 hover:bg-custom-blue/90 active:bg-custom-blue hover:shadow active:shadow-md shadow-custom-secondary/75 hover:shadow-custom-secondary/90 active:shadow-custom-secondary/90 rounded cursor-pointer select-none ${styleClass}`}
			style={styleInline}
			onClick={cta}
		>
			{data}
		</div>
	);
};

export default Button;