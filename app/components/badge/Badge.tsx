import React from 'react'
import styles from './Badge.module.css'

type BadgeProps = {
	isOpen?: boolean
	label: string
}

const Badge = ({ isOpen, label }: BadgeProps) => {
	return (
		<aside className={styles.badge}>
			<div className={isOpen !== undefined ? (isOpen ? styles.open : styles.closed) : ''}></div>
			<div>{label}</div>
		</aside>
	)
}

export default Badge
