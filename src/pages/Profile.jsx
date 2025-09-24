import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Lock, Mail, Loader2 } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { authService } from '@/services/api'

// --- Component for Updating Profile Information ---
function UpdateProfileForm({ user }) {
  const { t } = useTranslation()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => {
      showToast({
        title: t('common.success'),
        description: 'Your profile has been updated.',
        type: 'success'
      })
      queryClient.invalidateQueries(['profile']) // Refetch profile data
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Update failed'
      showToast({
        title: t('common.error'),
        description: message,
        type: 'error'
      })
    }
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      mutation.mutate(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.profile.updateTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.name')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="name" value={formData.name} onChange={handleChange} className="pl-10" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="email" type="email" value={formData.email} onChange={handleChange} className="pl-10" />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <Button type="submit" disabled={mutation.isLoading} className="w-full">
            {mutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// --- Component for Changing Password ---
function ChangePasswordForm() {
  const { t } = useTranslation()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      showToast({
        title: t('common.success'),
        description: 'Your password has been changed.',
        type: 'success'
      })
      // Clear fields for security
      setFormData({ current_password: '', password: '', password_confirmation: '' })
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Password change failed'
      showToast({
        title: t('common.error'),
        description: message,
        type: 'error'
      })
    }
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.current_password) newErrors.current_password = 'Current password is required'
    if (formData.password.length < 8) newErrors.password = 'New password must be at least 8 characters'
    if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'Passwords do not match'
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      mutation.mutate(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('auth.profile.changePasswordTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.profile.currentPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="current_password" type="password" value={formData.current_password} onChange={handleChange} className="pl-10" />
              {errors.current_password && <p className="text-sm text-red-500 mt-1">{errors.current_password}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.profile.newPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="password" type="password" value={formData.password} onChange={handleChange} className="pl-10" />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('auth.profile.confirmNewPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} className="pl-10" />
              {errors.password_confirmation && <p className="text-sm text-red-500 mt-1">{errors.password_confirmation}</p>}
            </div>
          </div>
          <Button type="submit" disabled={mutation.isLoading} className="w-full">
            {mutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('common.update')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// --- Main Profile Page Component ---
export default function Profile() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">{t('nav.profile')}</h1>
          <p className="text-muted-foreground">
            {t('auth.profile.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <UpdateProfileForm user={user} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ChangePasswordForm />
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
}