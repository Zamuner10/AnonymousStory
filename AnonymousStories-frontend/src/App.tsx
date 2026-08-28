import {useState} from 'react';
import {Home} from './pages/Home';
import {Login} from './pages/Login';
import Register from './pages/Register';

export default function App(){

  //Estado para controlar qual tela visivel na página
 const [currentPage, setCurrentPage] = useState('home');

  return (
    <main className="w-full min-h-screen" >
    {currentPage == 'home' && (
      <Home onNavigate={(page: string) => setCurrentPage(page)} />
    )}

    {currentPage == 'login' &&(
    <Login onNavigate={(page: string) => setCurrentPage(page)} />
    )}

    {currentPage == 'register' && (
      <Register onNavigate={(page: string) => setCurrentPage(page)} />
    )}

    </main>
  );
}