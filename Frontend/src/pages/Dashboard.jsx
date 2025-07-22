import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import IdolizeSolutionImage from "../assets/IdolizeSolutionImage.png";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { CircleChevronLeft } from 'lucide-react';
import { useTheme } from "../contexts/ThemeContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        { id: 1, name: "Task A", UID: 'jundedxv6767', status: "Completed" },
        { id: 2, name: "Task B", UID: 'jundedxv6767', status: "In Progress" },
        { id: 3, name: "Task C", UID: 'jundedxv6767', status: "Failed" },
        { id: 4, name: "Task D", UID: 'jundedxv6767', status: "Completed" },
    ]);

    const statusCounts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {});

    const pieData = {
        labels: ["Completed", "Failed", "In Progress"],
        datasets: [
            {
                data: [
                    statusCounts["Completed"] || 0,
                    statusCounts["Failed"] || 0,
                    statusCounts["In Progress"] || 0,
                ],
                backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
            {/* Header */}
            <div className={`border-b px-4 py-4 flex-shrink-0 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <img
                            src={IdolizeSolutionImage}
                            alt="Idolize Solution Logo"
                            className="w-60 h-15 object-contain"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
                            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
            {/* Back Button */}
            <div className="p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 flex justify-between items-center py-2 rounded"
                >
                    <CircleChevronLeft className="w-6 h-7" />
                    

                </button>
            </div>
            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-8 p-6">
                {/* Table */}
                <div className="w-full md:w-2/3">
                    <h2 className="text-xl font-semibold mb-4">Task Status Table</h2>
                    <div className="overflow-x-auto">
                        <table className={`min-w-full border ${isDark ? "border-gray-700" : "border-gray-300"}`}>
                            <thead>
                                <tr className={`${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                                    <th className="px-4 py-2 text-left">Task</th>
                                    <th className="px-4 py-2 text-left">UID</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className={`${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                                        <td className="px-4 py-2">{task.name}</td>
                                        <td className="px-4 py-2">{task.UID}</td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded text-sm font-medium 
                                                ${task.status === "Completed" ? "bg-green-100 text-green-700" :
                                                    task.status === "Failed" ? "bg-red-100 text-red-700" :
                                                        "bg-yellow-100 text-yellow-700"}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="w-full md:w-1/3">
                    <h2 className="text-xl font-semibold mb-4">Task Status Chart</h2>
                    <Pie data={pieData} />
                </div>
            </div>


        </div>
    );
};

export default Dashboard;
