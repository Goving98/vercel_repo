"use client";
import Image from "next/image";
import Task from "./Components/Tasks/Tasks";
import { useGlobalState } from "./context/globalProvider";
export default function Home() {
  const { tasks } = useGlobalState();

  return <Task title="All Tasks" tasks={tasks} />;
}
