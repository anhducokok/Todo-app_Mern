import {BrowserRouter, Routes, Route} from 'react-router'
import {Toaster} from 'sonner';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
function App() {

  return (
    <>
    <Toaster richColors />
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}



export default App
