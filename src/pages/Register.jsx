import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import styles from "./Register.module.css";

const FIELDS = [
  { name: "name",     label: "Full Name",     type: "text" },
  { name: "username", label: "Username",      type: "text" },
  { name: "email",    label: "Email Address", type: "email" },
  { name: "mobile",   label: "Mobile Number", type: "text",  maxLength: 10 },
];

const validate = ({ name, username, email, mobile }) => {
  const errs = {};
  if (!name.trim())                                  errs.name     = "Name is required.";
  else if (!/^[a-zA-Z\s]+$/.test(name))             errs.name     = "Name must contain only letters.";
  if (!username.trim())                              errs.username = "Username is required.";
  else if (!/^[a-zA-Z0-9]+$/.test(username))        errs.username = "Username must be alphanumeric (no spaces).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))   errs.email    = "Enter a valid email address.";
  if (!/^\d{10}$/.test(mobile))                     errs.mobile   = "Mobile must be exactly 10 digits.";
  return errs;
};

export default function Register() {
  const setUser  = useStore((s) => s.setUser);
  const navigate = useNavigate();

  const [form,   setForm]   = useState({ name: "", username: "", email: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (touched[name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, username: true, email: true, mobile: true });
    if (Object.keys(errs).length === 0) {
      setUser(form);
      navigate("/categories");
    }
  };

  return (
    <div className={styles.page}>
      {/* Left decorative panel */}
      <div className={styles.art}>
        <div className={styles.artContent}>
          <div className={styles.logo}>⚡</div>
          <h1>Super App</h1>
          <p>Your all-in-one personalized dashboard — weather, news, movies &amp; more.</p>
          <div className={styles.dots}>
            <span /><span /><span />
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <h2 className={styles.heading}>Create Account</h2>
          <p className={styles.subheading}>Let's get you set up in seconds.</p>

          <form onSubmit={handleSubmit} noValidate>
            {FIELDS.map(({ name, label, type, maxLength }) => (
              <div key={name} className={styles.field}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  maxLength={maxLength}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors[name] && touched[name] ? styles.inputError : ""}
                  autoComplete="off"
                />
                {errors[name] && touched[name] && (
                  <span className={styles.errorText}>{errors[name]}</span>
                )}
              </div>
            ))}

            <button type="submit" className={styles.submitBtn}>
              Continue →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}