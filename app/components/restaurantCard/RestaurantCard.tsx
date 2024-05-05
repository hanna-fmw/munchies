import React from 'react'
import styles from './RestaurantCard.module.css'
import Image from 'next/image'

type RestaurantCardProps = {
	restaurant: {
		name: string
	}
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
	return (
		<article className={styles.restaurantCard}>
			<div>{restaurant.name}</div>
			<Image
				src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${restaurant.image_url}`}
				width={50}
				height={50}
				alt={restaurant.name}
				style={{ objectFit: 'contain' }}
			/>
		</article>
	)
}

export default RestaurantCard
