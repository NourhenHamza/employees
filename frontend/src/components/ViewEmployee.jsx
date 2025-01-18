import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import './ViewEmployee.css';

const ViewEmployee = ({ employerId, onBack }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/Project/employees/${employerId}`);
        console.log(response.data);

        if (response.data && Array.isArray(response.data.employees)) {
          setEmployees(response.data.employees);
        } else if (response.data) {
          setEmployees([response.data]);
        } else {
          setError("Format de données inattendu, un tableau d'employés était attendu.");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [employerId]);

  if (loading) return <p>Chargement des employés...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="employee-container">
      <button className="back-btn" onClick={onBack}>
        Retour
      </button>
      <h1>Détails des employés</h1>
      {employees.length === 0 ? (
        <p>Aucun employé trouvé.</p>
      ) : (
        <div className="employee-list">
          {employees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <div className="employee-avatar">
                <Avatar
                  name={employee.name}
                  src={employee.profilePhoto}
                  size="120"
                  round={true}
                />
              </div>
              <div className="employee-info">
                <h2>{employee.name}</h2>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Téléphone:</strong> {employee.phone}</p>
                <p><strong>Adresse:</strong> {employee.address || "Non spécifié"}</p> {/* Remplacer "Lieu" par "Adresse" */}
                <p><strong>Lettre de motivation:</strong> {employee.coverLetter || "Aucune lettre de motivation"}</p>
                <p><strong>CV:</strong> {employee.resume && employee.resume.url ? (
                  <a href={employee.resume.url} target="_blank" rel="noopener noreferrer">
                    Voir le CV
                  </a>
                ) : "Pas de CV téléchargé"}</p>
                <div>
                  <strong>Compétences:</strong>
                  {employee.skills && employee.skills.length > 0 ? (
                    <ul>
                      {employee.skills.map((skill) => (
                        <li key={skill.name}>
                          {skill.name}: {skill.score}
                        </li>
                      ))}
                    </ul>
                  ) : "Aucune compétence ajoutée"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
