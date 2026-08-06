import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Brain } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register } from './authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...userData } = data;
    const result = await dispatch(register(userData));
    if (register.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-800 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex justify-center"
          >
            <Brain className="h-16 w-16 text-primary-600" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Start your machine learning journey today
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                icon={<User className="w-5 h-5" />}
                error={errors.firstName?.message}
                {...registerField('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                icon={<User className="w-5 h-5" />}
                error={errors.lastName?.message}
                {...registerField('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...registerField('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...registerField('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...registerField('confirmPassword')}
            />

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-secondary-900 dark:text-secondary-300">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Sign up
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300 dark:border-secondary-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button variant="outline" fullWidth>
                  Sign in instead
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;