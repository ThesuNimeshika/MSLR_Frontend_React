import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import PluginDemo from './PluginDemo'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4">
            MSL Recruitment Portal
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Empowering the next generation of logistics experts.
            Streamline your recruitment process with state-of-the-art technology.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="glass p-8 rounded-2xl shadow-xl w-full max-w-md">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
              Candidates Found: {count}
            </button>
            <p className="mt-4 text-slate-500 italic">
              Click the button to simulate recruitment count
            </p>
          </div>
        </div>

        <PluginDemo />
      </div>
    </>
  )
}

export default App
