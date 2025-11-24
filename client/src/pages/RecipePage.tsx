import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api, authHeader } from '../api'

export default function RecipePage({ token }:{ token?:string }){
  const { id } = useParams<{ id: string }>()
  const [recipe, setRecipe] = useState<any>(null)

  useEffect(()=> { if (id) load() }, [id])
  async function load(){
    const res = await api.get(`/recipes/${id}`)
    setRecipe(res.data)
  }

  async function toggleLike(){
    try {
      await api.post(`/recipes/${id}/like`, {}, { headers: authHeader(token) })
      load()
    } catch (err:any) { alert(err.response?.data?.msg || err.message) }
  }

  if (!recipe) return <div>Loading...</div>
  return (
    <div>
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      {recipe.imageUrl && <img src={recipe.imageUrl} className="w-full h-80 object-cover rounded mt-4" />}
      <p className="mt-4">{recipe.description}</p>
      <h3 className="mt-6 font-semibold">Ingredients</h3>
      <ul className="list-disc ml-6 mt-2">{recipe.ingredients.map((i:any, idx:number)=> <li key={idx}>{i.amount} {i.name}</li>)}</ul>
      <h3 className="mt-6 font-semibold">Steps</h3>
      <ol className="list-decimal ml-6 mt-2">{recipe.steps.map((s:string, idx:number)=><li key={idx}>{s}</li>)}</ol>

      <div className="mt-6">
        <button onClick={toggleLike} className="p-2 bg-indigo-600 text-white rounded">Like ({recipe.likes?.length || 0})</button>
      </div>
    </div>
  )
}
