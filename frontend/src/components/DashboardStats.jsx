import Chart from "chart.js/auto";
import { default as React, default as React, useEffect } from "react";
import { FaBriefcase, FaCalendarAlt, FaChartLine, FaClipboardList, FaUser } from "react-icons/fa";


const DashboardStats = () => {
    const stats = [
        { id: 1, icon: <FaUser />, title: "Total Employees", value: 1200 },
        { id: 2, icon: <FaClipboardList />, title: "Active Projects", value: 48 },
        { id: 3, icon: <FaChartLine />, title: "Completed Quizzes", value: 350 },
        { id: 4, icon: <FaBriefcase />, title: "Open Positions", value: 15 },
        { id: 5, icon: <FaCalendarAlt />, title: "Upcoming Events", value: 5 },
    ];

    useEffect(() => {
        // Chart.js for applications graph
        const ctx = document.getElementById('applicationsChart').getContext('2d');
        const applicationsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Applications',
                    data: [10, 20, 15, 25, 30, 45, 40],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    tension: 0.3 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

        // Circular Progress for goals
        const circles = document.querySelectorAll('.circle');
        circles.forEach(circle => {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (80 / 100 * circumference); // Replace '80' with goal percent

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        });
    }, []);

    return (
        <section className="dashboard-stats">
            <div className="stats-header">
                <h1>Dashboard Overview</h1>
                <p>Stay up-to-date with the latest activity across your organization.</p>
            </div>
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="stat-card" key={stat.id}>
                        <div className="icon-container">{stat.icon}</div>
                        <div className="stat-info">
                            <p className="stat-title">{stat.title}</p>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="graph-section">
                <h2 className="graph-title">Monthly Applications</h2>
                <canvas id="applicationsChart" width="400" height="200"></canvas>
            </div>

            <div className="circular-progress-container">
                <h2 className="progress-title">Goals Progress</h2>
                <div className="progress-circle">
                    <svg width="100" height="100">
                        <circle className="circle" cx="50" cy="50" r="45" fill="none" stroke="#007BFF" strokeWidth="10" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#2c3e50">80%</text>
                    </svg>
                    <p>Goal 1</p>
                </div>
                <div className="progress-circle">
                    <svg width="100" height="100">
                        <circle className="circle" cx="50" cy="50" r="45" fill="none" stroke="#2ecc71" strokeWidth="10" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#2c3e50">70%</text>
                    </svg>
                    <p>Goal 2</p>
                </div>
            </div>
        </section>
    );
};

export default DashboardStats;


const DashboardStats = () => {
    const stats = [
        { id: 1, icon: <FaUser />, title: "Total Employees", value: 1200 },
        { id: 2, icon: <FaClipboardList />, title: "Active Projects", value: 48 },
        { id: 3, icon: <FaChartLine />, title: "Completed Quizzes", value: 350 },
        { id: 4, icon: <FaBriefcase />, title: "Open Positions", value: 15 },
        { id: 5, icon: <FaCalendarAlt />, title: "Upcoming Events", value: 5 },
    ];

    useEffect(() => {
        // Chart.js for applications graph
        const ctx = document.getElementById('applicationsChart').getContext('2d');
        const applicationsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Applications',
                    data: [10, 20, 15, 25, 30, 45, 40],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    tension: 0.3 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });

        // Circular Progress for goals
        const circles = document.querySelectorAll('.circle');
        circles.forEach(circle => {
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (80 / 100 * circumference); // Replace '80' with goal percent

            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = offset;
        });
    }, []);

    return (
        <section className="dashboard-stats">
            <div className="stats-header">
                <h1>Dashboard Overview</h1>
                <p>Stay up-to-date with the latest activity across your organization.</p>
            </div>
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div className="stat-card" key={stat.id}>
                        <div className="icon-container">{stat.icon}</div>
                        <div className="stat-info">
                            <p className="stat-title">{stat.title}</p>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="graph-section">
                <h2 className="graph-title">Monthly Applications</h2>
                <canvas id="applicationsChart" width="400" height="200"></canvas>
            </div>

            <div className="circular-progress-container">
                <h2 className="progress-title">Goals Progress</h2>
                <div className="progress-circle">
                    <svg width="100" height="100">
                        <circle className="circle" cx="50" cy="50" r="45" fill="none" stroke="#007BFF" strokeWidth="10" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#2c3e50">80%</text>
                    </svg>
                    <p>Goal 1</p>
                </div>
                <div className="progress-circle">
                    <svg width="100" height="100">
                        <circle className="circle" cx="50" cy="50" r="45" fill="none" stroke="#2ecc71" strokeWidth="10" />
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#2c3e50">70%</text>
                    </svg>
                    <p>Goal 2</p>
                </div>
            </div>
        </section>
    );
};

export default DashboardStats;
