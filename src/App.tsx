import Navbar from './Layout/Navbar';
import Footer from './Layout/Footer';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
