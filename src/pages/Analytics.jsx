import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Navigation from "../components/Navigation";
import PageHeader from "../components/PageHeader";

export default function Analytics({ currentPage, setCurrentPage }) {
  useGSAP(() => {
    gsap.from(".analytics-card", {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="dashboard min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="p-8 space-y-10">
        <PageHeader title="Analytics Dashboard" period="Last 30 days" />

        {/* Analytics Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="analytics-card">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Metrics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Monitor key performance indicators</p>
              <div className="mt-4 text-3xl font-bold text-primary">85%</div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900">User Engagement</h3>
              <p className="text-sm text-gray-500 mt-2">Track user interactions</p>
              <div className="mt-4 text-3xl font-bold text-primary">2.4K</div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900">Conversion Rate</h3>
              <p className="text-sm text-gray-500 mt-2">Current conversion metrics</p>
              <div className="mt-4 text-3xl font-bold text-primary">12.5%</div>
            </div>
          </div>

          <div className="analytics-card">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-gray-900">Active Users</h3>
              <p className="text-sm text-gray-500 mt-2">Currently active sessions</p>
              <div className="mt-4 text-3xl font-bold text-primary">1.2K</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}