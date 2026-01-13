import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDashboardStore } from "../store/dashboardStore";
import { DocumentIcon, CogIcon, BookOpenIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function KPIBlock({ label, value, category }) {
  const ref = useRef();
  const outerRef = useRef();
    const openDrilldown = useDashboardStore((s) => s.openDrilldown);
    
    const selectedCategory = useDashboardStore(s => s.selectedCategory);

    const isSelected = selectedCategory === category;

    const getCategoryIcon = (cat) => {
      switch (cat) {
        case 'PP':
          return DocumentIcon;
        case 'LMC':
          return CogIcon;
        case 'LMCQ':
          return BookOpenIcon;
        case 'PRUF':
          return CheckCircleIcon;
        default:
          return DocumentIcon;
      }
    };

    const IconComponent = getCategoryIcon(category);

    const handleEnter = () => {
        if (isSelected) return;

        gsap.to(outerRef.current, {
        y: -4,
        scale: 1.03,
        duration: 0.2,
        ease: "power2.out"
        });
    };

    const handleLeave = () => {
        if (isSelected) return;

        gsap.to(outerRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
        });
    };

    // Selected / unselected animation
    useEffect(() => {
        if (isSelected) {
        gsap.to(outerRef.current, {
            y: -6,
            scale: 1.05,
            boxShadow: "0 20px 30px rgba(0,0,0,0.12)",
            borderColor: "#0d9488",
            duration: 0.3,
            ease: "power3.out"
        });
        } else {
        gsap.to(outerRef.current, {
            y: 0,
            scale: 1,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            borderColor: "transparent",
            duration: 0.25,
            ease: "power2.out"
        });
        }
    }, [isSelected]);
    
  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      { innerText: 0 },
      {
        innerText: value,
        duration: 1.2,
        ease: "power2.out",
        snap: { innerText: 1 }
      }
    );
  }, [value]);

  return (
    <div
        ref={outerRef}
        onClick={() => openDrilldown(category)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      className={`cursor-pointer h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border p-6 hover:shadow-lg transition ${
        category === 'PNP_TOTAL' || category === 'LARANGAN_TOTAL' || category === 'LARANGAN_TAHUN'
          ? 'bg-teal-500 border-teal-400' 
          : 'bg-gray-100 border-gray-100'
      }`}
    >
      <div className={`flex items-center gap-2 text-sm ${
        category === 'PNP_TOTAL' || category === 'LARANGAN_TOTAL' || category === 'LARANGAN_TAHUN'
          ? 'text-white' 
          : 'text-slate-500 dark:text-slate-200'
      }`}>
        <IconComponent className="w-10" />
        {label}
      </div>
      <div
        ref={ref}
        className={`text-3xl font-bold mt-2 ${
          category === 'PNP_TOTAL' || category === 'LARANGAN_TOTAL' || category === 'LARANGAN_TAHUN'
            ? 'text-white' 
            : 'text-primary text-slate-500 dark:text-slate-200'
        }`}
      >
        0
      </div>
    </div>
  );
}
