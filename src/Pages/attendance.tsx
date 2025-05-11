import { useEffect, useState, useCallback } from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { House } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { format } from 'date-fns';

interface AttendanceData {
  id: number;
  employee: number;
  check_in: string;
  check_out: string;
  working_hours: string;
  created_at: string;
  check_in_data: string;
  check_out_data: string;
  work_status_data: string;
}

interface AttendanceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttendanceData[];
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

const PAGE_SIZE = 7;
const DEBOUNCE_DELAY = 300;

const Attendance = () => {
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const fetchAttendances = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found');

      const queryParams = new URLSearchParams({
        search: searchTerm,
        limit: PAGE_SIZE.toString(),
        offset: ((currentPage - 1) * PAGE_SIZE).toString(),
      });

      const response = await fetch(
        `http://api.noventer.uz/api/v1/employee/attendances/?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch attendances: ${response.status}`);

      const data: AttendanceResponse = await response.json();
      setAttendances(data.results);
      setTotalCount(data.count);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch('http://api.noventer.uz/api/v1/employee/employees/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch employees: ${response.status}`);

      const data = await response.json();
      setEmployees(data.results || []);
    } catch (err: any) {
      console.error('Failed to fetch employees:', err);
      setError(err.message || 'Failed to fetch employee data');
    }
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  useEffect(() => {
    fetchAttendances();
    fetchEmployees();
  }, [fetchAttendances, fetchEmployees]);

  const getEmployeeName = (id: number) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
  };

  const formatDateTime = (s: string) => {
    try {
      return format(new Date(s), 'dd.MM.yyyy HH:mm');
    } catch {
      return '-';
    }
  };

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const renderPagination = () => {
    const visible = 5;
    let start = Math.max(1, currentPage - Math.floor(visible / 2));
    let end = Math.min(totalPages, start + visible - 1);
    if (end - start + 1 < visible) start = Math.max(1, end - visible + 1);

    return (
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">&laquo;</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">&lsaquo;</button>
        {Array.from({ length: end - start + 1 }, (_, i) => (
          <button
            key={start + i}
            onClick={() => handlePageChange(start + i)}
            disabled={loading}
            className={`px-3 py-1 rounded ${currentPage === start + i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {start + i}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">&rsaquo;</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || loading} className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50">&raquo;</button>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="flex h-[83.5vh] bg-[#F5F7FA] box-border">
        {/* Sidebar (simplified style) */}
        <aside className="w-[250px] border border-[#CBD0DD] bg-white">
          <ul className="p-6">
            {[
              { to: '/employees', label: "Xodimlar ro’yxati" },
              { to: '/attendance', label: "Xodimlar davomati" },
              { to: '/clients', label: 'Mijozlar' },
              { to: '/monthly', label: 'Oylik hisobot' },
            ].map(({ to, label }) => (
              <li key={to} className="pb-[20px]">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-[#525B75]'}`
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
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-[24px] font-semibold mb-4">Davoman hisoboti</h1>

          <div className="mb-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Xodim ID yoki nomi bo'yicha izlash"
              className="border p-2 rounded w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 p-4 bg-red-50 rounded">{error}</p>
          ) : (
            <>
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-[#F9FAFB] text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-6 py-3">Xodim</th>
                        <th className="px-6 py-3">Check-in</th>
                        <th className="px-6 py-3">Check-out</th>
                        <th className="px-6 py-3">Ish soatlari</th>
                        <th className="px-6 py-3">Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendances.length > 0 ? (
                        attendances.map((a) => (
                          <tr key={a.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{getEmployeeName(a.employee)}</td>
                            <td className="px-6 py-4">{formatDateTime(a.check_in)}</td>
                            <td className="px-6 py-4">{a.check_out ? formatDateTime(a.check_out) : '-'}</td>
                            <td className="px-6 py-4">{a.working_hours}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  a.work_status_data === 'Ishda'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {a.work_status_data}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            Ma'lumot topilmadi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {renderPagination()}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Attendance;
