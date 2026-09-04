export interface Project {
  number: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
}

export const projects: Project[] = [
  {
    number: "01",
    name: "Portfolio_P1",
    category: "Frontend / Full Stack",
    description: "A premium cinematic developer portfolio built with React, TypeScript, Tailwind CSS, GSAP, and interactive 3D visuals. Demonstrating advanced frontend engineering through design systems, motion, and spatial interaction.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GSAP", "CSS 3D"],
    githubUrl: "https://github.com/jyoshnapilli28-ctrl",
    liveUrl: "#",
  },
  {
    number: "02",
    name: "QuantumState Visualizer",
    category: "Quantum / Simulation",
    description: "An interactive quantum computing state simulator demonstrating qubit superposition, Bloch sphere state transformations, and quantum gate operations designed during research exploration at Singularity Lab.",
    technologies: ["Python", "JavaScript", "CSS 3D", "Quantum Computing"],
    githubUrl: "https://github.com/jyoshnapilli28-ctrl",
    liveUrl: "#",
  },
  {
    number: "03",
    name: "CloudScale Engine",
    category: "Cloud / Backend",
    description: "A cloud task runner and event orchestration project built through AWS Student Builder Club, featuring serverless compute handlers, decoupled event queues, and automated deployment monitors.",
    technologies: ["AWS", "Node.js", "Python", "REST APIs"],
    githubUrl: "https://github.com/jyoshnapilli28-ctrl",
    liveUrl: "#",
  },
];
