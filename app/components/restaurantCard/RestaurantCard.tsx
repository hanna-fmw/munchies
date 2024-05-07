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

const RestaurantCard = ({ restaurant, children }: RestaurantCardProps) => {
	return (
		<section className={styles.restaurantCard}>
			<aside className={styles.topRow}>
				<div className={styles.deliveryTimeContainer}>
					<div className={styles.topRowBadges}>
						<div className={styles.deliveryTimeBadge}>{restaurant.delivery_time_minutes}&nbsp;min</div>
						{/* In this case children is the OpenHoursBadge */}
						{children}
					</div>
				</div>

				<Image
					src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${restaurant.image_url}`}
					width={50}
					height={50}
					alt={restaurant.name}
					className={styles.restaurantIcon}
				/>
			</aside>
			<aside className={styles.bottomRow}>
				<h1 className={styles.restaurantName}>{restaurant.name}</h1>
				<Image src='/CTA.png' width={25} height={25} alt={`CTA for ${restaurant.name}`} className={styles.restaurantArrow} />
			</aside>
		</section>
	)
}
export default RestaurantCard
