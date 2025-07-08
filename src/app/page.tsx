"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LucideUsers, LucideTractor, LucideGift, LucideGlobe, LucideTruck, LucideLeaf, LucideBarChart, LucideFileText, Menu, X, Loader2, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";

const services = [
	{ icon: <LucideUsers size={32} />, label: "خدمة العملاء المميزة", description: "خدمة عملاء على مدار الساعة" },
	{ icon: <LucideTractor size={32} />, label: "آلات الخدمات الحديثة", description: "أحدث المعدات الزراعية" },
	{ icon: <LucideLeaf size={32} />, label: "خضار من المنتجات الطازجة", description: "منتجات عضوية طازجة" },
	{ icon: <LucideBarChart size={32} />, label: "خدمات التصدير", description: "تصدير عالمي" },
	{ icon: <LucideGift size={32} />, label: "عرض جلسة", description: "عروض خاصة" },
	{ icon: <LucideTruck size={32} />, label: "التوصيل", description: "توصيل سريع" },
	{ icon: <LucideGlobe size={32} />, label: "خدمات التحليل والدراسات", description: "دراسات متخصصة" },
	{ icon: <LucideFileText size={32} />, label: "كرب الأراضي الزراعية", description: "استشارات زراعية" },
];

const navLinks = [
	{ href: "/", label: "الرئيسية" },
	{ href: "/listings", label: "القوائم" },
	{ href: "/about", label: "من نحن" },
	{ href: "/contact", label: "اتصل بنا" },
];

// Floating particles component
const FloatingParticles = () => {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{[...Array(20)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
					initial={{
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
					}}
					animate={{
						y: [null, -100, -200],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: Math.random() * 10 + 10,
						repeat: Infinity,
						ease: "linear",
						delay: Math.random() * 5,
					}}
				/>
			))}
		</div>
	);
};

