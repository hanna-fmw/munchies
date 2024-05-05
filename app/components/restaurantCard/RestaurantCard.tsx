import React from 'react'
import styles from './RestaurantCard.module.css'
import Image from 'next/image'

type RestaurantCardProps = {
	restaurant: {
		name: string
		image_url?: string
		delivery_time_minutes: number
	}
	children: React.ReactNode
}

// const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
const RestaurantCard = ({ restaurant, children }: RestaurantCardProps) => {
	return (
		<section className={styles.restaurantCard}>
			<aside className={styles.leftSide}>
				<div className={styles.deliveryTimeBtn}>{restaurant.delivery_time_minutes} min</div>
				<Image
					src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${restaurant.image_url}`}
					width={80}
					height={80}
					alt={restaurant.name}
					className={styles.restaurantIcon}
				/>
			</aside>
			<aside className={styles.rightSide}>
				<h1 className={styles.restaurantName}>{children}</h1>
				<Image src='/CTA.png' width={30} height={30} alt={`CTA for ${restaurant.name}`} className={styles.restaurantArrow} />
			</aside>
		</section>
	)
}

export default RestaurantCard
