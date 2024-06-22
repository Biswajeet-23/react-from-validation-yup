import { useState } from "react";
import "./App.css";
import * as Yup from "yup";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be atleast 6 characters"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg("Registration successful");
      }, 2 * 1000);
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((fieldError) => {
        validationErrors[fieldError.path] = fieldError.message;
      });
      setError(validationErrors);
      setLoading(false);
    }
  };

  const validateField = async (name, value) => {
    try {
      await schema.validateAt(name, { [name]: value });
      setError((prevError) => ({ ...prevError, [name]: "" }));
    } catch (error) {
      setError((prevError) => ({ ...prevError, [name]: error.message }));
    }
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    await validateField(name, value);
  };

  return (
    <div className="App">
      <h1>User Registration Validation</h1>
      <div className="form-control">
        <form className="form" onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className="form-input-name">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </td>
                <td>
                  {error.firstName && (
                    <span className="error-message">{error.firstName}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </td>
                <td>
                  {error.lastName && (
                    <span className="error-message">{error.lastName}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-input-email">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </td>
                <td>
                  {error.email && (
                    <span className="error-message">{error.email}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="form-input-pass">
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </td>
                <td>
                  {error.password && (
                    <span className="error-message">{error.password}</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting . . ." : "Submit"}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        {successMsg && <div className="success-message">{successMsg}</div>}
      </div>
    </div>
  );
}

export default App;
