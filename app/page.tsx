'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CategoryCard from './components/categoryCard/CategoryCard'

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

	const filterByDeliveryTime = (minTime: number, maxTime: number = Infinity, index: number) => {
		const restaurantsFilteredByTimeRange = restaurants.reduce<string[]>((acc, restaurant) => {
			if (restaurant.delivery_time_minutes > minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)) {
				return [...acc, restaurant.name]
			}
			return acc
		}, [])

		setDeliveryRange(restaurantsFilteredByTimeRange)
		setActiveTimeRange(index) // Update the active time range index
		console.log('Updated deliveryRange', restaurantsFilteredByTimeRange)
	}

	useEffect(() => {
		document.body.style.overflowY = isModalOpen ? 'hidden' : 'auto'

		return () => {
			document.body.style.overflowY = 'auto'
			document.documentElement.style.overflowY = 'auto'
		}
	}, [isModalOpen])

	return (
		<main>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}

			<section>
				<h2>Delivery Time</h2>
				{['0-10', '10-30', '30-60', '1 hour+'].map((range, index) => (
					<button
						key={index}
						onClick={() => filterByDeliveryTime(index * 10 + 1, (index + 1) * 10, index)}
						className={`${styles.deliveryTimeBtn} ${activeTimeRange === index ? styles.active : ''}`}>
						{range}
					</button>
				))}
				<div>
					{deliveryRange.map((restaurant, i) => (
						<div key={i}>{restaurant}</div>
					))}
				</div>
			</section>
			<section className={styles.filterContainer}>
				{filters.map((filter: Filter) => (
					<article
						key={filter.id}
						onClick={() => toggleFilter(filter.id)}
						className={`${styles.categoryCard} ${activeFilters.includes(filter.id) ? styles.activeFilter : ''}`}>
						<div>{filter.name}</div>
						<Image
									src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${filter.image_url}`}
									width={50}
									height={50}
									alt={filter.name}
								/>
					</article>
				))}
			</section>
			{filteredRestaurants.length > 0 ? (
				<article>
					{filteredRestaurants.map((filteredRestaurant, i) => (
						<div key={i}>{filteredRestaurant.name}</div>
					))}
				</article>
			) : (
				<article>
					{restaurants.map((restaurant, i) => (
						<div key={i}>{restaurant.name}</div>
					))}
				</article>
			)}
		</main>
	)
}
