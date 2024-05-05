import React from 'react'
import styles from './Button.module.css'

type ButtonProps = {
	onClick: () => void
	children: React.ReactNode
}

const Button = ({ children, onClick }: ButtonProps) => {
	return (
		<button onClick={onClick} className={styles.button_dark}>
			{children}
		</button>
	)
}

export default Button
