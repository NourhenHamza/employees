import { Box, Button, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

const ManageEmployers = () => {
  const [employers, setEmployers] = useState([
    { id: 1, name: "Employer 1", company: "Company A" },
    { id: 2, name: "Employer 2", company: "Company B" },
    { id: 3, name: "Employer 3", company: "Company C" },
  ]);
  const [newEmployer, setNewEmployer] = useState({ name: "", company: "" });
  const [editingEmployer, setEditingEmployer] = useState(null);

  const handleAddEmployer = () => {
    if (!newEmployer.name || !newEmployer.company) {
      toast.error("Please fill out all fields");
      return;
    }

    const updatedEmployers = [
      ...employers,
      { id: employers.length + 1, ...newEmployer },
    ];
    setEmployers(updatedEmployers);
    setNewEmployer({ name: "", company: "" });
    toast.success("Employer added successfully");
  };

  const handleEditEmployer = (id) => {
    const employerToEdit = employers.find((employer) => employer.id === id);
    setEditingEmployer(employerToEdit);
  };

  const handleUpdateEmployer = () => {
    const updatedEmployers = employers.map((employer) =>
      employer.id === editingEmployer.id ? editingEmployer : employer
    );
    setEmployers(updatedEmployers);
    setEditingEmployer(null);
    toast.success("Employer updated successfully");
  };

  const handleDeleteEmployer = (id) => {
    const updatedEmployers = employers.filter((employer) => employer.id !== id);
    setEmployers(updatedEmployers);
    toast.success("Employer deleted successfully");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5">Manage Employers</Typography>
      <List>
        {employers.map((employer) => (
          <ListItem key={employer.id}>
            <ListItemText
              primary={employer.name}
              secondary={`Company: ${employer.company}`}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEditEmployer(employer.id)}
              sx={{ marginRight: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDeleteEmployer(employer.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Add New Employer</Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={newEmployer.name}
          onChange={(e) => setNewEmployer({ ...newEmployer, name: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Company"
          variant="outlined"
          fullWidth
          value={newEmployer.company}
          onChange={(e) => setNewEmployer({ ...newEmployer, company: e.target.value })}
          sx={{ marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEmployer}
          sx={{ width: "100%" }}
        >
          Add Employer
        </Button>
      </Box>

      {editingEmployer && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Edit Employer</Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={editingEmployer.name}
            onChange={(e) => setEditingEmployer({ ...editingEmployer, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            value={editingEmployer.company}
            onChange={(e) => setEditingEmployer({ ...editingEmployer, company: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleUpdateEmployer}
            sx={{ width: "100%" }}
          >
            Update Employer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ManageEmployers;
