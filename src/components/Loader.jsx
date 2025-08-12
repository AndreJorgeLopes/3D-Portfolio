import { Html, useProgress } from '@react-three/drei';
import Image from 'next/image';

const Loader = () => {
	const { progress } = useProgress();
	const LoadingCat = () => (
		<Image
			src='https://media.tenor.com/X5ATMhUr7PgAAAAj/blu-zushi-cat.gif'
			alt='loading'
			width={150}
			height={150}
			unoptimized
		/>
	);
	return (
		<Html className='canvas-load flex justify-center items-center'>
			<LoadingCat />
			<p
				style={{
					fontSize: 14,
					color: '#f1f1f1',
					fontWeight: 800,
				}}>
				{progress.toFixed(2)}%
			</p>
			<LoadingCat />
		</Html>
	);
};

export default Loader;
