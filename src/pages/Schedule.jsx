import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, MapPin, User, Edit, Save, X, Plus, Trash2, PartyPopper } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button, LoadingSpinner } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';
// FIXED: Import from the correct location
import { timetableService, programsService } from '@/services/api';
import { QUERY_KEYS } from '@/constants';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [
  '08:30 - 09:30',
  '09:30 - 10:30',
  '10:30 - 11:30',
  '11:30 - 12:30',
  '14:30 - 15:30',
  '15:30 - 16:30',
  '16:30 - 17:30'
];

export default function Schedule() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get user from auth context

  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editForm, setEditForm] = useState({
    subject: '',
    subjectId: null,
    teacher: '',
    room: '',
    isEvent: false
  });
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  // FIXED: Get role from user context
  const isAdmin = user?.role === 'admin';
  const currentLang = i18n.language || 'en';

  // Fetch all programs
  const { data: programsData } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PROGRAMS,
    queryFn: async () => {
      const res = await programsService.getAll();
      return Array.isArray(res.data) ? res.data : res; // Handle both wrapped and unwrapped responses
    },
    staleTime: 5 * 60 * 1000,
  });

  const programs = Array.isArray(programsData) ? programsData : [];

  // Set initial program when programs are loaded
  useEffect(() => {
    if (!selectedProgramId && programs.length > 0) {
      setSelectedProgramId(programs[0].id);
    }
  }, [programs, selectedProgramId]);

  // Fetch subjects for the selected program (for dropdown)
  const { data: subjectsData } = useQuery({
    queryKey: ['subjects', selectedProgramId],
    queryFn: async () => {
      if (!selectedProgramId) return [];
      const program = await programsService.getById(selectedProgramId);
      return program?.subjects || [];
    },
    enabled: !!selectedProgramId && isAdmin && editMode,
  });

  const subjects = subjectsData || [];

  // Fetch schedule for selected program
  const {
    data: scheduleData,
    isLoading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.WEEKLY_SCHEDULE(selectedProgramId),
    queryFn: async () => {
      if (!selectedProgramId) return null;
      const res = await timetableService.getWeeklySchedule(selectedProgramId);
      return res;
    },
    enabled: !!selectedProgramId,
    retry: 2,
  });

  const schedule = scheduleData?.schedule || {};

  // Create timetable mutation
  const createMutation = useMutation({
    mutationFn: timetableService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.WEEKLY_SCHEDULE(selectedProgramId));
      showToast({
        title: t('common.success'),
        description: t('schedule.created', 'Schedule entry created successfully'),
        type: 'success'
      });
    },
    onError: (error) => {
      showToast({
        title: t('common.error'),
        description: error.data?.message || error.message || 'Failed to create timetable',
        type: 'error'
      });
    }
  });

  // Update timetable mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => timetableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.WEEKLY_SCHEDULE(selectedProgramId));
      showToast({
        title: t('common.success'),
        description: t('schedule.updated', 'Schedule entry updated successfully'),
        type: 'success'
      });
    },
    onError: (error) => {
      showToast({
        title: t('common.error'),
        description: error.data?.message || error.message || 'Failed to update timetable',
        type: 'error'
      });
    }
  });

  // Delete timetable mutation
  const deleteMutation = useMutation({
    mutationFn: timetableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.WEEKLY_SCHEDULE(selectedProgramId));
      showToast({
        title: t('common.success'),
        description: t('schedule.deleted', 'Schedule entry deleted successfully'),
        type: 'success'
      });
    },
    onError: (error) => {
      showToast({
        title: t('common.error'),
        description: error.data?.message || error.message || 'Failed to delete timetable',
        type: 'error'
      });
    }
  });

  const handleEdit = (day, timeSlot, currentData) => {
    setEditingCell({ day, timeSlot });
    if (currentData) {
      // Find subject from current data
      const subjectObj = subjects.find(s => s.name === currentData.subject);
      setEditForm({
        id: currentData.id,
        subject: currentData.subject || '',
        subjectId: subjectObj?.id || null,
        teacher: currentData.teacher || '',
        room: currentData.room || '',
        isEvent: currentData.isEvent || day === 'sunday'
      });
    } else {
      setEditForm({
        subject: '',
        subjectId: null,
        teacher: '',
        room: '',
        isEvent: day === 'sunday'
      });
    }
  };

  const handleSave = async () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;

    const payload = {
      program_id: selectedProgramId,
      day,
      time_slot: timeSlot,
      room: editForm.room || null,
      is_event: editForm.isEvent,
    };

    if (editForm.isEvent) {
      payload.event_name = editForm.subject;
      payload.subject_id = null;
    } else {
      if (!editForm.subjectId) {
        showToast({
          title: t('common.error'),
          description: 'Please select a subject',
          type: 'error'
        });
        return;
      }
      payload.subject_id = editForm.subjectId;
    }

    try {
      if (editForm.id) {
        await updateMutation.mutateAsync({ id: editForm.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setEditingCell(null);
      setEditForm({ subject: '', subjectId: null, teacher: '', room: '', isEvent: false });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('schedule.confirmDelete', 'Are you sure you want to delete this class?'))) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditForm({ subject: '', subjectId: null, teacher: '', room: '', isEvent: false });
  };

  const renderCell = (day, timeSlot) => {
    const cellData = schedule[day]?.[timeSlot];
    const isEditing = editingCell?.day === day && editingCell?.timeSlot === timeSlot;

    if (isEditing && isAdmin) {
      return (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg">
          <div className="space-y-2">
            {editForm.isEvent ? (
              <input
                type="text"
                placeholder={t('schedule.eventName', 'Event Name')}
                value={editForm.subject}
                onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            ) : (
              <select
                value={editForm.subjectId || ''}
                onChange={(e) => {
                  const subjectId = Number(e.target.value);
                  const subject = subjects.find(s => s.id === subjectId);
                  setEditForm({
                    ...editForm,
                    subjectId,
                    subject: subject?.name || '',
                    teacher: subject?.teacher ? `${subject.teacher.first_name} ${subject.teacher.last_name}` : ''
                  });
                }}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">{t('schedule.selectSubject', 'Select Subject')}</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.teacher && `- ${subject.teacher.first_name} ${subject.teacher.last_name}`}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              placeholder={t('schedule.room', 'Room')}
              value={editForm.room}
              onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />

            {day === 'sunday' && (
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={editForm.isEvent}
                  onChange={(e) => setEditForm({ ...editForm, isEvent: e.target.checked })}
                  className="rounded"
                />
                {t('schedule.isEvent', 'Special Event')}
              </label>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-1 text-sm disabled:opacity-50"
              >
                <Save className="w-3 h-3" /> {t('common.save', 'Save')}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center gap-1 text-sm"
              >
                <X className="w-3 h-3" /> {t('common.cancel', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!cellData) {
      return (
        <div className="h-full min-h-[100px] flex items-center justify-center">
          {isAdmin && editMode && (
            <button
              onClick={() => handleEdit(day, timeSlot, null)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      );
    }

    const isEvent = cellData.isEvent || day === 'sunday';

    return (
      <div className={`p-3 h-full min-h-[100px] rounded-lg transition-all ${isEvent
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:shadow-md'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:shadow-md'
        }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {isEvent && <PartyPopper className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            <h4 className={`font-semibold text-sm ${isEvent ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
              {cellData.subject}
            </h4>
          </div>
          {isAdmin && editMode && (
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(day, timeSlot, cellData)}
                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cellData.id)}
                disabled={deleteMutation.isPending}
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {!isEvent && cellData.teacher && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
            <User className="w-3 h-3" />
            <span>{cellData.teacher}</span>
          </div>
        )}
        {cellData.room && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <MapPin className="w-3 h-3" />
            <span>{cellData.room}</span>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400 mb-4">
            {t('schedule.loadError', 'Failed to load schedule')}
          </p>
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries(QUERY_KEYS.WEEKLY_SCHEDULE(selectedProgramId))}
          >
            {t('common.retry', 'Retry')}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                {t('schedule.title', 'Emploi du Temps')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isAdmin
                  ? t('schedule.adminView', 'Admin View - Full Control')
                  : t('schedule.viewOnly', 'View Only')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedProgramId || ''}
                onChange={(e) => setSelectedProgramId(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">{t('schedule.selectProgram', 'Select Program')}</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.level} - {program.grade}
                  </option>
                ))}
              </select>

              {isAdmin && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${editMode
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  <Edit className="w-4 h-4" />
                  {editMode ? t('schedule.exitEdit', 'Exit Edit Mode') : t('schedule.editSchedule', 'Edit Schedule')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
                  <th className="p-4 text-left text-white font-semibold border-r border-blue-500 dark:border-blue-600 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('schedule.time', 'Time')}
                    </div>
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="p-4 text-center text-white font-semibold border-r border-blue-500 dark:border-blue-600 last:border-r-0 min-w-[150px]">
                      {t(`schedule.days.${day}`, day.charAt(0).toUpperCase() + day.slice(1))}
                      {day === 'sunday' && (
                        <div className="text-xs font-normal mt-1 opacity-90">
                          {t('schedule.eventsDay', 'Events')}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map((timeSlot, index) => (
                  <tr key={timeSlot} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'}>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      {timeSlot}
                    </td>
                    {DAYS.map(day => (
                      <td
                        key={`${day}-${timeSlot}`}
                        className="border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                      >
                        {renderCell(day, timeSlot)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {t('schedule.legend', 'Legend')}
          </h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('schedule.regularClass', 'Regular Class')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('schedule.event', 'Special Event')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('schedule.freePeriod', 'Free Period')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}