import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import img from '../assets/IMAGE.png'
import logo from '../assets/logo.png'

const Login: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      navigate('/')
    }
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || !password) {
      toast.error('Telefon raqam va parol kiritilishi shart')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'https://api.noventer.uz/api/v1/accounts/login/',
        {
          phone_number: phone.replace(/\s/g, ''),
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

     const tokens = response.data?.data?.tokens

			if (tokens?.access && tokens?.refresh) {
				localStorage.setItem('accessToken', tokens.access)
				localStorage.setItem('refreshToken', tokens.refresh)
        navigate('/')
      } else {
        toast.error('Tokenlar olinmadi, qaytadan urinib ko‘ring')
      }
    } catch (error) {
      let msg = 'Tizimga kirishda xatolik yuz berdi'

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          msg = "Noto'g'ri telefon raqam yoki parol"
        } else if (error.response?.data?.message) {
          msg = error.response.data.message
        } else if (error.request) {
          msg = "Server bilan bog'lanib bo'lmadi. Internetni tekshiring."
        }
      }

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full">
        <img src={img} alt="CRM Visual" className="w-full h-full" />
      </div>

      <div className="w-1/2 h-full flex flex-col justify-center items-center bg-white px-10">
        <img src={logo} alt="NovEnter Logo" className="w-16 mb-4" />
        <h1 className="text-2xl font-bold mb-1">NovEnter</h1>
        <p className="text-base font-normal text-center mb-6">
          Crm tizim bilan biznesingizni rivojlantiring
        </p>

        <form onSubmit={handleLogin} className="flex flex-col w-[350px]">
          <input
            type="text"
            placeholder="Telefon raqamingizni kiriting"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          />
          <input
            type="password"
            placeholder="Parolingizni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          />
          <button
            type="submit"
            className="h-[40px] bg-blue-600 text-white font-bold rounded-md mb-3 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Kirish...' : 'Tizimga kirish'}
          </button>
        </form>

        <p
          className="text-sm font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/register')}
        >
          Ro’yxatdan o’tish
        </p>
      </div>
    </div>
  )
}

export default Login
