import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

type Recipe = {
  _id: string
  title: string
  description?: string
  imageUrl?: string
  author?: { name?: string }
}

export default function Home(){
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [q, setQ] = useState('')

  useEffect(()=> {
    fetchRecipes()
  }, [])

  async function fetchRecipes(){
    const res = await api.get('/recipes')
    setRecipes(res.data)
  }

  async function handleSearch(e: React.FormEvent){
    e.preventDefault()
    const res = await api.get('/recipes', { params: { q } })
    setRecipes(res.data)
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search recipes..." className="p-2 border rounded-md" />
        <button className="ml-2 p-2 bg-indigo-600 text-white rounded">Search</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recipes.map(r => (
          <motion.article key={r._id} layout className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            {r.imageUrl && <img src={r.imageUrl} alt={r.title} className="w-full h-40 object-cover rounded mb-3" />}
            <h3 className="text-lg font-semibold"><Link to={`/recipes/${r._id}`}>{r.title}</Link></h3>
            <p className="mt-2 text-sm">{r.description}</p>
            <p className="mt-2 text-xs text-gray-500">By {r.author?.name || 'Unknown'}</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
