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

	// const priceRanges = ['$', '$$', '$$$', '$$$$']

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

			// This fetches opening hours for each restaurant simultaneously
			const openingHoursPromises = data.restaurants.map((restaurant) =>
				fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/open/${restaurant.id}`).then((res) => res.json())
			)

			const [priceTiers, openingHours] = await Promise.all([Promise.all(priceTierPromises), Promise.all(openingHoursPromises)])

			// Create a mapping from price tier ID to tier symbol
			const priceTierMapping = priceTiers.reduce(
				(acc, pt) => ({
					...acc,
					[pt.id]: pt.range,
				}),
				{}
			)

			// Store opening hours in a structured format
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

	// // Function to fetch opening hours and update the state
	// const getAllRestaurantsOpeningHours = async (restaurantId: string) => {
	// 	const res = await fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/open/${restaurantId}`)
	// 	const data = await res.json()

	// 	// console.log('opening hours', data)
	// 	//We put each "opening hours data" object (which consists
	// 	//of restaurant_id and is_open - as seen in swagger response) in an array:
	// 	//@ts-ignore
	// 	setOpeningHours((prevHours) => [...prevHours, { hours: { restaurant_id: data.restaurant_id, is_open: data.is_open } }])
	// }

	// // Function to fetch price ranges and update the state
	// const getAllRestaurantsPriceTiers = async (priceTierId: string) => {
	// 	const res = await fetch(`https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/price-range/${priceTierId}`)
	// 	const data = await res.json()

	// 	//We put each "price ranges data" object (which consists
	// 	//of id and range - as seen in swagger response) in an array:
	// 	//@ts-ignore
	// 	setPriceTiers((prevPriceTiers) => [...prevPriceTiers, { priceTier: { id: data.id, tier: data.range } }])
	// }
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
	const getAllFilters = async () => {
		const res = await fetch('https://work-test-web-2024-eze6j4scpq-lz.a.run.app/api/filter')
		const data = await res.json()
		setFilters(data.filters)
	}

	//////////////////////////////////////////////////////////
	//OPTION 1
	//DETTA AVSNITTET ÄR OPTION 1, LITE "SÄMRE", VARJE FILTER
	//ÄR MER SEPARAT TROR JAG
	//////////////////////////////////////////////////////////
	// const toggleFilter = (filter: string) => {
	// 	let newActiveFilters = []
	// 	if (activeFilters.includes(filter)) {
	// 		newActiveFilters = activeFilters.filter((f) => f !== filter)
	// 	} else {
	// 		newActiveFilters = [...activeFilters, filter]
	// 	}
	// 	setActiveFilters(newActiveFilters)
	// 	filterRestaurants(newActiveFilters)
	// }

	// const togglePriceTier = (tierSymbol: string) => {
	// 	//@ts-ignore
	// 	const tierId = Object.keys(priceTiers).find((key) => priceTiers[key] === tierSymbol)
	// 	//@ts-ignore
	// 	setActivePriceTier((prevTier) => (prevTier === tierId ? null : tierId))
	// 	//@ts-ignore
	// 	filterRestaurantsByPriceTier(tierId)
	// }

	// const filterByTimeRange = (minTime: number, maxTime: number, index: number) => {
	// 	if (activeTimeRange === index) {
	// 		// Deselecting the same time range will reset the filter
	// 		setActiveTimeRange(null)
	// 		setFilteredRestaurants(restaurants)
	// 	} else {
	// 		// Apply the time range filter
	// 		const filtered = restaurants.filter((restaurant) => {
	// 			return restaurant.delivery_time_minutes >= minTime && (maxTime === Infinity || restaurant.delivery_time_minutes <= maxTime)
	// 		})

	// 		setFilteredRestaurants(filtered)
	// 		setActiveTimeRange(index)
	// 	}
	// }

	// const filterRestaurantsByPriceTier = (tierId: string) => {
	// 	if (!tierId || tierId === activePriceTier) {
	// 		setFilteredRestaurants(restaurants) // Clear filter if same tier is clicked again
	// 	} else {
	// 		const filtered = restaurants.filter((restaurant) => restaurant.price_range_id === tierId)
	// 		setFilteredRestaurants(filtered)
	// 	}
	// }
	//////////////////////////////////////////////////////////
	//OPTION 1 SLUTAR HÄR (option 2 som är det aktiva och bättre
	//är det som är aktivt här nedan)
	//////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////
	//OPTION 2
	//DETTA OPTION BÄST, TAR MED ALLA FILTER, enligt chat-gpt:
	//This not only simplifies your codebase but also minimizes
	//the potential for bugs by reducing the redundancy of filter
	//application logic.  It is easier to maintain and
	//ensures that any future additions or modifications to
	//filtering criteria can be implemented more smoothly.
	//////////////////////////////////////////////////////////
	const applyFilters = (priceTier = activePriceTier, categoryFilters = activeFilters, timeRange = activeTimeRange) => {
		let result = restaurants

		// Filter by category if any active category filters
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

	// Use this function in your toggle functions
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
	//////////////////////////////////////////////////////////
	//HÄR SLUTAR OPTION 2
	//////////////////////////////////////////////////////////

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

					<div className={styles.priceRangeContainer}>
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
					</div>
				</div>
				<section className={styles.layoutGrid}>
					<aside className={styles.sidePanel}>
						<section className={styles.foodCategory}>
							<h1>Filter</h1>
							<h2 className={styles.subtitle}>Food Category</h2>
							<section className={`${styles.filterCardContainer} ${styles.filterCardContainerSidePanel}`}>
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
							{/* Detta är i desktop-vy, men jag gör allt med priceranges uppe i mobilecontainers */}
							{/* <div className={styles.priceRangeCards}>
								{priceRanges.map((priceRange, i) => (
									<PriceRange priceRange={priceRange} key={i} />
								))}
							</div> */}
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
						<h1 className={styles.display}>Restaurants</h1>
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
											// Adjusting the access according to the simplified structure of openingHours
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
											// Adjusting the priceTier access according to the mapping structure of priceTiers
											const priceTierLabel = priceTiers[restaurant.price_range_id] // Assuming priceTiers is a map from ID to tier label
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
