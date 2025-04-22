import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NextResponse } from 'next/server';

async function getUserFromRequest(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;
  
    const uid = authHeader.replace('Bearer ', '');
    return uid; 
  }
  
  export async function POST(request) {
    try {
      const uid = await getUserFromRequest(request);
      if (!uid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const body = await request.json();
      const { name, description } = body;
  
      if (!name) {
        return NextResponse.json({ error: 'Circle name is required' }, { status: 400 });
      }
  
      const docRef = await addDoc(collection(db, 'circles'), {
        name,
        description: description || '',
        createdBy: uid,
        createdAt: serverTimestamp(),
        members: [uid], 
      });
  
      return NextResponse.json({ id: docRef.id, message: 'Circle created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error creating circle:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}