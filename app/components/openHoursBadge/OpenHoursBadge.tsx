import React from 'react'
import styles from './OpenHoursBadge.module.css'

type OpenHoursBadgeProps = {
	isOpen: boolean
	label: string
}

const OpenHoursBtn = ({ isOpen, label }: OpenHoursBadgeProps) => {
	return (
		<aside className={styles.openHoursBtn}>
			<div className={isOpen ? styles.open : styles.closed}></div>
			<div>{label}</div>
		</aside>
	)
}

export default OpenHoursBtn
