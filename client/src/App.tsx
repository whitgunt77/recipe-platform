import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import RecipePage from './pages/RecipePage'
import NewRecipe from './pages/NewRecipe'
import Login from './pages/Login'
import Profile from './pages/Profile'

export default function App(){
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const setAuth = (t: string | null) => {
    setToken(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-6 max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Whitney Gunter</Link>
        <nav className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/new">New Recipe</Link>
          {token ? <button onClick={()=> setAuth(null)}>Sign out</button> : <Link to="/login">Sign in</Link>}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes/:id" element={<RecipePage token={token} />} />
          <Route path="/new" element={<NewRecipe token={token} />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/profile" element={<Profile token={token} />} />
        </Routes>
      </main>
    </div>
  )
}
