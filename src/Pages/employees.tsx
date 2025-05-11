import { useEffect, useState } from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { House, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface UserData {
  full_name: string;
  gender: string;
  phone_number: string;
  passport_number: string;
  jshshr: string;
  birth_date: string;
  salary_type: string;
  salary: string;
}

interface EmployeeData {
  id: number;
  user: UserData;
  user_full_name: string;
  user_role: string;
  branch_id: number;
  department_id: number;
  shift_id: number;
  branch_name: string;
  branch_location: string;
  position: string;
  salary: string;
  official_salary: string;
  start_time: string;
  end_time: string;
}

interface EmployeesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeData[];
}

const BRANCHES = [
  { id: 2, name: 'Chilonzor filiali 1' },
  { id: 3, name: 'Yashnabod 1' },
  { id: 1, name: 'Uchtepa filiali 1' },
  { id: 4, name: 'Yunusobod filiali 1' },
  { id: 5, name: 'Sergeli filiali 1' },
  { id: 6, name: 'Sergeli filiali 2' },
  { id: 7, name: 'Sergeli filiali 3' },
  { id: 8, name: 'Sergeli filiali 4' },
  { id: 9, name: 'Sergeli filiali 5' },
  { id: 10, name: 'Sergeli filiali 6' },
  { id: 11, name: 'Sergeli filiali 7' },
  { id: 12, name: 'Sergeli filiali 8' },
  { id: 13, name: 'Sergeli filiali 9' },
];

const Employees = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const perPage = 7;

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found in localStorage');

        const response = await fetch(
          `https://api.noventer.uz/api/v1/employee/employees/branch/${selectedBranch}/?page=${currentPage}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EmployeesResponse = await response.json();
        setEmployees(data.results);
        setTotalCount(data.count);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [selectedBranch, currentPage]);

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <>
      <Navbar />
      <div className="flex h-[83.5vh] bg-[#F5F7FA] box-border">
        <aside className="w-[250px] border border-[#CBD0DD] bg-white">
          <ul className="p-6">
            {[
              { to: '/employees', label: "Xodimlar ro’yxati" },
              { to: '/attendance', label: "Xodimlar davomati" },
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

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-[24px] font-semibold">Xodimlar ro’yxati</h1>
            <div className="flex items-center gap-3">
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-2"
              >
                {BRANCHES.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded"
              >
                <Plus size={16} /> Yangi xodim
              </button>
            </div>
          </div>

          {loading ? (
            <p>Yuklanmoqda...</p>
          ) : error ? (
            <p className="text-red-500">Xatolik: {error}</p>
          ) : (
            <>
              <div className="bg-white border rounded-lg overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-[#F9FAFB] text-xs uppercase text-gray-500 border-b">
                    <tr>
                      <th className="px-6 py-3">F.I.SH</th>
                      <th className="px-6 py-3">Mobile Number</th>
                      <th className="px-6 py-3">Birth Date</th>
                      <th className="px-6 py-3">Filial nomi</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3 uppercase">jshshr</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="flex items-center px-6 py-4 gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              emp.user.full_name
                            )}`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="font-medium text-gray-900">{emp.user.full_name}</span>
                        </td>
                        <td className="px-6 py-4">{emp.user.phone_number}</td>
                        <td className="px-6 py-4">
                          {emp.user.birth_date
                            ? new Date(emp.user.birth_date).toLocaleDateString('uz-UZ')
                            : 'Noma’lum'}
                        </td>
                        <td className="px-6 py-4">{emp.branch_name}</td>
                        <td className="px-6 py-4">{emp.position}</td>
                        <td className="px-6 py-4">{emp.user.jshshr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                {Array.from({ length: totalPages || 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Yangi xodim qo’shish</h2>
            <p>Bu yerda xodim qo’shish formasi bo’ladi.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Employees;
