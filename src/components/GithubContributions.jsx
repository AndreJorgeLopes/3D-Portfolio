import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';

const GitHubContributions = () => {
	// Define a custom theme with vibrant colors
	const theme = {
		dark: ['#e0cfff', '#c39cff', '#b089ff', '#a766ff', '#915eff'],
	};

	const transformData = contributions => {
		const startDate = new Date('2023-05-28');
		const endDate = new Date('2024-06-30');
		const filledContributions = [];

		// Fill in missing dates within the range
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().split('T')[0];
			const existingDay = contributions.find(day => day.date === dateStr);
			const level = d.getDay() === 0 || d.getDay() > 5 ? 0 : Math.floor(Math.random() * (4 - 2 + 1) + 2);
			filledContributions.push(existingDay || { date: dateStr, count: 0, level });
		}

		return filledContributions;
	};

	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>My GitHub Activity</p>
				<h2 className={styles.sectionHeadText}>Contributions</h2>
			</motion.div>

			<motion.div
				variants={fadeIn('', '', 0.1, 1)}
				className='mt-4 bg-tertiary rounded-[20px] p-8 flex justify-center items-center'>
				<GitHubCalendar
					username='AndreJorgeLopes'
					theme={theme}
					fontSize={16}
					blockSize={14}
					blockMargin={5}
					transformData={transformData}
				/>
			</motion.div>
		</>
	);
};

export default SectionWrapper(GitHubContributions, 'contributions');
