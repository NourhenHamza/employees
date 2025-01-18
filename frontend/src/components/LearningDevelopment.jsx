import { Card,  Typography, Button} from "@mui/material";

const LearningDevelopment = () => (
  <Card sx={{ padding: 3 }}>
    <Typography variant="h5" gutterBottom>Learning & Development</Typography>
    <Typography variant="body1">Recommended Courses:</Typography>
    <ul>
      <li>Advanced JavaScript Training</li>
      <li>Project Management Certification</li>
      <li>UX/UI Design Fundamentals</li>
    </ul>
    <Button variant="contained" sx={{ marginTop: 2 }}>Explore More Courses</Button>
  </Card>
);

export default LearningDevelopment;
