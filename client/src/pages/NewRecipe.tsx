import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api, authHeader } from '../api'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  title: string
  description?: string
  cookTime?: string
  tags?: string
  ingredients?: string
  steps?: string
  imageData?: string
}

const schema = yup.object({
  title: yup.string().required(),
  description: yup.string().optional()
})

export default function NewRecipe({ token }: { token?: string }){
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormValues>({ resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // convert ingredients and steps from textarea to arrays
    const payload: any = {
      title: data.title,
      description: data.description,
      cookTime: data.cookTime,
      tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
      ingredients: data.ingredients ? data.ingredients.split('\n').map(line => {
        const [amount, ...name] = line.split(' ')
        return { amount, name: name.join(' ') }
      }) : [],
      steps: data.steps ? data.steps.split('\n') : []
    }

    // If there's an image you can upload to Cloudinary via backend or attach data URL.
    try {
      const res = await api.post('/recipes', payload, { headers: authHeader(token) })
      navigate(`/recipes/${res.data._id}`)
    } catch (err: any) {
      alert(err.response?.data?.msg || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
      <label>Title <input {...register('title')} className="w-full p-2 border rounded" /></label>
      <label className="block mt-2">Description <textarea {...register('description')} className="w-full p-2 border rounded" /></label>
      <label className="block mt-2">Ingredients (one per line: \"1 cup sugar\") <textarea {...register('ingredients')} className="w-full p-2 border rounded" /></label>
      <label className="block mt-2">Steps (one per line) <textarea {...register('steps')} className="w-full p-2 border rounded" /></label>
      <label className="block mt-2">Tags (comma separated) <input {...register('tags')} className="w-full p-2 border rounded" /></label>
      <button type="submit" className="mt-4 p-2 bg-indigo-600 text-white rounded">Create</button>
    </form>
  )
}
