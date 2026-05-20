import { redirect } from "next/navigation"
import { LoginForm } from "@/features/auth"
import { getSession } from "@/server/auth"

export default async function LoginPage() {
	const session = await getSession()
	if (session) redirect("/dashboard")

	return (
		<main
			id="main-content"
			className="min-h-screen flex items-center justify-center bg-background px-4"
		>
			<LoginForm />
		</main>
	)
}
