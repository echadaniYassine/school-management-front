// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to School Management System 🎓</h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-6">
        Manage students, guardians, programs, and registrations in one place.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
        >
          Register
        </a>
      </div>
    </div>
  )
}
