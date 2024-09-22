import { NextResponse } from 'next/server';

const tasks = [
  { id: '1', title: 'Task 1', description: 'Description 1' },
  { id: '2', title: 'Task 2', description: 'Description 2' },
];

export async function GET() {
  return NextResponse.json(tasks);
}
