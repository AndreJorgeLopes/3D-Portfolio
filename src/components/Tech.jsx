import React from 'react';
import dynamic from 'next/dynamic';
import { SectionWrapper } from '../hoc';
import { technologies } from '../constants';

const TechBallsCanvas = dynamic(() => import('./canvas/TechBalls'), { ssr: false });

const Tech = () => {
	return <TechBallsCanvas technologies={technologies} />;
};

export default SectionWrapper(Tech, '');
