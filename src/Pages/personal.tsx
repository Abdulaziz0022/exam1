import { useEffect, useState } from 'react'
import { Calendar, Coins, House, SquareUser, TvMinimal } from 'lucide-react'
import { Link } from 'react-router-dom'
import img from '../assets/img.png'
import object from '../assets/Object 1.png'
import first from '../assets/Rectangle.png'
import second from '../assets//Rectangle (1).png'

import Navbar from '../Layout/Navbar'
import Footer from '../Layout/Footer'

interface UserData {
  id: number
  full_name: string
  gender: string
  birth_date: string
  email: string
  role: string
  face_id: string | null
  company_id: number
  avatar: string | null
  salary_type: string
  phone_number: string
}

export default function Personal() {
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) return console.error('No token found')

      try {
        const res = await fetch(
          'https://api.noventer.uz/api/v1/accounts/me/',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!res.ok) throw new Error('Failed to fetch user')
        setUser(await res.json())
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  return (
    <div className="w-full h-[100vh] bg-[#F5F7FA] flex flex-col">
      <Navbar />

      <main className="flex h-full">
        <aside className="w-[250px] border border-[#CBD0DD] h-full bg-white">
          <ul className="p-6">
            {[
              { to: '/employees', label: "Xodimlar ro’yxati" },
              { to: '/attendance', label: "Xodimlar davomati" },
              { to: '/clients', label: 'Mijozlar' },
              { to: '/monthly', label: 'Oylik hisobot' },
            ].map(({ to, label }) => (
              <li key={to} className="pb-[20px]">
                <Link
                  to={to}
                  className="flex items-center gap-2 text-[#525B75] font-[400]"
                >
                  <House />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex-1 overflow-auto">
          <div
            className="w-[900px] h-[200px] border border-[#CBD0DD] rounded-2xl ml-[70px] mt-[30px] pl-[55px] flex items-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${img})` }}
          >
            <img src={object} alt="" className="absolute right-0 top-0" />
            {user ? (
              <>
                <img
                  src={user.avatar!}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-3xl object-cover flex-shrink-0 z-10"
                />

                <div className="ml-6 z-10">
                  <p className="text-[16px] font-[400] text-white">
                    Xush kelibsiz!
                  </p>
                  <h2 className="text-[36px] font-[700] mb-1 text-white">
                    {user.full_name}
                  </h2>
                  <p className="text-[15px] h-6 w-[60px] bg-white text-center font-normal rounded-sm">
                    {user.role === 'director' ? 'Rahbar' : user.role}
                  </p>
                </div>

                <div
                  className="w-[270px] h-[130px] rounded-2xl p-4 ml-[60px] z-10"
                  style={{
                    background: 'linear-gradient(90deg, #FFFFFF6B 0%, #B7B7B74D 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <p className="text-[12px] font-semibold text-white">
                    Finance card
                  </p>
                  <p className="text-[10px] font-medium text-white">
                    ID: 0989736
                  </p>
                  <p className="text-[12px] font-semibold text-white mt-[20px]">
                    Current balance:
                  </p>
                  <p className="text-[25px] font-bold text-white">
                    557 000 so’m
                  </p>
                  <img src={first} alt="" className='absolute left-0 bottom-0 rounded-2xl'/>
                  <img src={second} alt="" className='absolute top-0 right-0'/>

                </div>
              </>
            ) : (
              <p className="text-gray-600 ml-[70px] mt-[50px]">
                Foydalanuvchi ma’lumotlari yuklanmoqda...
              </p>
            )}
          </div>

          <div className="flex gap-10 ml-[70px] mt-[50px]">
   <div className="w-[270px] h-[120px] rounded-xl bg-white p-3 text-center">
     <div className='flex'>
       <TvMinimal className='absolute text-[#90A0B7]'/>
    <h2 className='text-[#90A0B7] mx-auto'>Vazifalar</h2>
     </div>
     <p className='text-[25px] font-medium mx-auto'> 0</p>
     <p>Group and individual</p>
     <p className='w-[40px] h-[10px] bg-[#F1F4F8] rounded-[10px] mx-auto mt-1.5'></p>
   </div>
            <div className="w-[270px] h-[120px] rounded-xl bg-white p-3 text-center">
             <div className='flex'>
                <Coins className='absolute text-[#90A0B7]'/>
              <h2 className='text-[#90A0B7] mx-auto'>Rasmiy oylik</h2>
             </div>
             <p className='text-[25px] font-medium mx-auto'>0 so'm</p>
             <p> 1 218 000 so’m</p>
               <p className='w-[40px] h-[10px] bg-[#F1F4F8] rounded-[10px] mx-auto mt-1.5'></p>
            </div>
            <div className="w-[270px] h-[120px] rounded-xl bg-white p-3 text-center">
                <div className='flex mx-auto'>
                    <Calendar className='absolute text-[#90A0B7]'/>
                 <h2 className='text-[#90A0B7] mx-auto'>Norasmin oylik</h2>
                </div>
               <div className='mx-auto'>
                 <p className='text-[25px] font-medium mx-auto'>0 so'm</p>
                <p> 1 218 000 so’m</p>
                  <p className='w-[40px] h-[10px] bg-[#F1F4F8] rounded-[10px] mx-auto mt-1.5'></p>
               </div>
            </div>
          </div>

          <div className="w-[800px] h-auto rounded-xl bg-white ml-[70px] mt-[50px] p-5">
            <h1 className="flex text-[16px] font-semibold gap-4">
              <SquareUser className="text-gray-500" />
              <span className="text-[#192A3E]">Malumotlar</span>
            </h1>

            {user ? (
              <div className="flex gap-[80px] mt-4 text-[16px] font-[500]">
                <div className="flex flex-col gap-2.5">
                  <p className="text-[16px] font-[400] text-[#525B75]">
                    Ism: {user.full_name}
                  </p>
                  <p className="text-[16px] font-[400] text-[#525B75]">
                    Email: {user.email}
                  </p>
                  <p className="text-[16px] font-[400] text-[#525B75]">
                    Tug'ilgan sana: {user.birth_date}
                  </p>
                  <p className="text-[16px] font-[400] text-[#525B75] capitalize">
                    Gender: {user.gender}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <p className="text-[16px] font-[400] text-[#525B75]">
                    Kompaniya nomi: NovEnter 
                  </p>
                  <p className="text-[16px] font-[400] text-[#525B75]">INN: 3211199123458</p>
                  <p className="text-[16px] font-[400] text-[#525B75] capitalize">
                    Lavozim: {user.role}
                  </p>
                  <p className="text-[16px] font-[400] text-[#525B75] capitalize">
                    Moliya kartasi: {user.salary_type}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 ml-[70px] mt-[50px] ">
                Foydalanuvchi ma’lumotlari yuklanmoqda...
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
