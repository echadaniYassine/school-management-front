// src/pages/auth/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  Eye, EyeOff, Mail, Lock, User, Calendar, 
  UserPlus, Loader2, Check, ArrowRight 
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '../../components/ui/index'
import { Input } from '../../components/ui/index'
import { Card, CardContent, CardHeader } from '../../components/ui/index'
import { useToast } from '@/hooks/useToast'
import { ThemeToggle } from '../../components/ui/index'
import { LanguageSelector } from '../../components/ui/index'
import { cn } from '@/lib/utils'

export default function Register() {
  const { t } = useTranslation()
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Guardian info
    guardian_name: '',
    guardian_email: '',
    guardian_password: '',
    guardian_password_confirmation: '',
    
    // Student info
    student_name: '',
    student_date_of_birth: '',
    student_gender: '',
    student_email: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.guardian_name.trim()) {
      newErrors.guardian_name = 'Guardian name is required'
    }
    
    if (!formData.guardian_email) {
      newErrors.guardian_email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.guardian_email)) {
      newErrors.guardian_email = 'Email is invalid'
    }
    
    if (!formData.guardian_password) {
      newErrors.guardian_password = 'Password is required'
    } else if (formData.guardian_password.length < 8) {
      newErrors.guardian_password = 'Password must be at least 8 characters'
    }
    
    if (formData.guardian_password !== formData.guardian_password_confirmation) {
      newErrors.guardian_password_confirmation = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required'
    }
    
    if (!formData.student_date_of_birth) {
      newErrors.student_date_of_birth = 'Date of birth is required'
    }
    
    if (formData.student_email && !/\S+@\S+\.\S+/.test(formData.student_email)) {
      newErrors.student_email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep === 1) {
      handleNext()
      return
    }
    
    if (!validateStep2()) return

    const result = await register(formData)
    
    if (result.success) {
      showToast({
        title: t('common.success'),
        description: 'Account created successfully!',
        type: 'success'
      })
      navigate('/dashboard')
    } else {
      showToast({
        title: t('common.error'),
        description: result.message,
        type: 'error'
      })
    }
  }

  const steps = [
    { number: 1, title: t('auth.guardianInfo'), completed: currentStep > 1 },
    { number: 2, title: t('auth.studentInfo'), completed: false },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <motion.div 
            className="absolute top-1/4 right-1/4 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl dark:bg-green-600"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl dark:bg-blue-600"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>

      {/* Theme and Language Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <UserPlus className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('auth.registerTitle')}
            </h1>
            <p className="text-center text-muted-foreground">
              {t('auth.registerSubtitle')}
            </p>

            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : step.completed
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Guardian Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.guardianName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        name="guardian_name"
                        value={formData.guardian_name}
                        onChange={handleChange}
                        className={`pl-10 ${errors.guardian_name ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.guardian_name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.guardian_name}
                      </motion.p>
                    )}
                  </div>

                  {/* Guardian Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.guardianEmail')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="email"
                        name="guardian_email"
                        value={formData.guardian_email}
                        onChange={handleChange}
                        className={`pl-10 ${errors.guardian_email ? 'border-red-500' : ''}`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.guardian_email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.guardian_email}
                      </motion.p>
                    )}
                  </div>

                  {/* Guardian Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.guardianPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="guardian_password"
                        value={formData.guardian_password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${errors.guardian_password ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.guardian_password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.guardian_password}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.confirmPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="guardian_password_confirmation"
                        value={formData.guardian_password_confirmation}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${errors.guardian_password_confirmation ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.guardian_password_confirmation && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.guardian_password_confirmation}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Student Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.studentName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="text"
                        name="student_name"
                        value={formData.student_name}
                        onChange={handleChange}
                        className={`pl-10 ${errors.student_name ? 'border-red-500' : ''}`}
                        placeholder="Jane Doe"
                      />
                    </div>
                    {errors.student_name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.student_name}
                      </motion.p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.studentDateOfBirth')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="date"
                        name="student_date_of_birth"
                        value={formData.student_date_of_birth}
                        onChange={handleChange}
                        className={`pl-10 ${errors.student_date_of_birth ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.student_date_of_birth && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.student_date_of_birth}
                      </motion.p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.studentGender')}</label>
                    <select
                      name="student_gender"
                      value={formData.student_gender}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select gender</option>
                      <option value="male">{t('auth.male')}</option>
                      <option value="female">{t('auth.female')}</option>
                    </select>
                  </div>

                  {/* Student Email (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('auth.studentEmail')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        type="email"
                        name="student_email"
                        value={formData.student_email}
                        onChange={handleChange}
                        className={`pl-10 ${errors.student_email ? 'border-red-500' : ''}`}
                        placeholder="jane@example.com (optional)"
                      />
                    </div>
                    {errors.student_email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.student_email}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col gap-3 mt-6">
                {currentStep === 1 ? (
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {t('auth.signUp')}
                    </Button>
                  </div>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link 
                  to="/login" 
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  {t('auth.signIn')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}