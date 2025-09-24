// src/components/forms/ProgramForm.jsx - Example optimized form component
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import { FormField } from './FormField'
import { SearchableSelect } from './SearchableSelect'
import { useForm } from '@/hooks/useForm'
import { createValidator, validationRules } from '@/utils/validation'
import { useToast } from '@/hooks/useToast'
import { programsService } from '@/services/api'

const PROGRAM_LEVELS = [
  { value: 'primary', label: 'Primary' },
  { value: 'college', label: 'Collège' },
  { value: 'lycee', label: 'Lycée' }
]

export const ProgramForm = ({ program, onSuccess, onCancel }) => {
  const { t } = useTranslation()
  const { showToast } = useToast()

  const validationSchema = {
    level: createValidator([validationRules.required()]),
    grade: createValidator([validationRules.required()]),
    duration: createValidator([validationRules.required()]),
    subjects: createValidator([
      (value) => {
        if (!value || value.length === 0) {
          return 'At least one subject is required'
        }
        return true
      }
    ])
  }

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    reset
  } = useForm({
    level: program?.level || '',
    grade: program?.grade || '',
    duration: program?.duration || '',
    subjects: program?.subjects || [{ subject: '', teacher: '' }],
    is_active: program?.is_active ?? true
  }, validationSchema)

  // Reset form when program changes
  useEffect(() => {
    if (program) {
      reset({
        level: program.level || '',
        grade: program.grade || '',
        duration: program.duration || '',
        subjects: program.subjects || [{ subject: '', teacher: '' }],
        is_active: program.is_active ?? true
      })
    }
  }, [program, reset])

  const addSubjectRow = () => {
    setValue('subjects', [...values.subjects, { subject: '', teacher: '' }])
  }

  const updateSubjectRow = (index, field, value) => {
    const newSubjects = [...values.subjects]
    newSubjects[index][field] = value
    setValue('subjects', newSubjects)
  }

  const removeSubjectRow = (index) => {
    if (values.subjects.length > 1) {
      const newSubjects = values.subjects.filter((_, i) => i !== index)
      setValue('subjects', newSubjects)
    }
  }

  const onSubmit = async (formData) => {
    try {
      if (program?.id) {
        await programsService.update(program.id, formData)
        showToast({
          title: 'Success',
          description: 'Program updated successfully',
          type: 'success'
        })
      } else {
        await programsService.create(formData)
        showToast({
          title: 'Success',
          description: 'Program created successfully',
          type: 'success'
        })
      }
      
      onSuccess?.()
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message || 'Failed to save program',
        type: 'error'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Level"
            error={errors.level}
            required
          >
            <SearchableSelect
              options={PROGRAM_LEVELS}
              value={values.level}
              onChange={(value) => setValue('level', value)}
              placeholder="Select level..."
              error={errors.level}
            />
          </FormField>

          <FormField
            label="Grade"
            name="grade"
            value={values.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.grade}
            placeholder="e.g., 1ère année, 2ème année..."
            required
          />
        </div>

        <FormField
          label="Duration"
          name="duration"
          value={values.duration}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.duration}
          placeholder="e.g., 1 an, 6 mois..."
          required
        />

        <div className="space-y-4">
          <label className="text-sm font-medium">
            Subjects & Teachers
            <span className="text-red-500 ml-1">*</span>
          </label>
          
          {values.subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border rounded-lg"
            >
              <FormField
                label={`Subject ${index + 1}`}
                value={subject.subject}
                onChange={(e) => updateSubjectRow(index, 'subject', e.target.value)}
                placeholder="Subject name"
                required
              />
              <FormField
                label="Teacher"
                value={subject.teacher}
                onChange={(e) => updateSubjectRow(index, 'teacher', e.target.value)}
                placeholder="Teacher name"
                required
              />
              {values.subjects.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubjectRow(index)}
                  className="md:col-span-2 w-fit"
                >
                  Remove Subject
                </Button>
              )}
            </motion.div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSubjectRow}
          >
            Add Subject
          </Button>

          {errors.subjects && (
            <p className="text-sm text-red-600">{errors.subjects}</p>
          )}
        </div>

        <FormField>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={values.is_active}
              onChange={handleChange}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Active Program</span>
          </label>
        </FormField>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : program?.id ? 'Update Program' : 'Create Program'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}