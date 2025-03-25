
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(240 3.7% 15.9%)',
				input: 'hsl(240 3.7% 15.9%)',
				ring: 'hsl(240 4.9% 83.9%)',
				background: 'hsl(240 10% 3.9%)',
				foreground: 'hsl(0 0% 98%)',
				primary: {
					DEFAULT: 'hsl(240 5.9% 90%)',
					foreground: 'hsl(240 5.9% 10%)'
				},
				secondary: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				destructive: {
					DEFAULT: 'hsl(0 62.8% 30.6%)',
					foreground: 'hsl(0 0% 98%)'
				},
				muted: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(240 5% 64.9%)'
				},
				accent: {
					DEFAULT: 'hsl(240 3.7% 15.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				popover: {
					DEFAULT: 'hsl(240 10% 3.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				card: {
					DEFAULT: 'hsl(240 10% 3.9%)',
					foreground: 'hsl(0 0% 98%)'
				},
				sidebar: {
					DEFAULT: 'hsl(240 5.9% 10%)',
					foreground: 'hsl(240 4.8% 95.9%)',
					primary: 'hsl(224.3 76.3% 48%)',
					'primary-foreground': 'hsl(0 0% 100%)',
					accent: 'hsl(240 3.7% 15.9%)',
					'accent-foreground': 'hsl(240 4.8% 95.9%)',
					border: 'hsl(240 3.7% 15.9%)',
					ring: 'hsl(217.2 91.2% 59.8%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in': 'slide-in 0.3s ease-out',
				'slide-out': 'slide-out 0.3s ease-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
