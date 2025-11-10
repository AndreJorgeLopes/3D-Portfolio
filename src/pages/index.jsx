import dynamic from 'next/dynamic';
import { About, Contact, Experience, Hero, Navbar, Tech, Works, GithubContributions } from '../components';

// Dynamically import 3D components with SSR disabled
const StarsCanvas = dynamic(() => import('../components/canvas/Stars'), { ssr: false });

const Home = () => {
	return (
		<div className='relative bg-primary z-0'>
			<div className='bg-hero-pattern bg-no-repeat bg-center bg-cover relative min-h-screen'>
				{/* Stars background layer - lowest z-index, transparent background */}
				<div className='absolute inset-0 z-0'>
					<StarsCanvas />
				</div>
				{/* Navigation and content - higher z-index */}
				<div className='relative z-10'>
					<Navbar />
					<Hero />
				</div>
			</div>
			<div className='relative'>
				{/* Bottom stars as background layer - lowest z-index */}
				<div className='absolute inset-0 z-0'>
					<StarsCanvas variant='bottom' />
				</div>
				<div className='relative z-10'>
					<About />
					<Experience />
					<Tech />
					<Works />
					<GithubContributions />
					<div className='relative z-0'>
						<Contact />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
