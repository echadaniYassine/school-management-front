// src/pages/Schedule.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, User, Edit, Save, X, Plus, Trash2, PartyPopper } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

// Mock user role - in production, get from authentication context
const CURRENT_USER_ROLE = 'admin'; // Change to 'student' or 'teacher' to test different views

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

const PROGRAMS = [
  { value: 'college-1', label: { en: '1st Year - College', fr: '1ère Année - Collège', ar: 'السنة الأولى - الإعدادية' } },
  { value: 'college-2', label: { en: '2nd Year - College', fr: '2ème Année - Collège', ar: 'السنة الثانية - الإعدادية' } },
  { value: 'college-3', label: { en: '3rd Year - College', fr: '3ème Année - Collège', ar: 'السنة الثالثة - الإعدادية' } },
  { value: 'lycee-1', label: { en: '1st Year - Lycée', fr: '1ère Année - Lycée', ar: 'السنة الأولى - الثانوية' } },
  { value: 'lycee-2', label: { en: '2nd Year - Lycée', fr: '2ème Année - Lycée', ar: 'السنة الثانية - الثانوية' } },
  { value: 'lycee-3', label: { en: '3rd Year - Lycée', fr: '3ème Année - Lycée', ar: 'السنة الثالثة - الثانوية' } }
];

const INITIAL_SCHEDULE = {
  monday: {
    '08:30 - 09:30': { subject: 'Mathematics', teacher: 'Prof. Ahmed', room: 'A101' },
    '09:30 - 10:30': { subject: 'Physics', teacher: 'Prof. Fatima', room: 'B205' },
    '10:30 - 11:30': { subject: 'Chemistry', teacher: 'Prof. Hassan', room: 'B203' },
    '11:30 - 12:30': { subject: 'English', teacher: 'Prof. Sarah', room: 'C102' },
    '14:30 - 15:30': { subject: 'French', teacher: 'Prof. Marie', room: 'C103' },
    '15:30 - 16:30': { subject: 'History', teacher: 'Prof. Aisha', room: 'D101' },
    '16:30 - 17:30': { subject: 'Geography', teacher: 'Prof. Omar', room: 'D102' }
  },
  tuesday: {
    '08:30 - 09:30': { subject: 'Biology', teacher: 'Prof. Karim', room: 'B204' },
    '09:30 - 10:30': { subject: 'Mathematics', teacher: 'Prof. Ahmed', room: 'A101' },
    '10:30 - 11:30': { subject: 'Arabic', teacher: 'Prof. Laila', room: 'C101' },
    '11:30 - 12:30': { subject: 'Islamic Studies', teacher: 'Prof. Youssef', room: 'E101' },
    '14:30 - 15:30': { subject: 'Computer Science', teacher: 'Prof. Nadia', room: 'Lab A' },
    '15:30 - 16:30': { subject: 'Art', teacher: 'Prof. Samira', room: 'Art Room' }
  },
  wednesday: {
    '08:30 - 09:30': { subject: 'Physics', teacher: 'Prof. Fatima', room: 'B205' },
    '09:30 - 10:30': { subject: 'Chemistry', teacher: 'Prof. Hassan', room: 'B203' },
    '10:30 - 11:30': { subject: 'Physical Education', teacher: 'Prof. Rachid', room: 'Gym' },
    '11:30 - 12:30': { subject: 'English', teacher: 'Prof. Sarah', room: 'C102' },
    '14:30 - 15:30': { subject: 'French', teacher: 'Prof. Marie', room: 'C103' },
    '15:30 - 16:30': { subject: 'Music', teacher: 'Prof. Hamza', room: 'Music Room' }
  },
  thursday: {
    '08:30 - 09:30': { subject: 'Mathematics', teacher: 'Prof. Ahmed', room: 'A101' },
    '09:30 - 10:30': { subject: 'History', teacher: 'Prof. Aisha', room: 'D101' },
    '10:30 - 11:30': { subject: 'Geography', teacher: 'Prof. Omar', room: 'D102' },
    '14:30 - 15:30': { subject: 'Philosophy', teacher: 'Prof. Mehdi', room: 'D103' },
    '15:30 - 16:30': { subject: 'Economics', teacher: 'Prof. Zineb', room: 'D104' }
  },
  friday: {
    '08:30 - 09:30': { subject: 'Arabic', teacher: 'Prof. Laila', room: 'C101' },
    '09:30 - 10:30': { subject: 'Islamic Studies', teacher: 'Prof. Youssef', room: 'E101' },
    '10:30 - 11:30': { subject: 'Computer Science', teacher: 'Prof. Nadia', room: 'Lab A' },
    '11:30 - 12:30': { subject: 'Biology', teacher: 'Prof. Karim', room: 'B204' }
  },
  saturday: {
    '08:30 - 09:30': { subject: 'Mathematics', teacher: 'Prof. Ahmed', room: 'A101' },
    '09:30 - 10:30': { subject: 'Physics', teacher: 'Prof. Fatima', room: 'B205' },
    '10:30 - 11:30': { subject: 'Chemistry', teacher: 'Prof. Hassan', room: 'B203' }
  },
  sunday: {
    '08:30 - 09:30': { subject: 'School Event', teacher: '', room: 'Auditorium', isEvent: true },
    '09:30 - 10:30': { subject: 'Cultural Activities', teacher: '', room: 'Main Hall', isEvent: true }
  }
};

