import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthCard from '@/components/AuthCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            // Error managed by context toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            title="Welcome back"
            subtitle="Enter your credentials to access your workspace."
            footerText="Don't have an account?"
            footerLink="/signup"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="email" 
                            type="email" 
                            className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                            placeholder="name@example.com"
                            {...register("email", { required: true })} 
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                         <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="password" 
                            type="password"
                             className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                             placeholder="••••••••"
                            {...register("password", { required: true })} 
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </form>
        </AuthCard>
    );
};

export default Login;
