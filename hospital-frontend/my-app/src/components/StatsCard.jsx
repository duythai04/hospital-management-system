import { Card, Row, Col } from 'react-bootstrap';

const StatsCard = ({ title, value, icon, color }) => (
  <Card className="border-0 shadow-sm mb-4">
    <Card.Body className="d-flex justify-content-between align-items-center">
      <div>
        <div className="text-muted small">{title}</div>
        <h4 className="fw-bold mb-0">{value}</h4>
      </div>
      <div className={`p-3 rounded text-white`} style={{ backgroundColor: color }}>
        {icon}
      </div>
    </Card.Body>
  </Card>
);