// Enhanced button component with loading state
const LoadingButton = ({ 
	children, 
	onClick, 
	loading = false, 
	className = "", 
	...props 
}: {
	children: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	loading?: boolean;
	className?: string;
	[key: string]: any;
}) => {
	return (
		<motion.button
			whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)" }}
			whileTap={{ scale: 0.95 }}
			className={cn(
				"rounded-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 relative overflow-hidden",
				className
			)}
			onClick={onClick}
			disabled={loading}
			{...props}
		>
			<AnimatePresence mode="wait">
				{loading ? (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex items-center justify-center gap-2"
					>
						<Loader2 className="w-4 h-4 animate-spin" />
						جاري التحميل...
					</motion.div>
				) : (
					<motion.div
						key="content"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	);
};

export default function HomePage() {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start start", "end start"]
	});
	
	const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
	const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

	// Handle login submission
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		setIsLoading(false);
		// Handle login logic here
	};

	// Keyboard navigation for mobile nav
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setMobileNavOpen(false);
				setShowLogin(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a2b24] via-[#155e4d] to-[#2db48b] relative overflow-hidden" dir="rtl">
			<FloatingParticles />
			
			{/* Hero Section with Video */}
			<div ref={heroRef} className="relative flex flex-col md:flex-row items-center justify-center min-h-screen pt-32 pb-12">
				{/* Video BG */}
				<video
					autoPlay
					muted
					loop
					playsInline
					className="absolute inset-0 w-full h-full object-cover z-0"
				>
					<source src="/assets/Videoplayback2.mp4" type="video/mp4" />
				</video>
				
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.2 }}
					className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/40 to-black/80 z-10"
				/>

				{/* Login Card (desktop) or Modal (mobile) */}
				<AnimatePresence>
					{(showLogin || typeof window === "undefined" || window.innerWidth >= 768) && (
						<motion.div
							initial={{ y: 40, opacity: 0, rotateY: -15 }}
							animate={{ y: 0, opacity: 1, rotateY: 0 }}
							exit={{ y: 40, opacity: 0, rotateY: -15 }}
							transition={{ type: "spring", stiffness: 120, damping: 18 }}
							whileHover={{ rotateY: 2, scale: 1.02 }}
							className={cn(
								"z-20 p-6 flex flex-col gap-4 glass backdrop-blur-2xl border border-emerald-400/20 shadow-2xl",
								"w-full max-w-xs md:w-80 md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2 md:max-w-xs",
								showLogin && "fixed bottom-0 left-0 right-0 mx-auto my-8 md:static md:my-0"
							)}
							role="dialog"
							aria-modal="true"
							aria-label="تسجيل الدخول"
						>
							<motion.h3 
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="text-xl font-bold text-emerald-300 mb-2 text-center"
							>
								تسجيل الدخول
							</motion.h3>
							
							<form onSubmit={handleLogin} className="flex flex-col gap-4">
								<motion.input 
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className="input" 
									placeholder="البريد الإلكتروني" 
									type="email" 
									aria-label="البريد الإلكتروني"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<motion.input 
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="input" 
									placeholder="كلمة المرور" 
									type="password" 
									aria-label="كلمة المرور"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
								
								<motion.div 
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="flex items-center gap-2 text-sm text-white/80"
								>
									<input 
										type="checkbox" 
										id="remember" 
										className="accent-emerald-500" 
										checked={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
									/>
									<label htmlFor="remember">تذكرني | نسيت كلمة المرور</label>
								</motion.div>
								
								<LoadingButton 
									type="submit"
									loading={isLoading}
									aria-label="دخول"
								>
									دخول
								</LoadingButton>
							</form>
							
							<motion.div 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.6 }}
								className="text-center text-emerald-400 text-sm mt-2"
							>
								مستخدم جديد؟ <a href="/auth/signup" className="underline hover:text-emerald-300 transition-colors">إنشاء حساب</a>
							</motion.div>
							
							{/* Close button for mobile modal */}
							<motion.button
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
								className="md:hidden mt-4 text-sm text-white/70 underline focus:outline-none hover:text-white transition-colors"
								onClick={() => setShowLogin(false)}
								aria-label="إغلاق تسجيل الدخول"
							>
								إغلاق
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
				
				{/* Show login button on mobile */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)" }}
					whileTap={{ scale: 0.95 }}
					className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-30 rounded-full px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
					onClick={() => setShowLogin(true)}
					aria-label="تسجيل الدخول"
				>
					تسجيل الدخول
				</motion.button>

				{/* Hero Content with Parallax */}
				<motion.div 
					style={{ y, opacity, scale }}
					className="relative z-20 flex flex-col items-center justify-center text-center w-full px-4"
				>
					<motion.h1
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
						className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 mt-8"
					>
						الغلة
					</motion.h1>
					
					<motion.h2
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
						className="text-xl md:text-2xl lg:text-3xl font-bold text-white bg-emerald-700/80 px-6 py-3 rounded-lg inline-block mb-4 backdrop-blur-sm"
					>
						منتجات طبيعية خدمات زراعية و استشارية
					</motion.h2>
					
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="text-emerald-300 text-lg md:text-xl font-bold mb-8 flex items-center gap-2"
					>
						<Star className="w-5 h-5" />
						استكشف موقعنا الغلة
						<Star className="w-5 h-5" />
					</motion.div>

					{/* Service Grid (responsive, animated) */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={{
							hidden: {},
							visible: {
								transition: { staggerChildren: 0.08, delayChildren: 0.7 },
							},
						}}
						className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 w-full"
						role="list"
						aria-label="الخدمات"
					>
						{services.map((service, i) => (
							<motion.div
								key={i}
								variants={{
									hidden: { y: 40, opacity: 0, scale: 0.8 },
									visible: { 
										y: 0, 
										opacity: 1, 
										scale: 1,
										transition: { type: "spring", stiffness: 120, damping: 18 }
									},
								}}
								whileHover={{ 
									scale: 1.08, 
									boxShadow: "0 0 24px #10b98155",
									rotateY: 5,
									z: 10
								}}
								whileTap={{ scale: 0.97 }}
								tabIndex={0}
								className="group flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 p-4 rounded-xl transition-all duration-300"
								role="listitem"
								aria-label={service.label}
							>
								<motion.div 
									className="w-20 h-20 rounded-full glass flex items-center justify-center mb-2 border border-emerald-400/30 shadow-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300"
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.6 }}
								>
									{service.icon}
								</motion.div>
								<div className="text-white/90 text-base font-medium text-center leading-tight">
									{service.label}
								</div>
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									whileHover={{ opacity: 1, height: "auto" }}
									className="text-emerald-300 text-sm text-center overflow-hidden"
								>
									{service.description}
								</motion.div>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</div>
	);
}
