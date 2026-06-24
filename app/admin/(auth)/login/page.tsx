"use client";

import * as React from "react";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    const result = await login(values);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <Card className="w-full max-w-sm border-border">
      <CardHeader className="items-center text-center">
        <Image
          src="/images/brand/logo.jpg"
          alt="Titan's Gym"
          width={56}
          height={56}
          className="size-14 rounded-full object-cover ring-1 ring-border"
        />
        <h1 className="mt-3 font-heading text-xl font-bold uppercase tracking-tight">
          Panel Administrativo
        </h1>
        <p className="text-sm text-muted-foreground">
          Titan&apos;s Gym
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@titansgym.com"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lock className="size-4" />
              )}
              Iniciar sesión
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
