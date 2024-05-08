'use client'
import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import styles from '@/app/components/modal/Modal.module.css'
import Button from '@/app/components/button/Button'
import logotype from '@/public/Logo-light.png'

type ModalProps = {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const Modal = ({ setIsModalOpen }: ModalProps) => {
	return (
		<main className={styles.modalOverlay}>
			<section className={styles.modalContent}>
				<Image src={logotype} width={100} height={100} alt='Munchies Logotype' className={styles.logotype} />
				<div>
					<h1 className={styles.cover}>Treat yourself.</h1>
					<p className={styles.p}>Find the best restaurants in your city and get it delivered to your place!</p>
				</div>
				<div className={styles.button}>
					<Button onClick={() => setIsModalOpen(false)}>Continue</Button>
				</div>
			</section>
		</main>
	)
}

export default Modal
