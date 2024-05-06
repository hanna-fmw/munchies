import React from 'react'
import styles from './CategoryCard.module.css'
import Image from 'next/image'

type CategoryCardProps = {
	filter: Filter
	onClick: () => void
	isActive: boolean
	src?: string
}

type Filter = {
	id: string
	name: string
	image_url: string
}

const CategoryCard = ({ src, filter, onClick, isActive }: CategoryCardProps) => {
	return (
		<article onClick={onClick} className={`${styles.categoryCard} ${isActive ? styles.active : ''}`}>
			<p className={styles.categoryName}>{filter.name}</p>
			{src && (
				<Image
					src={src}
					// src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${filter.image_url}`}
					width={40}
					height={40}
					alt={filter.name}
					style={{ objectFit: 'contain' }}
				/>
			)}
		</article>
	)
}

export default CategoryCard
