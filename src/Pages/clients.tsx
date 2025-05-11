import { useEffect, useState } from 'react';
import Navbar from '../Layout/Navbar';
import Footer from '../Layout/Footer';
import { House, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

interface ClientData {
  id: number;
  branch: number;
  branch_name: string;
  name: string;
  phone: string;
  avatar: string;
  license_file: string;
  created_at: string;
  updated_at: string;
}

interface ClientsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ClientData[];
}

interface NewClientData {
  name: string;
  phone: string;
  branch: number | null;
}

const Clients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState<NewClientData>({
    name: '',
    phone: '',
    branch: null,
  });

  useEffect(() => {
    axios
      .get<ClientsResponse>('https://api.noventer.uz/api/v1/company/clients/')
      .then((res) => {
        const allClients = res.data.results;
        setClients(allClients);

        // Extract unique branch names
        const branchSet = new Set(allClients.map((c) => c.branch_name));
        setBranches(['all', ...Array.from(branchSet)]);
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewClientData((prev) => ({
      ...prev,
      branch: Number(e.target.value),
    }));
  };

  const handleAddClient = () => {
  axios
    .post(
      'https://api.noventer.uz/api/v1/company/clients/',
      newClientData,
      {
        headers: {
          'Content-Type': 'application/json', // Ensure the server expects JSON
        },
      }
    )
    .then((res) => {
      setClients((prevClients) => [...prevClients, res.data]);
      setModalOpen(false); // Close the modal
      setNewClientData({ name: '', phone: '', branch: null }); // Reset form
    })
    .catch((err) => {
      console.error('Error adding client:', err);
    });
};


  const filteredClients =
    selectedBranch === 'all'
      ? clients
      : clients.filter((c) => c.branch_name === selectedBranch);

  return (
    <>
      <Navbar />
      <div className="flex h-[83.5vh] bg-[#F5F7FA]">
        <aside className="w-[250px] border border-[#CBD0DD] bg-white">
          <ul className="p-6">
            {[{ to: '/employees', label: "Xodimlar ro’yxati" }, { to: '/attendance', label: 'Xodimlar davomati' }, { to: '/clients', label: 'Mijozlar' }, { to: '/shifts', label: 'Smenalar' }].map(({ to, label }) => (
              <li key={to} className="pb-[20px]">
                <NavLink
                  to={to}
                  className={({ isActive }) => `flex items-center gap-2 font-[400] ${isActive ? 'text-blue-500' : 'text-[#525B75]'}`}
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
            <h1 className="text-[24px] font-semibold">Mijozlar hisoboti</h1>

            {/* Add New Client Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Plus size={16} />
              Mijoz qo‘shish
            </button>

            {/* Branch Filter */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border rounded bg-white text-black"
            >
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch === 'all' ? 'Barcha filiallar' : branch}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Yuklanmoqda...</p>
          ) : filteredClients.length === 0 ? (
            <p>Ushbu filialda mijozlar topilmadi.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-md shadow">
                <thead className="bg-[#E4E9F2] text-left">
                  <tr>
                    <th className="px-4 py-3 border-b">Ism</th>
                    <th className="px-4 py-3 border-b">Telefon</th>
                    <th className="px-4 py-3 border-b">Filial</th>
                    <th className="px-4 py-3 border-b">Ro'yxatga olingan sana</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b">{client.name}</td>
                      <td className="px-4 py-2 border-b">{client.phone}</td>
                      <td className="px-4 py-2 border-b">{client.branch_name}</td>
                      <td className="px-4 py-2 border-b">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {/* Modal for adding a new client */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Yangi mijoz qo‘shish</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Mijoz ismi"
                value={newClientData.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Telefon raqami"
                value={newClientData.phone}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <select
                name="branch"
                value={newClientData.branch || ''}
                onChange={handleBranchChange}
                className="border p-2 rounded"
              >
                <option value="">Filial tanlang</option>
                {branches
                  .filter((branch) => branch !== 'all')
                  .map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={handleAddClient}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Qo‘shish
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clients;
