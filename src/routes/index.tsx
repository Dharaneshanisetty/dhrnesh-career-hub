import { createFileRoute } from "@tanstack/react-router";
import { CareerApp } from "@/components/career-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerHub — AI Job Application Tracker" },
      { name: "description", content: "Track applications, discover matched roles, and accelerate your career in one intelligent workspace." },
      { property: "og:title", content: "CareerHub — AI Job Application Tracker" },
      { property: "og:description", content: "Your intelligent workspace for every career opportunity." },
    ],
  }),
  component: Index,
});

function Index() {
  return <CareerApp />;
}
