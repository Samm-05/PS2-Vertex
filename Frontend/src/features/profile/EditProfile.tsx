import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building, Save, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateProfile, setEditing } from './profileSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  institution: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const EditProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      institution: profile?.institution || '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    await dispatch(updateProfile(data));
    setIsLoading(false);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">Edit Profile</h2>
        <button
          onClick={() => dispatch(setEditing(false))}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
        >
          <X className="w-5 h-5 text-secondary-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            icon={<User className="w-5 h-5" />}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            icon={<User className="w-5 h-5" />}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Institution"
          icon={<Building className="w-5 h-5" />}
          error={errors.institution?.message}
          {...register('institution')}
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Bio</label>
          <textarea
            className="w-full px-4 py-2 rounded-xl bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200"
            rows={4}
            placeholder="Tell us about yourself..."
            {...register('bio')}
          />
          {errors.bio && <p className="mt-1 text-sm text-error">{errors.bio.message}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => dispatch(setEditing(false))}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditProfile;