"use client"

import { AlertCircle, Lock, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

function LoginRedirect() {
    const router = useRouter()
    return (
        <Card className="border-blue-200 pt-5 bg-blue-50/50">
            <CardHeader>
                <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-blue-900">Authentication Required</CardTitle>
                        <CardDescription className="text-blue-700 mt-1">
                            Please log in or create an account to submit a review.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Alert className="border-blue-200 bg-white">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertTitle>Why do I need to sign in?</AlertTitle>
                        <AlertDescription>
                            We require authentication to ensure all reviews are from real customers and to prevent spam.
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-col sm:flex-row gap-3 p-2">
                        <Button className="flex-1 gap-2" onClick={() => {
                            router.push("/login")
                        }}>
                            <Lock className="h-4 w-4" />
                            Log In
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                            router.push("/register")
                        }}>
                            <UserPlus className="h-4 w-4" />
                            Create Account
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoginRedirect
