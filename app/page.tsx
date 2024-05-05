'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CategoryCard from './components/categoryCard/CategoryCard'
import DeliveryTimeBtn from './components/deliveryTimeBtn/DeliveryTimeBtn'
import logoDark from '@/public/logo-dark.png'
import RestaurantCard from './components/restaurantCard/RestaurantCard'

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
		<main className={styles.main}>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
			<Image src={logoDark} className={styles.logo} alt='Logotype' />
			<section className={styles.deliveryTimeContainer}>
				<h2 className={styles.subtitle}>Delivery Time</h2>
				<div className={styles.timeRangeCards}>
					{timeRanges.map((range, index) => (
						<DeliveryTimeBtn
							key={index}
							onClick={() => filterByDeliveryTime(range.minTime, range.maxTime, index)}
							isActive={activeTimeRange === index}
							range={range}
						/>
					))}
				</div>

				<div>
					{deliveryRange.map((restaurant, i) => (
						<div key={i}>{restaurant}</div>
					))}
				</div>
			</section>
			<section className={styles.filterContainer}>
				{filters.map((filter: Filter) => (
					<CategoryCard key={filter.id} onClick={() => toggleFilter(filter.id)} isActive={activeFilters.includes(filter.id)} filter={filter} />
				))}
			</section>
			<section className={styles.restaurantsContainer}>
				<h1>Restaurants</h1>
				<div className={styles.restaurantCards}>
					{filteredRestaurants.length > 0 ? (
						<article>
							{filteredRestaurants.map((filteredRestaurant, i) => (
								/*<div key={i}>{filteredRestaurant.name}</div> */
								<RestaurantCard key={i} restaurant={filteredRestaurant}>
									{filteredRestaurant.name}
								</RestaurantCard>
							))}
						</article>
					) : (
						<article>
							{restaurants.map((restaurant, i) => (
								/*<RestaurantCard key={i} restaurant={restaurant} />*/
								<RestaurantCard key={i} restaurant={restaurant}>
									{restaurant.name}
								</RestaurantCard>
							))}
						</article>
					)}
				</div>
			</section>
		</main>
	)
}
