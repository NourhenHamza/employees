import { Card,  Typography} from "@mui/material";

const AnalyticsInsights = () => (
  <Card sx={{ padding: 3 }}>
    <Typography variant="h5" gutterBottom>Analytics & Insights</Typography>
    <Typography variant="body1">Skill Gap Analysis:</Typography>
    <ul>
      <li>Data Analysis: Intermediate</li>
      <li>Project Management: Advanced</li>
      <li>Cloud Computing: Beginner</li>
    </ul>
    <Typography variant="body1" sx={{ marginTop: 2 }}>Work Trend Analysis:</Typography>
    <ul>
      <li>Most productive hours: 10 AM - 2 PM</li>
      <li>Preferred project types: Agile-based</li>
    </ul>
  </Card>
);

export default AnalyticsInsights;
