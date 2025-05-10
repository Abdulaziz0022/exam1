import { ArrowLeftToLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove tokens
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    // Redirect to login page
    navigate('/login')
  }
  return (
    <div className='border border-[#CBD0DD]'>
			<div className=' flex justify-between h-[60px] items-center'>	
		
			<div className="flex text-[#525B75] w-[250px] h-full border border-[#CBD0DD] pl-[25px] pr-[205px]">
  <p className="inline-flex items-center space-x-1 text-[15px] font-[600]" onClick={handleLogout}>
    <ArrowLeftToLine className='text-[#525B75]' />
    <span>Yopish</span>
  </p>
</div>

     <div className='flex  items-center justify-between h-full w-full pl-[30px] pr-[30px]'>
			 <p className="text-[16px] font-[400] whitespace-nowrap">
        crm.noventer platformasi NovEnter jamosi tomonidan yaratildi | 2025 ©{' '}
        <span className="text-[#3874FF]">NovEnter</span>
      </p>
			<p className='text-[16px] font-[400]'>v 1.0.0</p>
		 </div>
    </div>
		</div>
  )
}

export default Footer
