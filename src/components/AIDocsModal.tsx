import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, FileText, Code, Shield } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDocsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-4xl max-h-[80vh] glass-panel overflow-hidden rounded-[2rem] flex flex-col"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="text-brand-primary w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold">AI Integration Core</h2>
                  <p className="text-gray-500 text-sm">System Documentation v2.4.0</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-6">
                  <h3 className="text-brand-primary font-display font-bold text-lg flex items-center gap-2">
                    <Code className="w-5 h-5" /> Neural API Setup
                  </h3>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-sm overflow-x-auto">
                    <pre className="text-blue-400">
{`const nexus = new Nexus({
  apiKey: 'NX_PREVIEW_773',
  model: 'convergence-v4',
  latencyLevel: 'ultra'
});

await nexus.sync();`}
                    </pre>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Initialize the Nexus core by providing your unique Node Identity key. 
                    The convergence model handles cross-modal synthesis automatically.
                  </p>
                </section>

                <section className="space-y-6">
                  <h3 className="text-purple-400 font-display font-bold text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Security Protocols
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "End-to-end neural encryption.",
                      "Distributed node validation.",
                      "Zero-knowledge proof synthesis.",
                      "Quantum-resistant handshake."
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="md:col-span-2 glass-panel p-6 rounded-2xl border-brand-primary/20">
                  <div className="flex items-center gap-4 mb-4">
                    <Cpu className="text-brand-primary" />
                    <h4 className="font-bold">Real-time Generation Pipeline</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    The pipeline is optimized for mixed content promotion. It creates balanced 
                    visual assets, structural hierarchy, and predictive datasets in a singular 
                    asynchronous stream. Ensure your Node has at least 4.2 TFlops of free cycles.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10 text-center">
              <button className="px-6 py-2 bg-brand-primary text-black font-bold rounded-full text-sm">
                Request Full SDK Access
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
