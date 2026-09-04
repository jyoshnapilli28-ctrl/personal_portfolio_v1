export interface Skill {
  name: string;
  icon?: string; // filename from assets/icons/ e.g. "react.svg"
}

export interface SkillGroup {
  groupName: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    groupName: "Programming Languages",
    skills: [
      { name: "C", icon: "c.svg" },
      { name: "C++", icon: "cpp.svg" },
      { name: "Java", icon: "java.svg" },
      { name: "Python", icon: "python.svg" },
      { name: "JavaScript", icon: "javascript.svg" },
      { name: "TypeScript" },
    ],
  },
  {
    groupName: "Frontend Development",
    skills: [
      { name: "HTML5", icon: "html5.svg" },
      { name: "CSS3", icon: "css3.svg" },
      { name: "React", icon: "react.svg" },
      { name: "Tailwind CSS" },
      { name: "Responsive Design" },
    ],
  },
  {
    groupName: "Full Stack & Backend",
    skills: [
      { name: "Node.js", icon: "nodejs.svg" },
      { name: "REST APIs" },
      { name: "Full Stack Development" },
    ],
  },
  {
    groupName: "Motion & Interaction",
    skills: [
      { name: "GSAP" },
      { name: "ScrollTrigger" },
      { name: "CSS Animations" },
      { name: "3D Web" },
      { name: "Micro-interactions" },
    ],
  },
  {
    groupName: "Computer Science Core",
    skills: [
      { name: "Data Structures" },
      { name: "Algorithms" },
      { name: "Problem Solving" },
      { name: "Logical Thinking" },
    ],
  },
  {
    groupName: "Tools & Platforms",
    skills: [
      { name: "Git", icon: "git.svg" },
      { name: "GitHub", icon: "github.svg" },
      { name: "Figma", icon: "figma.svg" },
      { name: "VS Code" },
      { name: "AWS", icon: "aws.svg" },
    ],
  },
  {
    groupName: "Emerging Technologies",
    skills: [
      { name: "Quantum Computing" },
      { name: "Artificial Intelligence" },
      { name: "Machine Learning" },
      { name: "Cloud Computing" },
    ],
  },
];
