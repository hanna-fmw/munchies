import React from 'react'
import styles from './DeliveryTimeBadge.module.css'

type DeliveryTimeBadgeProps = {
	timeRange: TimeRange
	isActive: boolean
	onClick: () => void
}

type TimeRange = {
	minTime: number
	maxTime: number
	label: string
}

const DeliveryTimeBadge = ({ onClick, isActive, timeRange }: DeliveryTimeBadgeProps) => {
	return (
		<button onClick={onClick} className={`${styles.deliveryTimeBadge} ${isActive ? styles.active : ''}`}>
			{timeRange.label}
		</button>
	)
}

export default DeliveryTimeBadge
