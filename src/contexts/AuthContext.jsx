/** @format */

import { createContext, useContext, useEffect, useState } from "react";
import {
	getSession,
	onAuthStateChange,
	signOut as authSignOut,
} from "../services/authService";

const AuthContext = createContext(null);

const DEMO_USER = {
	id: "demo-juri-itfest",
	email: "juri@itfest.id",
	user_metadata: { full_name: "Juri & Penguji ITFEST" },
};

export function AuthProvider({ children }) {
	// Default to Demo User so the app is instantly usable for judging & demo testing
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("harvey_demo_user");
		return saved ? JSON.parse(saved) : DEMO_USER;
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getSession().then(({ data: { session } }) => {
			if (session?.user) {
				setUser(session.user);
			}
		});

		const {
			data: { subscription },
		} = onAuthStateChange((_event, session) => {
			if (session?.user) {
				setUser(session.user);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	function loginAsDemo() {
		setUser(DEMO_USER);
		localStorage.setItem("harvey_demo_user", JSON.stringify(DEMO_USER));
	}

	async function signOut() {
		try {
			await authSignOut();
		} catch {
			// ignore
		}
		localStorage.removeItem("harvey_demo_user");
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, signOut, loginAsDemo }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
