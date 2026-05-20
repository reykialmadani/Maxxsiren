"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock, Mail } from "lucide-react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold text-foreground">Masuk ke Akun Anda</h1>
				<p className="text-sm text-muted-foreground">
					Masukkan email dan password untuk mengakses sistem
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="email" className="text-sm font-medium">
						Email
					</Label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							id="email"
							type="email"
							placeholder="nama@maxxsiren.com"
							autoComplete="email"
							className="pl-9"
							{...register("email")}
						/>
					</div>
					{errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor="password" className="text-sm font-medium">
						Password
					</Label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							id="password"
							type="password"
							placeholder="Masukkan password"
							autoComplete="current-password"
							className="pl-9"
							{...register("password")}
						/>
					</div>
					{errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
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
		</div>
	)
}
