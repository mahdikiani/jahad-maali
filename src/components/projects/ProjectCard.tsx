import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../shared/ProgressBar';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onDonate: (amount?: number) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  shelter: 'سرپناه',
  food: 'غذا و معیشت',
  medical: 'درمان',
  education: 'آموزش',
  defense: 'دفاع و تجهیزات',
  other: 'سایر',
};

export function ProjectCard({ project, onDonate }: ProjectCardProps) {
  const progress = Math.min((project.current_amount / project.target_amount) * 100, 100);
  const remaining = Math.max(project.target_amount - project.current_amount, 0);
  const quickAmounts = [50000, 100000, 500000];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-[32px] overflow-hidden border border-[#E5DED0] shadow-sm flex flex-col h-full"
    >
      <div className="relative h-56">
        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#8B7355] text-white">
            {CATEGORY_LABELS[project.category] || 'سایر'}
          </span>
          {project.status === 'completed' && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-600 text-white">تکمیل شده</span>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 leading-snug">{project.title}</h3>
        <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-1">{project.description}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-2xl font-black text-stone-900">{project.current_amount.toLocaleString('fa-IR')}</span>
                <span className="text-stone-400 text-xs mr-1">از {project.target_amount.toLocaleString('fa-IR')} تومان</span>
              </div>
              <span className="text-sm font-bold text-[#8B7355]">{Math.round(progress)}٪</span>
            </div>
            <ProgressBar value={progress} />
            {remaining > 0 && (
              <p className="text-xs text-stone-400">
                <span className="text-[#8B7355] font-bold">{remaining.toLocaleString('fa-IR')} تومان</span> تا تکمیل
              </p>
            )}
          </div>

          {project.status === 'active' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => onDonate(amt)}
                    className="py-2 text-[10px] font-bold bg-[#F5F2ED] text-[#8B7355] rounded-xl hover:bg-[#E5DED0] transition-colors border border-[#E5DED0]"
                  >
                    {(amt / 1000).toLocaleString('fa-IR')}هت
                  </button>
                ))}
              </div>
              <button
                onClick={() => onDonate()}
                className="w-full py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 group"
              >
                مشارکت در این امر خیر
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
