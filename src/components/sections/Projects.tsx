import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 데이터는 나중에 JSON 파일로 분리하면 관리가 더 쉽습니다.
const projects = [
  {
    title: "포트폴리오 웹사이트",
    description:
      "Astro와 React, Shadcn UI를 활용하여 제작한 개인 포트폴리오 사이트입니다. GitHub Actions를 통해 자동 배포를 구현했습니다.",
    tags: ["Astro", "React", "TypeScript", "Tailwind"],
    link: "https://github.com/Watchiiee/my-portfolio", // 본인 리포지토리 주소
  },
  {
    title: "프로젝트 예시 2",
    description: "아직 준비중인 프로젝트입니다. 여기에 설명을 적어주세요.",
    tags: ["Next.js", "Supabase"],
    link: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                자세히 보기 →
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
