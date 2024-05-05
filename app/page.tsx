'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CategoryCard from './components/categoryCard/CategoryCard'
import DeliveryTimeBtn from './components/deliveryTimeBtn/DeliveryTimeBtn'
import logoDark from '@/public/logo-dark.png'
import RestaurantCard from './components/restaurantCard/RestaurantCard'
import SidePanel from './components/sidePanel/SidePanel'
import PriceRange from './components/priceRange/PriceRange'

type Restaurant = {
	id: string
	name: string
	filter_ids: string[]
	image_url?: string
	delivery_time_minutes: number
	price_range_id?: string
}

type Filter = {
	id: string
	name: string
	image_url: string
}

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
	const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [filters, setFilters] = useState<any>([])
	const [deliveryRange, setDeliveryRange] = useState<string[]>([])
	const [activeTimeRange, setActiveTimeRange] = useState<number | null>(null) // State to track the active time range button

	const timeRanges = [
		{ minTime: 0, maxTime: 10, label: '0-10 min' },
		{ minTime: 11, maxTime: 30, label: '10-30 min' },
		{ minTime: 31, maxTime: 60, label: '30-60 min' },
		{ minTime: 61, maxTime: Infinity, label: '1 hour+' },
	]

	const priceRanges = ['$', '$$', '$$$', '$$$$']

	useEffect(() => {
		setActiveFilters([])
		setActiveTimeRange(null)
		getAllRestaurants()
		getAllFilters()
	}, [])

	const getAllRestaurants = async () => {
		const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/restaurants')
		const data = await res.json()
		setRestaurants(data.restaurants)
	}

	const getAllFilters = async () => {
		const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/filter')
		const data = await res.json()
		setFilters(data.filters)
	}

	const toggleFilter = (filter: string) => {
		let newActiveFilters = []
		if (activeFilters.includes(filter)) {
			newActiveFilters = activeFilters.filter((f) => f !== filter)
		} else {
			newActiveFilters = [...activeFilters, filter]
		}
		setActiveFilters(newActiveFilters)
		filterRestaurants(newActiveFilters)
	}

	const filterRestaurants = (activeCategories: string[]) => {
		const filtered = restaurants.filter((restaurant) => restaurant.filter_ids.some((fid) => activeCategories.includes(fid)))

		const uniqueFiltered = filtered.reduce<Restaurant[]>((acc, current) => {
			const x = acc.find((element) => element.id === current.id)
			if (!x) {
				return acc.concat([current])
			} else {
				return acc
			}
		}, [])

		setFilteredRestaurants(uniqueFiltered)
	}

	const filterByDeliveryTime = (minTime: number, maxTime: number, index: number) => {
		if (activeTimeRange === index) {
			setActiveTimeRange(null)
			setDeliveryRange([])
		} else {
			const restaurantsFilteredByTimeRange = restaurants.reduce<string[]>((acc, restaurant) => {
				if (restaurant.delivery_time_minutes >= minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)) {
					return [...acc, restaurant.name]
				}
				return acc
			}, [])

			setDeliveryRange(restaurantsFilteredByTimeRange)
			setActiveTimeRange(index)
			console.log('Updated deliveryRange', restaurantsFilteredByTimeRange)
		}
	}

	useEffect(() => {
		document.body.style.overflowY = isModalOpen ? 'hidden' : 'auto'

		return () => {
			document.body.style.overflowY = 'auto'
			document.documentElement.style.overflowY = 'auto'
		}
	}, [isModalOpen])

	return (
		<>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
			<main className={styles.main}>
				<Image src={logoDark} className={styles.logo} alt='Logotype' />
				<section className={styles.layoutGrid}>
					<aside className={styles.sidePanel}>
						<section className={styles.foodCategory}>
							<h1>Filter</h1>
							<h2 className={styles.subtitle}>Food Category</h2>

							<section className={`${styles.filterCardContainer} ${styles.filterCardContainerSidePanel}`}>
								{filters.map((filter: Filter) => (
									<article
										key={filter.id}
										onClick={() => toggleFilter(filter.id)}
										className={`${styles.categoryCard} ${activeFilters.includes(filter.id) ? styles.active : ''}`}>
										<p className={styles.categoryName}>{filter.name}</p>
									</article>
								))}
							</section>
						</section>

						<section className={styles.deliveryTimeContainer}>
							<h2 className={styles.subtitle}>Delivery Time</h2>
							<div className={styles.timeRangeCards}>
								{timeRanges.map((timeRange, index) => (
									<DeliveryTimeBtn
										key={index}
										onClick={() => filterByDeliveryTime(timeRange.minTime, timeRange.maxTime, index)}
										isActive={activeTimeRange === index}
										timeRange={timeRange}
									/>
								))}
							</div>
						</section>
						<section className={styles.priceRangeContainer}>
							<h2 className={styles.subtitle}>Price Range</h2>
							<div className={styles.priceRangeCards}>
								{priceRanges.map((priceRange, i) => (
									<PriceRange priceRange={priceRange} key={i} />
								))}
							</div>

							{/* <div>
							{deliveryRange.map((restaurant, i) => (
								<div key={i}>{restaurant}</div>
							))}
						</div> */}
						</section>
					</aside>
					<section className={styles.filterCardContainer}>
						{filters.map((filter: Filter) => (
							<CategoryCard key={filter.id} onClick={() => toggleFilter(filter.id)} isActive={activeFilters.includes(filter.id)} filter={filter} />
						))}
					</section>
					<section>
						<h1>Restaurants</h1>
						{filteredRestaurants.length > 0 ? (
							<article className={styles.restaurantCardContainer}>
								{filteredRestaurants.map((filteredRestaurant, i) => (
									/*<div key={i}>{filteredRestaurant.name}</div> */
									<RestaurantCard key={i} restaurant={filteredRestaurant}>
										{filteredRestaurant.name}
									</RestaurantCard>
								))}
							</article>
						) : (
							<article className={styles.restaurantCardContainer}>
								{restaurants.map((restaurant, i) => (
									/*<RestaurantCard key={i} restaurant={restaurant} />*/
									<RestaurantCard key={i} restaurant={restaurant}>
										{restaurant.name}
									</RestaurantCard>
								))}
							</article>
						)}
					</section>
				</section>
			</main>
		</>
	)
}
