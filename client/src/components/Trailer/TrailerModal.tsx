import React, { useEffect } from "react";
import styles from "./TrailerModal.module.scss";

interface TrailerModalProps {
  open: boolean;
  onClose: () => void;
  trailerUrl: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ open, onClose, trailerUrl }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <iframe src={trailerUrl} title="Trailer" allow="autoplay; encrypted-media" allowFullScreen />
      </div>
    </div>
  );
};

export default TrailerModal;
