import React from 'react'
import styles from './PriceRange.module.css'

type PriceRangeProps = {
	priceRange: string
}

const PriceRange = ({ priceRange }: PriceRangeProps) => {
	return (
		<>
			<button className={styles.priceRangeBtn}>{priceRange}</button>
		</>
	)
}

export default PriceRange
