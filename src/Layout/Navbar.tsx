import { useEffect, useState } from 'react';
import logo from '../assets/Phoenix Logo.png';
import { Sun, Bell, Grip,    } from 'lucide-react';

interface UserData {
	id: number;
	full_name: string;
	gender: string;
	birth_date: string;
	email: string;
	role: string;
	face_id: string | null;
	company_id: number;
	avatar: string | null;
	salary_type: string;
	phone_number: string;
}

const Navbar = () => {
	const [user, setUser] = useState<UserData | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('accessToken');
			if (!token) {
				console.error('No token found');
				return;
			}

			try {
				const response = await fetch('https://api.noventer.uz/api/v1/accounts/me/', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
        console.log(response.url);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const data: UserData = await response.json();
				setUser(data);
			} catch (error) {
				console.error('Failed to fetch user:', error);
			}
		};


		fetchUser();
	}, []);

	const getInitial = (name: string | undefined) => {
		return name ? name.charAt(0).toUpperCase() : '?';
	};

	return (
    <header className="bg-white shadow-md p-4 mb-0.5">
      <div className="w-[100%] mx-auto flex items-center justify-between space-x-6">
        <div className="flex-shrink-0">
          <img src={logo} alt="Phoenix Logo" className="h-10" />
        </div>

        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-8 px-3 rounded-2xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <nav className="flex items-center space-x-4">
          <Sun className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <Bell className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
          <Grip className="h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer" />

          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitial(user?.full_name)
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar