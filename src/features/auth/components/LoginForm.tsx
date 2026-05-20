"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/features/auth/actions/auth.actions"
import { type LoginInput, loginSchema } from "@/lib/validations/auth.schema"

export function LoginForm() {
	const [isPending, startTransition] = useTransition()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	})

	function onSubmit(data: LoginInput) {
		startTransition(async () => {
			const result = await loginAction(data)
			if (!result.success) {
				toast.error(result.error)
			}
		})
	}

	return (
		<Card className="w-full max-w-sm shadow-card">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold text-foreground">Maxxsiren</CardTitle>
				<CardDescription className="text-sm text-muted-foreground">
					Masuk ke Sistem Informasi Inventaris
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="email" className="text-sm font-medium">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="nama@maxxsiren.com"
							autoComplete="email"
							{...register("email")}
						/>
						{errors.email && <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="password" className="text-sm font-medium">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="Masukkan password"
							autoComplete="current-password"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-xs text-danger mt-1.5">{errors.password.message}</p>
						)}
					</div>

					<Button type="submit" disabled={isPending} className="w-full mt-2">
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
								Memproses...
							</>
						) : (
							"Masuk"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
