import { useState, useEffect } from 'react'


const MOBILE_THRESHOLD = 600
export function useMobile() {
	const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_THRESHOLD)
	useEffect(() => {
		function handleResize() {
			if (window.innerWidth <= MOBILE_THRESHOLD) {
				setIsMobile(true)
			} else {
				setIsMobile(false)
			}
		}
		window.addEventListener('resize', handleResize)
		handleResize()
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	return isMobile
}
