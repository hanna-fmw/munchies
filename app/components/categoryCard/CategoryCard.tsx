import React from 'react'
import styles from './CategoryCard.module.css'
import Image from 'next/image'

type CategoryCardProps = {
	filter: Filter
	onClick: () => void
	isActive: boolean
}

type Filter = {
	id: string
	name: string
	image_url: string
}

const CategoryCard = ({ filter, onClick, isActive }: CategoryCardProps) => {
	return (
		<article onClick={onClick} className={`${styles.categoryCard} ${isActive ? styles.activeFilter : ''}`}>
			<p className={styles.categoryName}>{filter.name}</p>
			<Image
				src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${filter.image_url}`}
				width={30}
				height={30}
				alt={filter.name}
				style={{ objectFit: 'cover' }}
			/>
		</article>
	)
}

export default CategoryCard