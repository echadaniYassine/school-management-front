// src/hooks/useAdminDashboardData.js
import { useQuery } from '@tanstack/react-query'
import { 
  studentsService,
  teachersService,
  guardiansService,
  programsService,
  registrationsService
} from '@/services/api'

export const useAdminDashboardData = () => {
  // Individual queries for better caching and error handling
  const studentsQuery = useQuery({
    queryKey: ['admin-students'],
    queryFn: studentsService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })

  const teachersQuery = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: teachersService.getAll,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })

  const guardiansQuery = useQuery({
    queryKey: ['admin-guardians'],
    queryFn: guardiansService.getAll,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })

  const programsQuery = useQuery({
    queryKey: ['admin-programs'],
    queryFn: programsService.getAll,
    staleTime: 5 * 60 * 1000,
    retry: 2
  })

  const registrationsQuery = useQuery({
    queryKey: ['admin-registrations'],
    queryFn: registrationsService.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates)
    retry: 2
  })

  // Aggregate data and loading states
  const data = {
    studentsData: studentsQuery.data?.data?.data || [],
    teachersData: teachersQuery.data?.data?.data || [],
    guardiansData: guardiansQuery.data?.data?.data || [],
    programsData: programsQuery.data?.data?.data || [],
    registrationsData: registrationsQuery.data?.data?.data || []
  }

  const loading = {
    students: studentsQuery.isLoading,
    teachers: teachersQuery.isLoading,
    guardians: guardiansQuery.isLoading,
    programs: programsQuery.isLoading,
    registrations: registrationsQuery.isLoading
  }

  const isLoading = Object.values(loading).some(Boolean)
  
  const error = studentsQuery.error || 
                teachersQuery.error || 
                guardiansQuery.error || 
                programsQuery.error || 
                registrationsQuery.error

  return {
    data,
    loading,
    isLoading,
    error,
    refetch: () => {
      studentsQuery.refetch()
      teachersQuery.refetch()
      guardiansQuery.refetch()
      programsQuery.refetch()
      registrationsQuery.refetch()
    }
  }
}