'use client'
import styles from './home.module.css'
import Modal from './components/modal/Modal'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CategoryCard from './components/categoryCard/CategoryCard'
import DeliveryTimeBadge from './components/deliveryTimeBtn/DeliveryTimeBadge'
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
	restaurant_id: string
	is_open: boolean
}

type PriceTiers = {
	[key: string]: string
}

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
	const [restaurants, setRestaurants] = useState<Restaurant[]>([])
	const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
	const [filters, setFilters] = useState<any>([])
	const [activeFilters, setActiveFilters] = useState<string[]>([])

	const [deliveryTimeRange, setDeliveryTimeRange] = useState<string[]>([])
	const [activeTimeRange, setActiveTimeRange] = useState<number | null>(null)

	const [priceTiers, setPriceTiers] = useState<PriceTiers>({})
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
		try {
			const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/restaurants')

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}

			const data = await res.json()
			if (data.restaurants.length > 0) {
				const priceTierPromises = data.restaurants.map((restaurant: Restaurant) =>
					fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/price-range/${restaurant.price_range_id}`).then((res) => {
						if (!res.ok) throw new Error(`Failed to fetch price tier for restaurant ID ${restaurant.id}`)
						return res.json()
					})
				)

				const openingHoursPromises = data.restaurants.map((restaurant: Restaurant) =>
					fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/open/${restaurant.id}`).then((res) => {
						if (!res.ok) throw new Error(`Failed to fetch opening hours for restaurant ID ${restaurant.id}`)
						return res.json()
					})
				)

				const [priceTiers, openingHours] = await Promise.all([Promise.all(priceTierPromises), Promise.all(openingHoursPromises)])

				const priceTierMapping = priceTiers.reduce(
					(acc, pt) => ({
						...acc,
						[pt.id]: pt.range,
					}),
					{}
				)

				const openingHoursMapping = openingHours.map((hours) => ({
					restaurant_id: hours.restaurant_id,
					is_open: hours.is_open,
				}))

				setPriceTiers(priceTierMapping)
				setRestaurants(data.restaurants)
				setOpeningHours(openingHoursMapping)
			}
		} catch (error) {
			console.error('Failed to fetch data for restaurants:', error)
		}
	}

	const getAllFilters = async () => {
		try {
			const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/filter')

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}

			const data = await res.json()
			setFilters(data.filters)
		} catch (error) {
			console.error('Failed to fetch categories:', error)
		}
	}

	const applyFilters = (priceTier = activePriceTier, categoryFilters = activeFilters, timeRange = activeTimeRange) => {
		let result = restaurants

		if (categoryFilters.length > 0) {
			result = result.filter((restaurant) => restaurant.filter_ids.some((fid) => categoryFilters.includes(fid)))
		}

		if (priceTier) {
			result = result.filter((restaurant) => restaurant.price_range_id === priceTier)
		}

		if (timeRange !== null) {
			const { minTime, maxTime } = timeRanges[timeRange]
			result = result.filter((restaurant) => {
				return restaurant.delivery_time_minutes >= minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)
			})
		}

		setFilteredRestaurants(result)
	}

	const toggleFilter = (filter: string) => {
		setActiveFilters((prevFilters) => {
			const newActiveFilters = prevFilters.includes(filter) ? prevFilters.filter((f) => f !== filter) : [...prevFilters, filter]
			applyFilters(activePriceTier, newActiveFilters, activeTimeRange)
			return newActiveFilters
		})
	}

	const togglePriceTier = (tierSymbol: string) => {
		const tierId = Object.keys(priceTiers).find((key) => priceTiers[key] === tierSymbol)

		setActivePriceTier((prevTier) => {
			const newTier = prevTier === tierId ? null : tierId
			if (newTier !== undefined) {
				applyFilters(newTier, activeFilters, activeTimeRange)
				return newTier
			}
			return prevTier
		})
	}

	const filterByTimeRange = (minTime: number, maxTime: number, index: number) => {
		setActiveTimeRange((prevRange) => {
			const newRange = prevRange === index ? null : index
			applyFilters(activePriceTier, activeFilters, newRange)
			return newRange
		})
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
				<div className={styles.mobileContainers}>
					<section className={`${styles.timeRangeContainer} ${styles.timeRanges}`}>
						<h2 className={styles.subtitle}>Delivery Time</h2>
						<div className={styles.timeRangeCards}>
							{timeRanges.map((timeRange, index) => (
								<DeliveryTimeBadge
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
									<DeliveryTimeBadge
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
								{filteredRestaurants.map((filteredRestaurant, i) => {
									const foundItem = openingHours.find((item) => item.restaurant_id === filteredRestaurant.id)
									const isOpen = foundItem ? foundItem.is_open : false // Safely check if the foundItem exists and its open status
									const cardClass = isOpen ? styles.restaurantCard : `${styles.restaurantCard} ${styles.restaurantCardClosed}`

									return (
										<RestaurantCard key={i} className={cardClass} restaurant={filteredRestaurant}>
											{foundItem ? (
												<>
													<Badge isOpen={foundItem.is_open} label={foundItem.is_open ? 'Open' : 'Closed'} />
												</>
											) : (
												<p>{filteredRestaurant.name}</p>
											)}

											{(() => {
												const priceTierLabel = priceTiers[filteredRestaurant.price_range_id]
												return priceTierLabel ? (
													<>
														<Badge label={priceTierLabel} />
													</>
												) : (
													<p>{filteredRestaurant.name}</p>
												)
											})()}
										</RestaurantCard>
									)
								})}
							</article>
						) : (
							<article className={styles.restaurantCardContainer}>
								{restaurants.map((restaurant, i) => {
									const foundItem = openingHours.find((item) => item.restaurant_id === restaurant.id)
									const isOpen = foundItem ? foundItem.is_open : false
									const cardClass = isOpen ? '' : styles.restaurantCardClosed

									return (
										<RestaurantCard key={i} restaurant={restaurant} className={cardClass}>
											{foundItem ? (
												<>
													<Badge isOpen={foundItem.is_open} label={foundItem.is_open ? 'Open' : 'Closed'} />
												</>
											) : (
												<p>{restaurant.name}</p>
											)}

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
									)
								})}
							</article>
						)}
					</section>
				</section>
			</main>
		</>
	)
}
