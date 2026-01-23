import statesData from "../maps/states.json";
import { useDashboardStore } from "../store/dashboardStore";

export default function StatesList({ onStateSelect }) {
    const { filterNegeri, setChartFilter, clearChartFilter } = useDashboardStore();

    const handleStateClick = (stateName) => {
        const newSelectedState = stateName === filterNegeri ? null : stateName;
        
        // Update filter in dashboard store
        if (newSelectedState) {
            setChartFilter({ negeri: newSelectedState, jenis: null });
        } else {
            clearChartFilter();
        }
        
        if (onStateSelect) {
            onStateSelect(newSelectedState);
        }
    };

    return (
        // <div className="bg-indigo-800 dark:bg-gray-800 rounded-xl p-2 overflow-x-auto">
        <div className="
            bg-indigo-800 dark:bg-gray-800 rounded-xl p-2 overflow-x-auto
            /* Scrollbar height */
            [&::-webkit-scrollbar]:h-2
            /* Track background */
            [&::-webkit-scrollbar-track]:bg-transparent
            /* Thumb styling */
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-indigo-400/50
            hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400
            /* Dark mode thumb */
            dark:[&::-webkit-scrollbar-thumb]:bg-gray-600
            /* Firefox support */
            [scrollbar-width:thin]
            [scrollbar-color:theme(colors.indigo.400/50%)_transparent]
        ">
            <div className="flex gap-0 min-w-max">
                {statesData.map((state) => (
                    <button
                        key={state.id}
                        onClick={() => handleStateClick(state.name)}
                        className={`px-2 py-2 rounded-sm font-medium transition-all whitespace-nowrap shadow-blue-100 flex items-center gap-1 ${
                            filterNegeri === state.name
                                ? 'bg-blue-600 text-white shadow-sm shadow-amber-500'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {/* Flag Image */}
                        <img 
                            src={`/img/flags/${state.name}.png`} 
                            alt={`${state.name} flag`} 
                            className="w-7 h-5 object-contain"
                        />
                        {state.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
