import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../Layout/Navbar'
import Footer from '../Layout/Footer'
import { House, Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface Branch {
  id: number
  name: string
  region: string
  district: string
  phone: string
  additional_phone: string | null
  address: string
  latitude: string | null
  longitude: string | null
  working_days: string[]
}

interface Shift {
  id: number
  name: string
  branch: number
  start_time: string
  end_time: string
}

const Shifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const [form, setForm] = useState({
    name: '',
    branch: '',
    start_time: '',
    end_time: '',
  })

  // Hardcoded branches list
  const [branches] = useState<Branch[]>([
    { id: 2, name: 'Chilonzor filiali 1', region: '1', district: '1', phone: '+998912345678', additional_phone: '+99893952123', address: "Foziltepa ko'chasi, 22-B uy", latitude: '49.200000', longitude: '69.200000', working_days: [] },
    { id: 3, name: 'Yashnabod 1', region: 'Toshkent shahri', district: 'Sergeli tumani', phone: '+998931234567', additional_phone: null, address: 'Yashnabod tumani ,', latitude: '41.210000', longitude: '69.220000', working_days: [] },
    { id: 1, name: 'Uchtepa filiali 1', region: '1', district: '1', phone: '+998912345678', additional_phone: '+998939542122', address: "Foziltepa ko'chasi, 22-B uy", latitude: '49.200000', longitude: '69.200000', working_days: [] },
    { id: 6, name: 'Chilonzor filiali', region: 'Toshkent shahri', district: 'Chilonzor tumani', phone: '+998917654123', additional_phone: '+998917654123', address: 'Chilonzor filiali', latitude: null, longitude: null, working_days: [] },
    { id: 7, name: 'Mirobod filiali', region: 'Samarqand viloyati', district: 'Jomboy tumani', phone: '+998717777777', additional_phone: '+998717777777', address: "Mirobod tumani Amirobod ko'chasi", latitude: null, longitude: null, working_days: [] },
    { id: 8, name: 'Yangi', region: 'Toshkent shahri', district: 'Uchtepa tumani', phone: '+998939542111', additional_phone: null, address: 'dsfsfsffs', latitude: '41.290000', longitude: '69.170000', working_days: [] },
  ])

  // Fetch shifts from API
  const fetchShifts = () => {
    setLoading(true)
    axios
      .get('https://api.noventer.uz/api/v1/company/shifts/')
      .then((res) => {
        setShifts(res.data.shifts || res.data || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  // Initial fetch
  useEffect(() => {
    fetchShifts()
  }, [])

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Add shift with validation
  const handleAddShift = () => {
    if (!form.name || !form.branch || !form.start_time || !form.end_time) {
      alert("Iltimos, barcha maydonlarni to'ldiring.")
      return
    }

    const payload = {
      name: form.name,
      branch: Number(form.branch),
      start_time: form.start_time,
      end_time: form.end_time,
    }

    axios
      .post('https://api.noventer.uz/api/v1/company/shift-create/', payload)
      .then(() => {
        fetchShifts()
        setModalOpen(false)
        setForm({ name: '', branch: '', start_time: '', end_time: '' })
      })
      .catch((err) => console.error(err))
  }

  // Simple time formatting
  const formatTime = (time: string) => time?.slice(0, 5)

  // Grouping shifts by branch
  const groupedShifts = shifts.reduce((acc: Record<number, { branch_name: string; shifts: Shift[] }>, shift) => {
    if (!acc[shift.branch]) {
      const branch = branches.find((b) => b.id === shift.branch)
      acc[shift.branch] = {
        branch_name: branch?.name || 'Nomaʼlum filial',
        shifts: [],
      }
    }
    acc[shift.branch].shifts.push(shift)
    return acc
  }, {})

  return (
    <>
      <Navbar />
      <div className="flex h-[83.5vh] bg-[#F5F7FA] box-border">
        {/* Sidebar */}
        <aside className="w-[250px] border border-[#CBD0DD] bg-white">
          <ul className="p-6">
            {[
              { to: '/employees', label: "Xodimlar ro’yxati" },
              { to: '/attendance', label: 'Xodimlar davomati' },
              { to: '/clients', label: 'Mijozlar' },
              { to: '/shifts', label: 'Smenalar' },
            ].map(({ to, label }) => (
              <li key={to} className="pb-[20px]">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 font-[400] ${
                      isActive ? 'text-blue-500' : 'text-[#525B75]'
                    }`
                  }
                >
                  <House />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[24px] font-semibold">Smenalar</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={16} />
              Smena qo‘shish
            </button>
          </div>

          {loading ? (
            <p>Yuklanmoqda...</p>
          ) : (
            Object.entries(groupedShifts).map(([branchId, data]) => (
              <div key={branchId} className="mb-8">
                <h2 className="text-xl font-semibold mb-3 text-blue-600">{data.branch_name}</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-xl mb-6">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b text-left">#</th>
                        <th className="py-2 px-4 border-b text-left">Nomi</th>
                        <th className="py-2 px-4 border-b text-left">Boshlanish</th>
                        <th className="py-2 px-4 border-b text-left">Tugash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.shifts.map((shift, index) => (
                        <tr key={shift.id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b">{index + 1}</td>
                          <td className="py-2 px-4 border-b">{shift.name}</td>
                          <td className="py-2 px-4 border-b">{formatTime(shift.start_time)}</td>
                          <td className="py-2 px-4 border-b">{formatTime(shift.end_time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <Footer />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Yangi smena qo‘shish</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Smena nomi"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              >
                <option value="">Filialni tanlang</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="border rounded px-3 py-2"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAddShift}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Qo‘shish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Shifts
