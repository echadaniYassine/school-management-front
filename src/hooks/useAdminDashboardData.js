import { useQuery } from '@tanstack/react-query'
import {
  studentsService,
  teachersService,
  guardiansService,
  // programsService,
  // registrationsService
} from '@/api/index'

export const useAdminDashboardData = () => {
  // Helper to normalize API responses
  const normalize = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.data) return Array.isArray(res.data) ? res.data : res.data.data || []
    return []
  }

  const studentsQuery = useQuery({
    queryKey: ['admin-students'],
    queryFn: () => studentsService.getAll(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const teachersQuery = useQuery({
    queryKey: ['admin-teachers'],
    queryFn: () => teachersService.getAll(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  const guardiansQuery = useQuery({
    queryKey: ['admin-guardians'],
    queryFn: () => guardiansService.getAll(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })

  // const programsQuery = useQuery({
  //   queryKey: ['admin-programs'],
  //   queryFn: () => programsService.getAll(),
  //   staleTime: 5 * 60 * 1000,
  //   retry: 2,
  // })

  // const registrationsQuery = useQuery({
  //   queryKey: ['admin-registrations'],
  //   queryFn: () => registrationsService.getAll(),
  //   staleTime: 2 * 60 * 1000,
  //   retry: 2,
  // })

  // Aggregate normalized data
  const data = {
    studentsData: normalize(studentsQuery.data),
    teachersData: normalize(teachersQuery.data),
    guardiansData: normalize(guardiansQuery.data),
    // programsData: normalize(programsQuery.data),
    // registrationsData: normalize(registrationsQuery.data),
  }

  const loading = {
    students: studentsQuery.isLoading,
    teachers: teachersQuery.isLoading,
    guardians: guardiansQuery.isLoading,
    // programs: programsQuery.isLoading,
    // registrations: registrationsQuery.isLoading,
  }

  const isLoading = Object.values(loading).some(Boolean)

  const errors = {
    students: studentsQuery.error,
    teachers: teachersQuery.error,
    guardians: guardiansQuery.error,
    // programs: programsQuery.error,
    // registrations: registrationsQuery.error,
  }

  const error = Object.values(errors).find(Boolean) || null

  const refetch = () => {
    studentsQuery.refetch()
    teachersQuery.refetch()
    guardiansQuery.refetch()
    // programsQuery.refetch()
    // registrationsQuery.refetch()
  }

  return {
    data,
    loading,
    isLoading,
    errors,
    error,
    refetch,
  }
}