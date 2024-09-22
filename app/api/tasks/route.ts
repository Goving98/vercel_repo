import { NextResponse } from 'next/server';
import jwt , {JwtPayload} from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import { hash, compare } from 'bcrypt';  // If you're doing authentication

// Environment Variables for JWT secret and MongoDB connection string
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.DATABASE_URL;
const dbName = process.env.MONGODB_DB;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!mongoUri || !dbName) {
  throw new Error('MongoDB URI or DB name not defined');
}

// Connect to MongoDB
let client: MongoClient;
async function connectToDB() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }
  
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
  }
  
  return client.db(dbName);
}

// Helper function to verify and extract userId from JWT
async function getUserIdFromToken(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Cast the decoded token to `JwtPayload` to safely access its properties
    const decodedToken = jwt.verify(token, jwtSecret as string) as JwtPayload;

    if (decodedToken && typeof decodedToken === 'object' && 'userId' in decodedToken) {
      return decodedToken.userId as string;
    } else {
      console.error('Invalid token payload:', decodedToken);
      return null;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}


// GET request to fetch all tasks for the authenticated user
export async function GET(request: Request) {
  const db = await connectToDB();
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tasks = await db.collection('tasks').find({ userId }).toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST request to create a new task for the authenticated user
export async function POST(request: Request) {
  const db = await connectToDB();
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, date, isCompleted } = await request.json();
    if (!title || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTask = {
      title,
      description,
      date,
      isCompleted: isCompleted || false,
      userId,
    };

    const result = await db.collection('tasks').insertOne(newTask);
    return NextResponse.json({ task: { ...newTask, id: result.insertedId } }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PUT request to update a task
export async function PUT(request: Request) {
  const db = await connectToDB();
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, title, description, date, isCompleted } = await request.json();
    if (!id || !title || !description || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatedTask = {
      title,
      description,
      date,
      isCompleted,
      userId,
    };

    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updatedTask }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE request to delete a task
export async function DELETE(request: Request) {
  const db = await connectToDB();
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(id), userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
