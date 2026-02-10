import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom"

const RegisterSchema = Yup.object({
  name: Yup.string().required("required field"),
  email: Yup.string().email("invalid email").required("required field"),
  password: Yup.string()
    .min(8, "min of 8 characters")
    .required("required field"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password mismatch")
    .required("reuired field"),
});

export default function Register({ onSuccess }) {
  const navigate = useNavigate()
  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={RegisterSchema}
      onSubmit={async (values) => {
        const res = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          onSuccess();
          navigate("/dashboard")
        }
      }}
    >
      <Form>
        <h2>Register</h2>
        <div>
          <Field name="name" placeholder="Name" />
          <ErrorMessage name="name" component="div" />
        </div>
        <div>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
        </div>
        <div>
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
        </div>
        <div>
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <ErrorMessage name="confirmPassword" component="div" />
        </div>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
