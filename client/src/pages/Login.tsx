import React from 'react'
import { useForm } from 'react-hook-form'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login({ setAuth }:{ setAuth: (token:string)=>void }){
  const { register, handleSubmit } = useForm()
  const nav = useNavigate()

  async function onSubmit(data:any){
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.token)
      nav('/')
    } catch (err:any) {
      alert(err.response?.data?.msg || err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <input {...register('email')} placeholder="Email" className="w-full p-2 border mb-2" />
      <input {...register('password')} placeholder="Password" type="password" className="w-full p-2 border mb-2" />
      <button className="p-2 bg-indigo-600 text-white rounded">Sign in</button>
    </form>
  )
}
