'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import styles from './modal.module.css';
import Button from '../button/Button';
import logotype from '@/public/Logo.png';

type ModalProps = {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Modal = ({ setIsModalOpen }: ModalProps) => {
	return (
		<section className={styles.modal}>
			<Image src={logotype} width={100} height={100} alt='Munchies Logotype' className={styles.logotype} />
			<div>
				<h1>Treat yourself.</h1>
				<p>Find the best restaurants in your city and get it delivered to your place!</p>
			</div>
			<div className={styles.button}>
				<Button onClick={() => setIsModalOpen(false)}>Continue</Button>
			</div>
		</section>
	);
};

export default Modal;