export default function Schedule() {
  const { t, i18n } = useTranslation();
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editForm, setEditForm] = useState({ subject: '', teacher: '', room: '', isEvent: false });
  const [selectedProgram, setSelectedProgram] = useState('lycee-1');

  const isAdmin = CURRENT_USER_ROLE === 'admin';
  const currentLang = i18n.language || 'en';

  const handleEdit = (day, timeSlot, currentData) => {
    setEditingCell({ day, timeSlot });
    setEditForm(currentData || { subject: '', teacher: '', room: '', isEvent: day === 'sunday' });
  };

  const handleSave = () => {
    if (!editingCell) return;

    const { day, timeSlot } = editingCell;
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: editForm.subject ? editForm : null
      }
    }));
    setEditingCell(null);
    setEditForm({ subject: '', teacher: '', room: '', isEvent: false });
  };

  const handleDelete = (day, timeSlot) => {
    if (window.confirm(t('schedule.confirmDelete', 'Are you sure you want to delete this class?'))) {
      setSchedule(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [timeSlot]: null
        }
      }));
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setEditForm({ subject: '', teacher: '', room: '', isEvent: false });
  };

  const renderCell = (day, timeSlot) => {
    const cellData = schedule[day]?.[timeSlot];
    const isEditing = editingCell?.day === day && editingCell?.timeSlot === timeSlot;

    if (isEditing && isAdmin) {
      return (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg">
          <div className="space-y-2">
            <input
              type="text"
              placeholder={t('schedule.subject', 'Subject')}
              value={editForm.subject}
              onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {!editForm.isEvent && (
              <input
                type="text"
                placeholder={t('schedule.teacher', 'Teacher')}
                value={editForm.teacher}
                onChange={(e) => setEditForm({ ...editForm, teacher: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            )}
            <input
              type="text"
              placeholder={t('schedule.room', 'Room')}
              value={editForm.room}
              onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                className="flex-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-1 text-sm transition-colors"
              >
                <Save className="w-3 h-3" /> {t('common.save', 'Save')}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center gap-1 text-sm transition-colors"
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
      <div className={`p-3 h-full min-h-[100px] rounded-lg transition-all ${
        isEvent
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:shadow-md'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:shadow-md'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {isEvent && <PartyPopper className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            <h4 className={`font-semibold ${isEvent ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
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
                onClick={() => handleDelete(day, timeSlot)}
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {!isEvent && cellData.teacher && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
            <User className="w-4 h-4" />
            <span>{cellData.teacher}</span>
          </div>
        )}
        {cellData.room && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{cellData.room}</span>
          </div>
        )}
      </div>
    );
  };

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
                  : t('schedule.viewOnly', `${CURRENT_USER_ROLE} View - Read Only`)}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {PROGRAMS.map(program => (
                  <option key={program.value} value={program.value}>
                    {program.label[currentLang] || program.label.en}
                  </option>
                ))}
              </select>

              {isAdmin && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    editMode
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
                  <th className="p-4 text-left text-white font-semibold border-r border-blue-500 dark:border-blue-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {t('schedule.time', 'Time')}
                    </div>
                  </th>
                  {DAYS.map(day => (
                    <th key={day} className="p-4 text-center text-white font-semibold border-r border-blue-500 dark:border-blue-600 last:border-r-0">
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