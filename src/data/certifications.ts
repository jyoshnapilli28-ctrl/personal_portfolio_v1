export interface Certification {
  year: string;
  title: string;
  organization: string;
  description: string;
}

export const certifications: Certification[] = [
  {
    year: "2026",
    title: "AWS Student Builder Club Membership",
    organization: "AWS Student Builder Club, SRM|RMP",
    description: "Active member exploring cloud infrastructure, practical serverless architecture, and engaging in collaborative student tech initiatives.",
  },
  {
    year: "2026",
    title: "Singularity Student Lab Membership",
    organization: "Singularity Advanced Research Lab",
    description: "Active research member exploring foundational artificial intelligence models, quantum state systems, and advanced computing paradigms.",
  },
  {
    year: "2025",
    title: "Computer Science & Engineering Core Foundations",
    organization: "SRM University, AP",
    description: "Academic excellence in Data Structures, Algorithms in C/C++/Java, Computer Architecture, and Modern Full-Stack Web Development.",
  },
];
