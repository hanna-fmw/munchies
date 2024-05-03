'use client';
import styles from './home.module.css';
import Modal from './components/modal/Modal';
import { useState } from 'react';

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

	return <main className={`${styles.main} ${styles.onlyMobile}`}>{isModalOpen ? <Modal setIsModalOpen={setIsModalOpen} /> : null}</main>;
}
