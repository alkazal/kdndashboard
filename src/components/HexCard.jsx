import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useDashboardStore } from "../store/dashboardStore";

export default function HexCard({ title, value }) {
  const cardRef = useRef(null);

  const selectedCategory = useDashboardStore(s => s.selectedCategory);
  const setCategory = useDashboardStore(s => s.setCategory);

  const isSelected = selectedCategory === title;

  // Hover animation (only if NOT selected)
  const handleEnter = () => {
    if (isSelected) return;

    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.03,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleLeave = () => {
    if (isSelected) return;

    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  // Selected / unselected animation
  useEffect(() => {
    if (isSelected) {
      gsap.to(cardRef.current, {
        y: -6,
        scale: 1.05,
        boxShadow: "0 20px 30px rgba(0,0,0,0.12)",
        borderColor: "#0d9488",
        duration: 0.3,
        ease: "power3.out"
      });
    } else {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        borderColor: "transparent",
        duration: 0.25,
        ease: "power2.out"
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={cardRef}
      onClick={() => setCategory(title)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="cursor-pointer bg-white rounded-xl shadow p-6 border-2"
    >
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}