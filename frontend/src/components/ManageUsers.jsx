import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  useEffect(() => {
    // Fetch all users from backend
    axios
      .get("http://localhost:4000/api/users")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/api/users/${id}`)
      .then(() => {
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    const filtered = users.filter((user) =>
      Object.keys(filters).every((filterKey) => {
        if (filterKey === key) {
          return value === "" || user[filterKey]?.toString().toLowerCase().includes(value.toLowerCase());
        }
        return filters[filterKey]
          ? user[filterKey]?.toString().toLowerCase().includes(filters[filterKey].toLowerCase())
          : true;
      })
    );

    setFilteredUsers(filtered);
  };

  const getFriendlyRole = (role) => {
    if (role === "Job Seeker") return "Employer";
    if (role === "Employer") return "Recruiter";
    if (role === "admin") return "Admin";
    return role;
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: "bold" }}>
        Manage Users
      </Typography>

      {/* Redesigned Search Section */}
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 3,
          borderRadius: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <TextField
          label="Search Name"
          variant="outlined"
          fullWidth
          onChange={(e) => handleFilterChange("name", e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          label="Search Email"
          variant="outlined"
          fullWidth
          onChange={(e) => handleFilterChange("email", e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          label="Search Phone"
          variant="outlined"
          fullWidth
          onChange={(e) => handleFilterChange("phone", e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        />
        <FormControl fullWidth sx={{ backgroundColor: "white", borderRadius: 1 }}>
          <InputLabel>Search Role</InputLabel>
          <Select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            label="Search Role"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Job Seeker">Employer</MenuItem>
            <MenuItem value="Employer">Recruiter</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Users Table */}
      <Table sx={{ width: "100%", borderCollapse: "collapse", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user._id} sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{getFriendlyRole(user.role)}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDelete(user._id)}
                  sx={{ textTransform: "none", fontWeight: "bold" }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManageUsers;
