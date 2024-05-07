//@ts-nocheck
'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CategoryCard from './components/categoryCard/CategoryCard'
import DeliveryTimeBtn from './components/deliveryTimeBtn/DeliveryTimeBtn'
import logoDark from '@/public/logo-dark.png'
import RestaurantCard from './components/restaurantCard/RestaurantCard'
import PriceRange from './components/priceRange/PriceRange'
import Badge from './components/badge/Badge'

type Restaurant = {
	id: string
	name: string
	filter_ids: string[]
	image_url?: string
	delivery_time_minutes: number
	price_range_id: string
}

type Filter = {
	id: string
	name: string
	image_url: string
}

type Hours = {
	hours: {
		restaurant_id: string
		is_open: boolean
	}
}

type PriceTier = {
	priceTier: {
		id: string
		tier: string
	}
}

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
	const [filters, setFilters] = useState<any>([])
	const [activeFilters, setActiveFilters] = useState<string[]>([])

	const [deliveryTimeRange, setDeliveryTimeRange] = useState<string[]>([])
	const [activeTimeRange, setActiveTimeRange] = useState<number | null>(null)

	const [priceTiers, setPriceTiers] = useState<PriceTier[]>([])
	const [activePriceTier, setActivePriceTier] = useState<string | null>(null)

	const [openingHours, setOpeningHours] = useState<Hours[]>([])

	const timeRanges = [
		{ minTime: 0, maxTime: 10, label: '0-10 min' },
		{ minTime: 11, maxTime: 30, label: '10-30 min' },
		{ minTime: 31, maxTime: 60, label: '30-60 min' },
		{ minTime: 61, maxTime: Infinity, label: '1 hour+' },
	]

	useEffect(() => {
		setActiveFilters([])
		setActiveTimeRange(null)
		setActivePriceTier(null)
		getAllRestaurants()
		getAllFilters()
	}, [])

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Logging activePriceTier', activePriceTier)
			console.log('Logging priceTiers', priceTiers)
		}
	}, [activePriceTier, priceTiers])

	const getAllRestaurants = async () => {
		const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/restaurants')
		const data = await res.json()
		if (data.restaurants.length > 0) {
			const priceTierPromises = data.restaurants.map((restaurant) =>
				fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/price-range/${restaurant.price_range_id}`).then((res) => res.json())
			)

			const openingHoursPromises = data.restaurants.map((restaurant) =>
				fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/open/${restaurant.id}`).then((res) => res.json())
			)

			// Execute promises simultaneously
			const [priceTiers, openingHours] = await Promise.all([Promise.all(priceTierPromises), Promise.all(openingHoursPromises)])

			// Map price tier ID to tier symbol (dollar sign)
			const priceTierMapping = priceTiers.reduce(
				(acc, pt) => ({
					...acc,
					[pt.id]: pt.range,
				}),
				{}
			)

			// Store opening hours in an object
			const openingHoursMapping = openingHours.map((hours) => ({
				restaurant_id: hours.restaurant_id,
				is_open: hours.is_open,
			}))

			// Update states with fetched data
			setPriceTiers(priceTierMapping)
			setRestaurants(data.restaurants)
			setOpeningHours(openingHoursMapping)
		}
	}

	const getAllFilters = async () => {
		const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/filter')
		const data = await res.json()
		setFilters(data.filters)
	}

	// Integrate all filters
	const applyFilters = (priceTier = activePriceTier, categoryFilters = activeFilters, timeRange = activeTimeRange) => {
		let result = restaurants

		// Filter by category if there are active category filters
		if (categoryFilters.length > 0) {
			result = result.filter((restaurant) => restaurant.filter_ids.some((fid) => categoryFilters.includes(fid)))
		}

		// Filter by price range if selected
		if (priceTier) {
			result = result.filter((restaurant) => restaurant.price_range_id === priceTier)
		}

		// Filter by delivery time if selected
		if (timeRange !== null) {
			const { minTime, maxTime } = timeRanges[timeRange]
			result = result.filter((restaurant) => {
				return restaurant.delivery_time_minutes >= minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)
			})
		}

		setFilteredRestaurants(result)
	}

	// Use the applyFilters function in the toggle functions
	const toggleFilter = (filter: string) => {
		setActiveFilters((prevFilters) => {
			const newActiveFilters = prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
			applyFilters(activePriceTier, newActiveFilters, activeTimeRange) // Use new state directly
			return newActiveFilters
		})
	}

	const togglePriceTier = (tierSymbol: string) => {
		const tierId = Object.keys(priceTiers).find((key) => priceTiers[key] === tierSymbol)
		setActivePriceTier((prevTier) => {
			const newTier = prevTier === tierId ? null : tierId
			applyFilters(newTier, activeFilters, activeTimeRange) // Pass new state directly
			return newTier
		})
	}

	const filterByTimeRange = (minTime: number, maxTime: number, index: number) => {
		setActiveTimeRange((prevRange) => {
			const newRange = prevRange === index ? null : index
			applyFilters(activePriceTier, activeFilters, newRange) // Use new state directly
			return newRange
		})
	}

	//Avoid scrolling on mobile view landing page
	// useEffect(() => {
	// 	document.body.style.overflowY = isModalOpen ? 'hidden' : 'auto'

	// 	return () => {
	// 		document.body.style.overflowY = 'auto'
	// 		document.documentElement.style.overflowY = 'auto'
	// 	}
	// }, [isModalOpen])
	//Nåt som att om modal är öppen så får sidan bara vara 100vh hög?

	return (
		<>
			{isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
			<main className={styles.main}>
				<Image src={logoDark} className={styles.logo} alt='Logotype' />
				<div className={styles.mobileContainers}>
					<section className={`${styles.timeRangeContainer} ${styles.timeRanges}`}>
						<h2 className={styles.subtitle}>Delivery Time</h2>
						<div className={styles.timeRangeCards}>
							{timeRanges.map((timeRange, index) => (
								<DeliveryTimeBtn
									key={index}
									onClick={() => filterByTimeRange(timeRange.minTime, timeRange.maxTime, index)}
									isActive={activeTimeRange === index}
									timeRange={timeRange}
								/>
							))}
						</div>
						<div>
							{deliveryTimeRange.map((restaurant, i) => (
								<div key={i}>{restaurant}</div>
							))}
						</div>
					</section>

					<section className={styles.priceRangeContainer}>
						<h2 className={styles.subtitle}>Price Range</h2>
						<div className={styles.priceRangeCards}>
							{['$', '$$', '$$$', '$$$$'].map((tierSymbol, i) => (
								<PriceRange
									key={i}
									priceTier={tierSymbol}
									isActive={activePriceTier === Object.keys(priceTiers).find((key) => priceTiers[key] === tierSymbol)}
									onClick={() => togglePriceTier(tierSymbol)}
								/>
							))}
						</div>
					</section>
				</div>
				<section className={styles.layoutGrid}>
					<aside className={styles.sidePanel}>
						<section className={`${styles.foodCategory} ${styles.filterCardContainerSidePanel}`}>
							<h1>Filter</h1>
							<h2 className={styles.subtitle}>Food Category</h2>
							{/* <section className={`${styles.filterCardContainer} ${styles.filterCardContainerSidePanel}`}> */}
							<section className={styles.categoryCardContainer}>
								{filters.map((filter: Filter) => (
									<CategoryCard
										key={filter.id}
										onClick={() => toggleFilter(filter.id)}
										isActive={activeFilters.includes(filter.id)}
										filter={filter}
									/>
								))}
							</section>
						</section>

						<section className={`${styles.timeRangeContainer} ${styles.timeRanges}`}>
							<h2 className={styles.subtitle}>Delivery Time</h2>
							<div className={styles.timeRangeCards}>
								{timeRanges.map((timeRange, index) => (
									<DeliveryTimeBtn
										key={index}
										onClick={() => filterByTimeRange(timeRange.minTime, timeRange.maxTime, index)}
										isActive={activeTimeRange === index}
										timeRange={timeRange}
									/>
								))}
							</div>
						</section>
						<section className={styles.priceRangeContainer}>
							<h2 className={styles.subtitle}>Price Range</h2>
							<div className={styles.priceRangeCards}>
								{['$', '$$', '$$$', '$$$$'].map((tierSymbol, i) => (
									<PriceRange
										key={i}
										priceTier={tierSymbol}
										isActive={activePriceTier === Object.keys(priceTiers).find((key) => priceTiers[key] === tierSymbol)}
										onClick={() => togglePriceTier(tierSymbol)}
									/>
								))}
							</div>
						</section>
					</aside>
					<section className={styles.filterCardContainer}>
						{filters.map((filter: Filter) => (
							<CategoryCard
								src={`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/${filter.image_url}`}
								key={filter.id}
								onClick={() => toggleFilter(filter.id)}
								isActive={activeFilters.includes(filter.id)}
								filter={filter}
							/>
						))}
					</section>
					<section>
						<h1 className={`${styles.display} ${styles.h2}`}>Restaurants</h1>
						{filteredRestaurants.length > 0 ? (
							<article className={styles.restaurantCardContainer}>
								{filteredRestaurants.map((filteredRestaurant, i) => (
									<RestaurantCard key={i} restaurant={filteredRestaurant}>
										{/* Display Open/Closed on restaurant card in filtered restaurants view */}
										{(() => {
											const foundItem = openingHours.find((item) => item.restaurant_id === filteredRestaurant.id)
											return foundItem ? (
												<>
													<Badge isOpen={foundItem.is_open} label={foundItem.is_open ? 'Open' : 'Closed'} />
												</>
											) : (
												<p>{filteredRestaurant.name}</p>
											)
										})()}
										{/* Display price range on restaurant card in filtered restaurants view */}
										{(() => {
											const priceTierLabel = priceTiers[filteredRestaurant.price_range_id] // Adjusted for direct map access
											return priceTierLabel ? (
												<>
													<Badge label={priceTierLabel} />
												</>
											) : (
												<p>{filteredRestaurant.name}</p>
											)
										})()}
									</RestaurantCard>
								))}
							</article>
						) : (
							<article className={styles.restaurantCardContainer}>
								{restaurants.map((restaurant, i) => (
									<RestaurantCard key={i} restaurant={restaurant}>
										{/* Display Open/Closed on restaurant card */}
										{(() => {
											const foundItem = openingHours.find((item) => item.restaurant_id === restaurant.id)
											return foundItem ? (
												<>
													<Badge isOpen={foundItem.is_open} label={foundItem.is_open ? 'Open' : 'Closed'} />
												</>
											) : (
												<p>{restaurant.name}</p>
											)
										})()}

										{/* Display price range on restaurant card */}
										{(() => {
											const priceTierLabel = priceTiers[restaurant.price_range_id]
											return priceTierLabel ? (
												<>
													<Badge label={priceTierLabel} />
												</>
											) : (
												<p>{restaurant.name}</p>
											)
										})()}
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
