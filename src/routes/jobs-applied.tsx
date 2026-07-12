import { createFileRoute } from "@tanstack/react-router";
import { CareerApp } from "@/components/career-app";

export const Route = createFileRoute("/jobs-applied")({
  component: CareerApp,
});
