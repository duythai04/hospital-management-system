import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const DashboardCharts = ({ patients }) => {

  // ✅ Giới tính
  const genderData = [
    { name: "Nam", value: patients.filter(p => p.gender === "Nam").length },
    { name: "Nữ", value: patients.filter(p => p.gender === "Nữ").length }
  ];

  // ✅ Theo tháng
  const monthlyData = [
    { month: "T1", patients: 20 },
    { month: "T2", patients: 35 },
    { month: "T3", patients: 50 },
    { month: "T4", patients: 40 },
    { month: "T5", patients: 60 },
  ];

  // ✅ Nhóm máu
  const bloodData = ["A", "B", "AB", "O"].map(type => ({
    name: type,
    value: patients.filter(p => p.blood_type === type).length
  }));

  const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b"];

  return (
    <div className="row mt-4">

      {/* ================= BAR ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-lg rounded-4 p-3">
          <h6 className="fw-bold mb-3 text-primary">
            📊 Bệnh nhân theo tháng
          </h6>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              {/* ✅ FIX CHÍNH Ở ĐÂY */}
              <Bar dataKey="patients" radius={[10, 10, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= PIE ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-lg rounded-4 p-3">
          <h6 className="fw-bold mb-3 text-success">
            👨‍⚕️ Giới tính
          </h6>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={5}
              >
                {genderData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= LINE ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-lg rounded-4 p-3">
          <h6 className="fw-bold mb-3 text-danger">
            📈 Tăng trưởng
          </h6>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="patients"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= BLOOD ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-lg rounded-4 p-3">
          <h6 className="fw-bold mb-3 text-warning">
            🩸 Nhóm máu
          </h6>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bloodData}
                dataKey="value"
                outerRadius={90}
                paddingAngle={3}
              >
                {bloodData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default DashboardCharts;