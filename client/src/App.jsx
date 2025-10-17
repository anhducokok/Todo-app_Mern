import {BrowserRouter, Routes, Route} from 'react-router'
import {Toaster} from 'sonner';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Pomodoro from './pages/Pomodoro';
function App() {

  return (
    <>
    <Toaster richColors />
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/Pomodoro' element={<Pomodoro />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}



export default App
