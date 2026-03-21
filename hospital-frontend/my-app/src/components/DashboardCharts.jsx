import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";

const DashboardCharts = ({ patients = [] }) => {

  // 1. ✅ Logic xử lý Giới tính (Khớp với p.gender)
  const genderData = [
    { name: "Nam", value: patients.filter(p => p.gender === "Nam").length },
    { name: "Nữ", value: patients.filter(p => p.gender === "Nữ").length },
    { name: "Khác", value: patients.filter(p => p.gender === "Khác").length }
  ].filter(item => item.value > 0); // Chỉ hiện những gì có dữ liệu

  // 2. ✅ Logic xử lý Nhóm máu (Khớp với p.bloodType - Model mới)
  const bloodData = ["A", "B", "AB", "O"].map(type => ({
    name: `Nhóm ${type}`,
    value: patients.filter(p => p.bloodType === type).length
  })).filter(item => item.value > 0);

  // 3. ✅ Logic xử lý Tăng trưởng theo tháng (Dựa trên p.createdAt thực tế)
  const getMonthlyStats = () => {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
    const stats = months.map((m, index) => {
      const count = patients.filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === index && date.getFullYear() === 2026;
      }).length;
      return { month: m, count: count };
    });
    // Chỉ lấy các tháng có dữ liệu hoặc đến tháng hiện tại để biểu đồ đẹp hơn
    const currentMonth = new Date().getMonth();
    return stats.slice(0, currentMonth + 1);
  };

  const monthlyData = getMonthlyStats();

  const COLORS = ["#4f46e5", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="row mt-2">
      {/* ================= BAR: Tiếp nhận theo tháng ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
          <h6 className="fw-bold mb-3 text-primary">📊 Số lượng tiếp nhận (2026)</h6>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8f9fa'}} borderRadius={8} />
              <Bar dataKey="count" name="Bệnh nhân" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= PIE: Giới tính ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
          <h6 className="fw-bold mb-3 text-success">👨‍⚕️ Cơ cấu giới tính</h6>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                innerRadius={55}
                paddingAngle={8}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= LINE: Tăng trưởng ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
          <h6 className="fw-bold mb-3 text-danger">📈 Tốc độ tăng trưởng</h6>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} />
              <YAxis axisLine={false} />
              <Tooltip />
              <Line
                type="smooth"
                dataKey="count"
                name="Bệnh nhân"
                stroke="#ef4444"
                strokeWidth={4}
                dot={{ r: 6, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= BLOOD: Nhóm máu ================= */}
      <div className="col-md-6 mb-4">
        <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
          <h6 className="fw-bold mb-3 text-warning">🩸 Phân loại nhóm máu</h6>
          {bloodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bloodData}
                  dataKey="value"
                  outerRadius={90}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bloodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-75 text-muted">
              Chưa có dữ liệu nhóm máu
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;