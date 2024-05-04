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
	filter_ids: number[]
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
	const [activeFilters, setActiveFilters] = useState<number[]>([])
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [filters, setFilters] = useState<any>([])

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

	const toggleFilter = (filter: number) => {
		let newActiveFilters = []
		if (activeFilters.includes(filter)) {
			newActiveFilters = activeFilters.filter((f) => f !== filter)
		} else {
			newActiveFilters = [...activeFilters, filter]
		}
		setActiveFilters(newActiveFilters)

		filterRestaurants(newActiveFilters)
	}

	const filterRestaurants = (activeCategories: number[]) => {
		const filtered = restaurants.filter((restaurant) => restaurant.filter_ids.some((fid) => activeCategories.includes(fid)))

		const uniqueFiltered = filtered.reduce<Restaurant[]>((acc, current) => {
			console.log('this is acc and then current', acc, current)
			const x = acc.find((element) => element.id === current.id)

			if (!x) {
				return acc.concat([current])
			} else {
				return acc
			}
		}, [])

		setFilteredRestaurants(uniqueFiltered)
	}

	return (
		<main className={`${styles.main} ${styles.onlyMobile}`}>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
			<div className={styles.btn_container}>
				{filters.map((filter) => {
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
