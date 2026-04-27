// lib/graphql/client.ts
import { GraphQLClient } from 'graphql-request';


// Cliente para el cliente (con localStorage)
export const createClientClient = () => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
  
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return new GraphQLClient(endpoint, { headers });
};