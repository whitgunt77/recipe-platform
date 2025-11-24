import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})

export function authHeader(token?: string){
  const t = token || localStorage.getItem('token')
  return t ? { Authorization: `Bearer ${t}` } : {}
}
