import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';

interface DeptModalProps {
  dept: {
    title: string;
    description: string;
    color: string;
    icon: any;
  } | null;
  onClose: () => void;
}

export const DepartmentModal: React.FC<DeptModalProps> = ({ dept, onClose }) => {
  return (
    <AnimatePresence>
      {dept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl glass-panel p-12 rounded-[2.5rem] relative"
            style={{ borderLeft: `4px solid ${dept.color}` }}
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: `${dept.color}20` }}>
              <dept.icon className="w-8 h-8" style={{ color: dept.color }} />
            </div>

            <h2 className="text-4xl font-display font-bold mb-6">{dept.title} Deep Dive</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              {dept.description} Our primary focus in this sector revolves around the next generation 
              of mixed-content interaction. We are building the infrastructure that allows 
              physical hardware and neural software to communicate at a sub-millisecond level.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Current Load</div>
                <div className="text-xl font-bold">14.2 TB/s</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Active Nodes</div>
                <div className="text-xl font-bold">1,842</div>
              </div>
            </div>

            <button className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 group">
              Join Department R&D <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
