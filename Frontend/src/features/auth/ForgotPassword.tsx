import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, Brain } from 'lucide-react';
import { authAPI } from './authAPI';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await authAPI.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
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
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <Card className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                icon={<Send className="w-5 h-5" />}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                Check your email
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
                We've sent a password reset link to your email address.
              </p>
            </motion.div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;