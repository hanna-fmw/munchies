'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'

//1. Korv och Hamburgare ska visas på varsin knapp (hämta allt på /categories)
//2. Om någon trycker på "Hamburgare" som har id 4, så ska du leta i /restaurants efter alla
//restauranger vars category_ids innehåller 4

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

type DeliveryTime = {
	deliveryTimeFilers: number
}

// const restaurants = [
// 	{
// 		name: 'Hannas bodega',
// 		filter_ids: [1, 4],
// 		id: '111',
// 	},
// 	{
// 		name: 'Annikas hak',
// 		filter_ids: [4],
// 		id: '222',
// 	},
// 	{
// 		name: 'Måns Coffee Shop',
// 		filter_ids: [4, 1],
// 		id: '333',
// 	},
// ]

// const filters = [
// 	{
// 		name: 'Hamburgare',
// 		id: 4,
// 	},
// 	{
// 		name: 'Korv',
// 		id: 1,
// 	},
// 	{
// 		name: 'Pizza',
// 		id: 2,
// 	},
// 	{
// 		name: 'Taco',
// 		id: 3,
// 	},
// ]

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
	const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
	//Track active filters
	const [activeFilters, setActiveFilters] = useState<string[]>([])
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [filters, setFilters] = useState<any>([])
	const [deliveryRange, setDeliveryRange] = useState<string[]>([])
	//Track active delivery time range (to integrate it into the toggle function further down)
	// const [activeDeliveryRange, setActiveDeliveryRange] = useState({ minTime: 0, maxTime: Infinity })
	const [activeTimeRangeLabel, setActiveTimeRangeLabel] = useState<string>('')

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

	useEffect(() => {
		getAllRestaurants()
		getAllFilters()
	}, [])

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

	const filterByDeliveryTime = (minTime: number, maxTime: number = Infinity) => {
		const restaurantsFilteredByTimeRange = restaurants.reduce<string[]>((acc, restaurant) => {
			if (restaurant.delivery_time_minutes > minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)) {
				return [...acc, restaurant.name]
			}
			return acc
		}, [])

		setDeliveryRange(restaurantsFilteredByTimeRange)
		console.log('Updated deliveryRange', restaurantsFilteredByTimeRange)
	}
	// const filterByDeliveryTime = (minTime: number, maxTime: number, label: string) => {
	// 	const restaurantsFilteredByTimeRange = restaurants.filter(
	// 		(restaurant) => restaurant.delivery_time_minutes > minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)
	// 	)

	// 	setActiveTimeRangeLabel(label) // Update the active time range label
	// 	setFilteredRestaurants(restaurantsFilteredByTimeRange)
	// }

	return (
		<main className={`${styles.main} ${styles.onlyMobile}`}>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
			<section>
				<h2>Delivery Time</h2>
				<button onClick={() => filterByDeliveryTime(0, 10)} className={styles.delivery_time_btn}>
					0-10
				</button>
				<button onClick={() => filterByDeliveryTime(11, 30)} className={styles.delivery_time_btn}>
					10-30
				</button>
				<button onClick={() => filterByDeliveryTime(31, 60)} className={styles.delivery_time_btn}>
					30-60
				</button>
				<button onClick={() => filterByDeliveryTime(61)} className={styles.delivery_time_btn}>
					1 hour+
				</button>
				<div>
					{deliveryRange.map((restaurant, i) => (
						<div key={i}>{restaurant}</div>
					))}
				</div>
			</section>
			{/* <section>
				<h2>Delivery Time</h2>
				<button
					onClick={() => filterByDeliveryTime(0, 10, '0-10')}
					className={`${styles.delivery_time_btn} ${activeTimeRangeLabel === '0-10' ? styles.active : ''}`}>
					0-10
				</button>
				<button
					onClick={() => filterByDeliveryTime(11, 30, '10-30')}
					className={`${styles.delivery_time_btn} ${activeTimeRangeLabel === '10-30' ? styles.active : ''}`}>
					10-30
				</button>
				<button
					onClick={() => filterByDeliveryTime(31, 60, '30-60')}
					className={`${styles.delivery_time_btn} ${activeTimeRangeLabel === '30-60' ? styles.active : ''}`}>
					30-60
				</button>
				<button
					onClick={() => filterByDeliveryTime(61, Infinity, '1 hour+')}
					className={`${styles.delivery_time_btn} ${activeTimeRangeLabel === '1 hour+' ? styles.active : ''}`}>
					1 hour+
				</button>
			</section> */}
			<div className={styles.btn_container}>
				{filters.map((filter: Filter) => {
					return (
						<button
							key={filter.id}
							className={`${styles.btn} ${activeFilters.includes(filter.id) ? styles.active_filter : ''}`}
							onClick={() => toggleFilter(filter.id)}>
							{filter.name}
						</button>
					)
				})}
			</div>
			{filteredRestaurants.length > 0 ? (
				<div>
					{filteredRestaurants.map((filteredRestaurant, i) => {
						return <div key={i}>{filteredRestaurant.name}</div>
					})}
				</div>
			) : (
				<div>
					{restaurants.map((restaurant, i) => {
						return <div key={i}>{restaurant.name}</div>
					})}
				</div>
			)}
		</main>
	)
}
