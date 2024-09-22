// import prisma from "@/app/utils/connect";
import { getServerSession } from "next-auth/next";  // Adjust based on your NextAuth setup
import { authOptions } from "@/app/api/tasks/[...nextauth]"; // Make sure the path is correct
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions); // Get session from NextAuth

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const { title, description, date, completed, important } = await req.json();

    if (!title || !description || !date) {
      return NextResponse.json({
        error: "Missing required fields",
        status: 400,
      });
    }

    if (title.length < 3) {
      return NextResponse.json({
        error: "Title must be at least 3 characters long",
        status: 400,
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        date,
        isCompleted: completed,
        isImportant: important,
        userId: "unauthenticated-user", // Assuming session user has an id field
      },
    });
    console.log("Task is:",task);

    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR CREATING TASK: ", error);
    return NextResponse.json({ error: "Error creating task", status: 500 });
  }
}

// Fetch tasks for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: "unauthenticated-user", // Use session user id
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("ERROR GETTING TASKS: ", error);
    return NextResponse.json({ error: "Error getting tasks", status: 500 });
  }
}

// Update task completion status
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { isCompleted, id } = await req.json();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: {
        isCompleted,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("ERROR UPDATING TASK: ", error);
    return NextResponse.json({ error: "Error updating task", status: 500 });
  }
}
