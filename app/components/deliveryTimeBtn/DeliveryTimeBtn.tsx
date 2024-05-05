import React from 'react'
import styles from './DeliveryTimeBtn.module.css'

type DeliveryTimeBtnProps = {
	range: Range
	isActive: boolean
	onClick: () => void
}

type Range = {
	minTime: number
	maxTime: number
	label: string
}

const DeliveryTimeBtn = ({ onClick, isActive, range }: DeliveryTimeBtnProps) => {
	return (
		<button onClick={onClick} className={`${styles.deliveryTimeBtn} ${isActive ? styles.active : ''}`}>
			{range.label}
		</button>
	)
}

export default DeliveryTimeBtn
