import React from 'react'
import styles from './DeliveryTimeBtn.module.css'

type DeliveryTimeBtnProps = {
	timeRange: TimeRange
	isActive: boolean
	onClick: () => void
}

type TimeRange = {
	minTime: number
	maxTime: number
	label: string
}

const DeliveryTimeBtn = ({ onClick, isActive, timeRange }: DeliveryTimeBtnProps) => {
	return (
		<button onClick={onClick} className={`${styles.deliveryTimeBtn} ${isActive ? styles.active : ''}`}>
			{timeRange.label}
		</button>
	)
}

export default DeliveryTimeBtn
