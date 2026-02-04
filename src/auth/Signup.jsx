import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthCard from '@/components/AuthCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Signup = () => {
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await signup(data.fullName, data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            // Error managed by context toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthCard
            title="Create your account"
            subtitle="AI-powered resume intelligence starts here."
            footerText="Already have an account?"
            footerLink="/login"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="fullName" 
                            className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                            placeholder="John Doe"
                            {...register("fullName", { required: true })} 
                        />
                    </div>
                </div>

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
                            {...register("password", { required: true, minLength: 6 })} 
                        />
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                         <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="confirmPassword" 
                            type="password"
                             className="pl-10 bg-black/20 border-white/10 focus:border-primary/50 transition-colors"
                             placeholder="••••••••"
                            {...register("confirmPassword", { required: true })} 
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </form>
        </AuthCard>
    );
};

export default Signup;
