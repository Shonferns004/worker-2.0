import axios from 'axios';
import { BASE_URL } from './config';
import { supabase } from '@/config/supabase';

export const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }, 
});


api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});


