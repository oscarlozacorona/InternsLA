import * as Yup from "yup";

const registerValidationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})/,
      "Must input a valid email"
    )
    .required("Please enter your email"),
  password: Yup.string()
    .min(8, "The password needs to be 8 characters long")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      "Must contain a capital letter, a lowercase letter, and a number"
    )
    .required("Please enter your password"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Must confirm password"),
  approve: Yup.boolean().oneOf([true], "Box must be checked"),
  roleId: Yup.string().matches(/^(0?[2]|[3])/, "Must select an account type"),
});

export { registerValidationSchema };
