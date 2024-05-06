import React from 'react'
import styles from './PriceRange.module.css'

type PriceTierProps = {
	priceTier: string
	isActive: boolean
	onClick: () => void
}

const PriceRange = ({ priceTier, isActive, onClick }: PriceTierProps) => {
	return (
		<button className={`${styles.priceRangeBtn} ${isActive ? styles.active : ''}`} onClick={onClick}>
			{priceTier}
		</button>
	)
}

export default PriceRange
