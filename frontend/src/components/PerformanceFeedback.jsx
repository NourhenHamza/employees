import { Card,  Typography, Grid } from "@mui/material";

const PerformanceFeedback = () => (
  <Card sx={{ padding: 3 }}>
    <Typography variant="h5" gutterBottom>Performance & Feedback</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1">Last Project Review: Excellent</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Goals for This Quarter:</Typography>
        <ul>
          <li>Complete advanced training on cloud services.</li>
          <li>Lead two new projects.</li>
          <li>Improve customer satisfaction score by 10%.</li>
        </ul>
      </Grid>
    </Grid>
  </Card>
);

export default PerformanceFeedback;
