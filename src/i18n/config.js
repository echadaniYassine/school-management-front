// src/i18n/config.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
const resources = {
  en: {
    translation: {
      nav: {
        dashboard: 'Dashboard',
        programs: 'Programs',
        students: 'Students',
        guardians: 'Guardians',
        registrations: 'Registrations',
        profile: 'Profile',
        logout: 'Logout'
      },
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your account',
        registerTitle: 'Create Account',
        registerSubtitle: 'Register as a guardian',
        forgotPassword: 'Forgot Password?',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        guardianInfo: 'Guardian Information',
        studentInfo: 'Student Information',
        guardianName: 'Guardian Name',
        guardianEmail: 'Guardian Email',
        guardianPassword: 'Guardian Password',
        studentName: 'Student Name',
        studentEmail: 'Student Email (Optional)',
        studentDateOfBirth: 'Date of Birth',
        studentGender: 'Gender',
        male: 'Male',
        female: 'Female',
        profile: {
          updateTitle: 'Profile Information',
          changePasswordTitle: 'Change Password',
          subtitle: 'Manage your personal information and security settings.',
          currentPassword: 'Current Password',
          newPassword: 'New Password',
          confirmNewPassword: 'Confirm New Password'
        }
      },
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        create: 'Create',
        update: 'Update',
        search: 'Search',
        filter: 'Filter',
        actions: 'Actions',
        status: 'Status',
        date: 'Date',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        submit: 'Submit',
        close: 'Close',
        confirm: 'Confirm',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back',
        totalStudents: 'Total Students',
        totalGuardians: 'Total Guardians',
        totalPrograms: 'Total Programs',
        pendingRegistrations: 'Pending Registrations',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        addStudent: 'Add Student',
        addProgram: 'Add Program',
        viewReports: 'View Reports'
      },
      programs: {
        title: 'Programs',
        addProgram: 'Add Program',
        editProgram: 'Edit Program',
        programTitle: 'Program Title',
        description: 'Description',
        level: 'Level',
        price: 'Price',
        schedule: 'Schedule',
        active: 'Active',
        inactive: 'Inactive',
        created: 'Program created successfully',
        updated: 'Program updated successfully',
        deleted: 'Program deleted successfully'
      },
      students: {
        title: 'Students',
        addStudent: 'Add Student',
        editStudent: 'Edit Student',
        studentName: 'Student Name',
        dateOfBirth: 'Date of Birth',
        gender: 'Gender',
        guardian: 'Guardian',
        created: 'Student created successfully',
        updated: 'Student updated successfully',
        deleted: 'Student deleted successfully'
      },
      guardians: {
        title: 'Guardians',
        addGuardian: 'Add Guardian',
        editGuardian: 'Edit Guardian',
        guardianName: 'Guardian Name',
        phone: 'Phone Number',
        students: 'Students',
        created: 'Guardian created successfully',
        updated: 'Guardian updated successfully',
        deleted: 'Guardian deleted successfully'
      },
      registrations: {
        title: 'Registrations',
        fullName: 'Full Name',
        parentName: 'Parent Name',
        program: 'Program',
        message: 'Message',
        pending: 'Pending',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
        approve: 'Approve',
        reject: 'Reject',
        updated: 'Registration status updated'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        dashboard: 'Tableau de bord',
        programs: 'Programmes',
        students: 'Étudiants',
        guardians: 'Tuteurs',
        registrations: 'Inscriptions',
        profile: 'Profil',
        logout: 'Déconnexion'
      },
      auth: {
        login: 'Connexion',
        register: "S'inscrire",
        email: 'E-mail',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        loginTitle: 'Bon retour',
        loginSubtitle: 'Connectez-vous à votre compte',
        registerTitle: 'Créer un compte',
        registerSubtitle: "S'inscrire en tant que tuteur",
        forgotPassword: 'Mot de passe oublié?',
        noAccount: "Vous n'avez pas de compte?",
        hasAccount: 'Vous avez déjà un compte?',
        signIn: 'Se connecter',
        signUp: "S'inscrire",
        guardianInfo: 'Informations du tuteur',
        studentInfo: "Informations de l'étudiant",
        guardianName: 'Nom du tuteur',
        guardianEmail: 'E-mail du tuteur',
        guardianPassword: 'Mot de passe du tuteur',
        studentName: "Nom de l'étudiant",
        studentEmail: 'E-mail étudiant (facultatif)',
        studentDateOfBirth: 'Date de naissance',
        studentGender: 'Genre',
        male: 'Masculin',
        female: 'Féminin',
        profile: {
          updateTitle: 'Informations de profil',
          changePasswordTitle: 'Changer le mot de passe',
          subtitle: 'Gérez vos informations personnelles et vos paramètres de sécurité.',
          currentPassword: 'Mot de passe actuel',
          newPassword: 'Nouveau mot de passe',
          confirmNewPassword: 'Confirmer le nouveau mot de passe'
        }
      },
      common: {
        loading: 'Chargement...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        view: 'Voir',
        create: 'Créer',
        update: 'Mettre à jour',
        search: 'Rechercher',
        filter: 'Filtrer',
        actions: 'Actions',
        status: 'Statut',
        date: 'Date',
        name: 'Nom',
        email: 'E-mail',
        phone: 'Téléphone',
        submit: 'Soumettre',
        close: 'Fermer',
        confirm: 'Confirmer',
        success: 'Succès',
        error: 'Erreur',
        warning: 'Avertissement',
        info: 'Information'
      },
      dashboard: {
        title: 'Tableau de bord',
        welcome: 'Bon retour',
        totalStudents: 'Total des étudiants',
        totalGuardians: 'Total des tuteurs',
        totalPrograms: 'Total des programmes',
        pendingRegistrations: 'Inscriptions en attente',
        recentActivity: 'Activité récente',
        quickActions: 'Actions rapides',
        addStudent: 'Ajouter un étudiant',
        addProgram: 'Ajouter un programme',
        viewReports: 'Voir les rapports'
      }
    }
  },
  ar: {
    translation: {
      nav: {
        dashboard: 'لوحة التحكم',
        programs: 'البرامج',
        students: 'الطلاب',
        guardians: 'أولياء الأمور',
        registrations: 'التسجيلات',
        profile: 'الملف الشخصي',
        logout: 'تسجيل الخروج'
      },
      auth: {
        login: 'تسجيل الدخول',
        register: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        loginTitle: 'مرحباً بك مرة أخرى',
        loginSubtitle: 'قم بتسجيل الدخول إلى حسابك',
        registerTitle: 'إنشاء حساب',
        registerSubtitle: 'التسجيل كولي أمر',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        hasAccount: 'لديك حساب بالفعل؟',
        signIn: 'دخول',
        signUp: 'إنشاء حساب',
        guardianInfo: 'معلومات ولي الأمر',
        studentInfo: 'معلومات الطالب',
        guardianName: 'اسم ولي الأمر',
        guardianEmail: 'بريد ولي الأمر الإلكتروني',
        guardianPassword: 'كلمة مرور ولي الأمر',
        studentName: 'اسم الطالب',
        studentEmail: 'بريد الطالب الإلكتروني (اختياري)',
        studentDateOfBirth: 'تاريخ الميلاد',
        studentGender: 'الجنس',
        male: 'ذكر',
        female: 'أنثى',
        profile: {
          updateTitle: 'معلومات الملف الشخصي',
          changePasswordTitle: 'تغيير كلمة المرور',
          subtitle: 'إدارة معلوماتك الشخصية وإعدادات الأمان.',
          currentPassword: 'كلمة المرور الحالية',
          newPassword: 'كلمة المرور الجديدة',
          confirmNewPassword: 'تأكيد كلمة المرور الجديدة'
        }
      },
      common: {
        loading: 'جاري التحميل...',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        edit: 'تعديل',
        view: 'عرض',
        create: 'إنشاء',
        update: 'تحديث',
        search: 'بحث',
        filter: 'فلترة',
        actions: 'الإجراءات',
        status: 'الحالة',
        date: 'التاريخ',
        name: 'الاسم',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        submit: 'إرسال',
        close: 'إغلاق',
        confirm: 'تأكيد',
        success: 'نجاح',
        error: 'خطأ',
        warning: 'تحذير',
        info: 'معلومات'
      },
      dashboard: {
        title: 'لوحة التحكم',
        welcome: 'مرحباً بك مرة أخرى',
        totalStudents: 'إجمالي الطلاب',
        totalGuardians: 'إجمالي أولياء الأمور',
        totalPrograms: 'إجمالي البرامج',
        pendingRegistrations: 'التسجيلات المعلقة',
        recentActivity: 'النشاط الأخير',
        quickActions: 'الإجراءات السريعة',
        addStudent: 'إضافة طالب',
        addProgram: 'إضافة برنامج',
        viewReports: 'عرض التقارير'
      }
    }
  }
}

// Configure i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  })

export default i18n
