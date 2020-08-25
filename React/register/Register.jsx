import React from "react";
import PropTypes from "prop-types";
import { create } from "../../services/userService";
import { Formik, Form, Field } from "formik";
import { FaRegUserCircle } from "react-icons/fa";
import { registerValidationSchema } from "./registerValidationSchema";
import { FormGroup } from "reactstrap";
import swal from "sweetalert";
import "../public/Landing.css";

class Register extends React.Component {
  state = {
    registerForm: {
      roleId: 0,
      email: "",
      password: "",
      passwordConfirm: "",
      approve: false,
    },
  };

  handleSubmit = (values) => {
    const payload = {
      email: values.email,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      roleId: values.roleId * 1,
    };
    this.setState({
      registerForm: payload,
    });

    create(payload).then(this.onCreateSuccess).catch(this.onCreateError);
  };

  onCreateSuccess = () => {
    swal(
      "Success!",
      "Confirmation e-mail sent. Confirm your e-mail before logging in.",
      "success"
    );
    this.props.history.push("/");
  };

  onCreateError = () => {
    const options = {
      title: "The email you provided is already in our records",
      text: "Would You Like To Login?",
      icon: "warning",
      buttons: {
        register: {
          value: false,
          text: "Register",
          className: "bg-danger",
        },
        login: { value: true, text: "Login", className: "bg-primary" },
      },
    };
    swal(options).then((value) => {
      if (!value) {
        this.props.history.push("/register");
      } else {
        this.props.history.push("/");
      }
    });
  };
  render() {
    return (
      <div className="wrapper register-page">
        <div className="watermark">
          <img
            className="path3 path1"
            alt="..."
            src="https://demos.creative-tim.com/blk-design-system-pro-react/static/media/path4.43994fd6.png"
          />
          <img
            alt="..."
            className="path"
            src="https://demos.creative-tim.com/blk-design-system-pro-react/static/media/path5.b9149b5f.png"
          />
          <div className="container register">
            <div className="d-flex justify-content-center reg-card h-100">
              <div className="card register_card">
                <div className="card-header register_header">
                  <h3>Register</h3>
                  <div className="d-flex justify-content-end social_icon">
                    <span>
                      <div className="brand-logo float-left">
                        <img
                          className="img loginLogo"
                          src="https://sabio-training.s3-us-west-2.amazonaws.com/intern_ba3e54ba-37a8-4066-a9d3-a6aff778962fLOGO_iNTERNS_LA.png"
                          alt="App Logo"
                        />
                      </div>
                    </span>
                  </div>
                </div>
                <div className="card-body loginFields">
                  <Formik
                    enableReinitialize={true}
                    validationSchema={registerValidationSchema}
                    initialValues={this.state.registerForm}
                    onSubmit={this.handleSubmit}
                    className="align-self-center"
                  >
                    {(props) => {
                      const {
                        values,
                        handleSubmit,
                        isValid,
                        isSubmitting,
                        errors,
                        touched,
                      } = props;
                      return (
                        <Form onSubmit={handleSubmit}>
                          <FormGroup>
                            <div className="form-group reg-email">
                              <h4 className="form_text">
                                Email{" "}
                                {errors.email && touched.email && (
                                  <span className="input-feedback text-danger">
                                    {errors.email}
                                  </span>
                                )}
                              </h4>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="fas fa-envelope"></i>
                                  </span>
                                </div>
                                <Field
                                  className={
                                    errors.email && touched.email
                                      ? "form-control error"
                                      : "form-control"
                                  }
                                  name="email"
                                  type="text"
                                  values={values.email}
                                  placeholder="Enter A Valid Email Address"
                                  autoComplete="off"
                                />
                              </div>

                              {this.state.emailError ? (
                                <span className="input-feedback text-danger">
                                  {
                                    "The email was found in our records would you like to sign in?"
                                  }
                                </span>
                              ) : null}
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <div className="form-group">
                              <h4 className="form_text">
                                Password{" "}
                                {errors.password && touched.password && (
                                  <span className="input-feedback text-danger">
                                    {errors.password}
                                  </span>
                                )}
                              </h4>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="fas fa-key"></i>
                                  </span>
                                </div>
                                <Field
                                  name="password"
                                  type="password"
                                  values={values.password}
                                  placeholder="Password"
                                  autoComplete="off"
                                  className={
                                    errors.password && touched.password
                                      ? "form-control error"
                                      : "form-control"
                                  }
                                />
                              </div>
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <div className="form-group">
                              <h4 className="form_text">
                                Confirm Password{" "}
                                {errors.passwordConfirm &&
                                  touched.passwordConfirm && (
                                    <span className="input-feedback text-danger">
                                      {errors.passwordConfirm}
                                    </span>
                                  )}
                              </h4>
                              <div className="input-group">
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="fas fa-lock"></i>
                                  </span>
                                </div>
                                <Field
                                  name="passwordConfirm"
                                  type="password"
                                  values={values.passwordConfirm}
                                  placeholder="Confirm Password"
                                  autoComplete="off"
                                  className={
                                    errors.passwordConfirm &&
                                    touched.passwordConfirm
                                      ? "form-control error"
                                      : "form-control"
                                  }
                                />
                              </div>
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <h4 className="form_text">
                              Account Type <FaRegUserCircle />{" "}
                              {errors.roleId && touched.roleId && (
                                <div className="input-feedback text-center text-danger">
                                  {errors.roleId}
                                </div>
                              )}
                            </h4>
                            <Field
                              name="roleId"
                              placeholder="Select Account Type"
                              component="select"
                              className={
                                errors.roleId && touched.roleId
                                  ? "form-control rounded error"
                                  : "form-control rounded "
                              }
                            >
                              <option key={0} value={0}>
                                Choose Your Account Type
                              </option>
                              <option key={2} value={2}>
                                Seeker
                              </option>
                              <option key={3} value={3}>
                                Organization/Company
                              </option>
                            </Field>

                            {values.roleId === "2" ? (
                              <div className="input-feedback text-center text-white">
                                Seeker is a user looking for an internship
                              </div>
                            ) : null}
                            {values.roleId === "3" ? (
                              <div className="input-feedback text-center text-white">
                                {
                                  "Organization is an entity providing an internship"
                                }
                              </div>
                            ) : null}
                          </FormGroup>
                          <FormGroup className="text-center agree-terms">
                            <Field
                              name="approve"
                              type="checkbox"
                              values={values.approve ? "true" : "false"}
                              className={
                                errors.approve && touched.approve
                                  ? "ml-1 mt-1 error"
                                  : "ml-1 mt-1"
                              }
                            ></Field>
                            {errors.approve && touched.approve ? (
                              <span className="input-feedback text-danger">
                                {errors.approve}
                              </span>
                            ) : (
                              <small className="box-txt">
                                I agree with the Terms and Conditions
                              </small>
                            )}
                          </FormGroup>
                          <div>
                            <button
                              className="btn btn-block purple_btn mx-auto w-75"
                              type="submit"
                              disabled={!isValid || isSubmitting}
                            >
                              Sign Up
                            </button>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                  <p className="pt-3 text-center account-txt">
                    Have an account?
                  </p>
                  <button
                    className="btn btn-block purple_btn mx-auto w-75 reg-login"
                    onClick={() => {
                      this.props.history.push("/");
                    }}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
