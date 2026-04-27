// app/api/set-token/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();
  
  const response = NextResponse.json({ success: true });
  
  // Set cookie para SSR
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: '/',
  });
  
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}