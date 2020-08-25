import React from "react";
import { Formik, Field, FieldArray } from "formik";
import { FaCheck, FaRegTimesCircle } from "react-icons/fa";
import { Form, FormGroup, Label, Button } from "reactstrap";
import { update, getById } from "../../services/seekerServices";
import { lookUp } from "../../services/lookUpService";
import Select from "react-select";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import "./Seeker.css";
import { seekerValidationSchema } from "./seekerValidationSchema";

const _logger = logger.extend("Seeker");

class SeekerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seeker: {
        isSearchable: false,
        hasActiveEmailNotification: false,
        currentSalary: 0,
        currency: "",
        skills: [],
        files: []
      },
      form: [],
      skills: [],
      skillLevel: []
    };
  }
  componentDidMount() {
    if (this.props.location.state) {
      this.setState({
        seeker: this.props.location.state.seeker
      });
    } else {
      getById(this.props.match.params.id * 1)
        .then(this.onGetByIdSuccess)
        .catch(this.onGetByIdError);
    }
    lookUp("SkillList")
      .then(this.onGetSkillsSuccess)
      .catch(this.onGetSkillsError);

    lookUp("SkillLevelType")
      .then(this.onGetSkillLevelSuccess)
      .catch(this.onGetSkillLevelError);
  }
  onGetByIdSuccess = res => {
    _logger(res.item);
  };
  onGetByIdError = res => {
    _logger("res", res);
  };
  onGetSkillsSuccess = res => {
    const skills = res.items.map(item => {
      return { value: item.id, label: item.name };
    });
    this.setState({ skills });
  };
  onGetSkillsError = () => {
    _logger("Skills Fail");
  };
  onGetSkillLevelSuccess = res => {
    const skillLevel = res.items.map(item => {
      return { value: item.id, label: item.name };
    });
    this.setState({ skillLevel });
  };
  onGetSkillLevelError = () => {
    _logger("Error on getting skill levels");
  };

  handleSubmit = values => {
    const payload = this.updateMapper(values);
    update(payload)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateError);
  };

  onCreateSuccess = () => {
    _logger("Create Success");
    this.props.history.push("/seekers");
  };

  onCreateError = () => {
    _logger("Create Error");
  };

  onUpdateSuccess = () => {
    this.props.history.push("/seekers");
  };
  onUpdateError = () => {
    _logger("Error on Update");
  };
  updateMapper = values => {
    const skills = [];
    if (values.skills && values.skills.length > 0) {
      for (let i = 0; i < values.skills.length; i++) {
        skills.push({
          skillId: values.skills[i].id * 1,
          skillLevelId: values.skills[i].skillLevelId * 1
        });
      }
    }
    return {
      id: values.userId,
      isSearchable: values.isSearchable,
      hasActiveEmailNotification: values.hasActiveEmailNotification,
      currentSalary: values.currentSalary,
      currency: values.currency,
      skills: skills,
      files: []
    };
  };
  render() {
    return (
      <div className="wrapper">
        <div className="container mt-5">
          <div className="card w-100 text-dark">
            <Formik
              enableReinitialize={true}
              validationSchema={seekerValidationSchema}
              initialValues={this.state.seeker}
              onSubmit={this.handleSubmit}
            >
              {props => {
                const {
                  values,
                  handleSubmit,
                  isValid,
                  isSubmitting,
                  errors,
                  touched,
                  setFieldValue
                } = props;
                return (
                  <div className="row">
                    <div className="col-4">
                      <div className="mb-5 maincard">
                        <div className="card-body">
                          <h2 className="card-title font-weight-bold font-size-lg text-center">
                            {this.props.location.state
                              ? this.props.location.state.name
                              : null}
                          </h2>
                          <div className="row">
                            <div className="col-6 text-center">
                              <img
                                alt="img"
                                className="card-img-top rounded-circle"
                                style={{ width: 100, height: 100 }}
                                src={
                                  this.props.location.state
                                    ? this.props.location.state.userProfile
                                        .avatarUrl
                                    : null
                                }
                              />
                            </div>
                            <div className="col-6 text-left">
                              <p>
                                <span>
                                  <strong className="mr-1">
                                    Active Email Notifications:
                                    <a className="ml-1">
                                      {values.hasActiveEmailNotification ? (
                                        <FaCheck className="text-success" />
                                      ) : (
                                        <FaRegTimesCircle className="text-danger" />
                                      )}
                                    </a>
                                  </strong>
                                </span>
                              </p>
                              <p>
                                <span>
                                  <strong className="mr-1">
                                    Is the Seeker Searchable?:
                                    <a className="ml-1">
                                      {values.isSearchable ? (
                                        <FaCheck className="text-success" />
                                      ) : (
                                        <FaRegTimesCircle className="text-danger" />
                                      )}
                                    </a>
                                  </strong>
                                </span>
                              </p>
                              <p>
                                <span>
                                  <strong className="mr-1">
                                    {`Seeker's Salary :`}
                                    <a className="ml-1">
                                      {values.currentSalary
                                        ? `${values.currentSalary} ${values.currency}`
                                        : "Seeker Does Not Have A Salary"}
                                    </a>
                                  </strong>
                                </span>
                              </p>
                            </div>
                          </div>
                          <div>
                            <span>
                              <div className="text-center">
                                <h4 className="mr-1 font-weight-bolder">
                                  Seeker Skills
                                </h4>
                              </div>
                              <div className="ml-1 text-center">
                                {values.skills && values.skills[0] ? (
                                  values.skills.map((skill, index) => {
                                    const arr = [
                                      "Entry",
                                      "Intermediate",
                                      "Senior"
                                    ];
                                    return (
                                      <div key={index}>
                                        <div className="row">
                                          <div className="col-6 text-left">
                                            {`${skill.name}  `}
                                          </div>
                                          <div className="col-6 text-left">
                                            <strong className="ml-3">{`${
                                              arr[skill.skillLevelId - 1]
                                            } Level`}</strong>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-center">
                                    {"Seeker has no registered skills"}
                                  </div>
                                )}
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-8">
                      <Form
                        onSubmit={handleSubmit}
                        className={"col-md-10 pt-4"}
                      >
                        <FormGroup>
                          <Label className="mr-3">
                            <h4>Current Salary</h4>
                          </Label>
                          <Field
                            className={
                              errors.currentSalary && touched.currentSalary
                                ? "form-control rounded error"
                                : "form-control rounded"
                            }
                            name="currentSalary"
                            type="number"
                            values={values.currentSalary}
                            placeholder="Seeker's Current Salary"
                            autoComplete="off"
                          />
                          {errors.currentSalary && touched.currentSalary && (
                            <span className="input-feedback text-danger">
                              {errors.currentSalary}
                            </span>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label className="mr-5">
                            <h4>Currency</h4>
                          </Label>
                          <Field
                            className={
                              errors.currency && touched.currency
                                ? "form-control rounded error"
                                : "form-control rounded"
                            }
                            name="currency"
                            type="text"
                            values={values.currency}
                            placeholder="Seekers Currency"
                            autoComplete="off"
                          />
                          {errors.currency && touched.currency && (
                            <span className="input-feedback text-danger">
                              {errors.currency}
                            </span>
                          )}
                        </FormGroup>
                        <FormGroup>
                          <Label>
                            <h4>Active Email Notification:</h4>
                          </Label>
                          <Label
                            className="ml-2 text-capitalize font-weight-normal"
                            for="hasActiveEmailNotification"
                          >
                            Click to have Active Email Notifications
                          </Label>
                          <Field
                            className="ml-3"
                            name="hasActiveEmailNotification"
                            type="checkbox"
                            checked={values.hasActiveEmailNotification}
                          ></Field>
                        </FormGroup>
                        <FormGroup>
                          <Label className="mr-5">
                            <h4>Allows User Search:</h4>
                          </Label>
                          <Label
                            className="ml-3 text-capitalize"
                            for="isSearchable"
                          >
                            Click to allow other users to find you
                          </Label>
                          <Field
                            className="ml-4"
                            name="isSearchable"
                            type="checkbox"
                            checked={values.isSearchable}
                          ></Field>
                        </FormGroup>
                        <FormGroup>
                          <FieldArray name="skills">
                            {arrayHelpers => (
                              <div>
                                {values.skills && values.skills.length > 0
                                  ? values.skills.map((skill, index) => {
                                      this.skillNameChange = (
                                        value,
                                        setFieldValue,
                                        idName,
                                        skillName
                                      ) => {
                                        setFieldValue(idName, value.value);
                                        if (skillName) {
                                          setFieldValue(skillName, value.label);
                                        }
                                      };
                                      const arr = [
                                        "Entry Level",
                                        "Intermediate Level",
                                        "Senior Level"
                                      ];
                                      const skillId = `skills.${index}.id`;
                                      const skillName = `skills.${index}.name`;
                                      const skillLevel = `skills.${index}.skillLevelId`;
                                      return (
                                        <div key={index}>
                                          <div className="mb-3">
                                            <Select
                                              name={skillId}
                                              placeholder={skill.name}
                                              onChange={value => {
                                                this.skillNameChange(
                                                  value,
                                                  setFieldValue,
                                                  skillId,
                                                  skillName
                                                );
                                              }}
                                              options={this.state.skills}
                                            />
                                            <Select
                                              name={skillLevel}
                                              placeholder={
                                                arr[skill.skillLevelId - 1]
                                              }
                                              onChange={value => {
                                                this.skillNameChange(
                                                  value,
                                                  setFieldValue,
                                                  skillLevel
                                                );
                                              }}
                                              options={this.state.skillLevel}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })
                                  : null}
                                <div className="ml-5 container">
                                  <Button
                                    className="bg-success"
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.push({
                                        id: 1,
                                        skill: "",
                                        skillLevelId: 1
                                      })
                                    }
                                  >
                                    Add Skill
                                  </Button>
                                  <Button
                                    className="bg-danger"
                                    type="button"
                                    onClick={() => arrayHelpers.pop()}
                                  >
                                    Remove Last Skill
                                  </Button>
                                </div>
                              </div>
                            )}
                          </FieldArray>
                        </FormGroup>
                        {isValid ? (
                          <button
                            className="btn btn-primary float-right mb-3"
                            type="submit"
                            disabled={!isValid || isSubmitting}
                          >
                            Update
                          </button>
                        ) : null}
                      </Form>
                    </div>
                  </div>
                );
              }}
            </Formik>
            <button onClick={this.addVideo} className="btn btn-primary">
              Add Video
            </button>
            <div>{this.state.form ? this.state.form : null}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeekerForm;

SeekerForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      name: PropTypes.string.isRequired,
      userProfile: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired
      }),
      seeker: PropTypes.shape({
        userId: PropTypes.number.isRequired,
        isSearchable: PropTypes.bool.isRequired,
        hasActiveEmailNotification: PropTypes.bool.isRequired,
        currentSalary: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        userProfile: PropTypes.shape({
          id: PropTypes.number.isRequired,
          userId: PropTypes.number.isRequired,
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
          mi: PropTypes.string,
          avatarUrl: PropTypes.string.isRequired,
          dateCreated: PropTypes.string.isRequired,
          dateModified: PropTypes.string.isRequired
        }),
        email: PropTypes.string.isRequired,
        skills: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            skillLevelId: PropTypes.number.isRequired
          })
        ),
        files: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.number.isRequired,
            url: PropTypes.string.isRequired,
            fileTypeId: PropTypes.number.isRequired,
            createdBy: PropTypes.number.isRequired,
            dateCreated: PropTypes.string.isRequired
          })
        )
      })
    })
  })
};
