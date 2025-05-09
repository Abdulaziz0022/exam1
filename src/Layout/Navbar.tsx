import logo from '../assets/Phoenix Logo.png'
const Navbar = () => {
	return (
		<div>
			<ul>
				<li>
					<img src={logo} alt="" />
				</li>
				<li>
					<input type="text" placeholder='Search'/>
				</li>
				<li></li>
			</ul>
		</div>
	)
}

export default Navbar