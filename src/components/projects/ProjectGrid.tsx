import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../types';

interface ProjectGridProps {
  projects: Project[];
  isAdmin: boolean;
  onDonate: (project: Project, amount?: number) => void;
  onAddProject: () => void;
}

export function ProjectGrid({ projects, isAdmin, onDonate, onAddProject }: ProjectGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex justify-between items-end mb-12">
        <div className="border-r-4 border-[#8B7355] pr-6">
          <h2 className="text-3xl font-bold mb-1">پروژه‌های فعال امدادی</h2>
          <p className="text-stone-500">محل جهاد خود را انتخاب کنید و در این اجر عظیم سهیم شوید.</p>
        </div>
        {isAdmin && (
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 px-5 py-3 bg-[#8B7355] text-white rounded-2xl font-bold hover:bg-[#705D45] transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            پروژه جدید
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">هنوز پروژه‌ای ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDonate={(amount) => onDonate(project, amount)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
