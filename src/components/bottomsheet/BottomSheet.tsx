import { ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const y = useMotionValue(0);

  const handleDragEnd = (_: any, info: { velocity: { y: number }; point: { y: number } }) => {
    const closeThreshold = 120;
    if (info.point.y > closeThreshold || info.velocity.y > 800) {
      onClose;
      y.set(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 max-h-[70vh] w-full rounded-t-2xl bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1)]"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* drag 핸들 */}
          <motion.div
            className="mx-auto mt-2 mb-1 h-1.5 w-10 rounded-full bg-gray-300"
            drag="y"
            dragConstraints={{ top: 0, bottom: 1000 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
          />

          {/* 컨텐츠 (여기는 터치 스크롤 가능) */}
          <div className="max-h-[70vh] overflow-y-auto px-4 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
