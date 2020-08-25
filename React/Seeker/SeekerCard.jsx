import React from "react";
import PropTypes from "prop-types";
import { FaEdit, FaInfoCircle } from "react-icons/fa";
import "./Seeker.css";
import Moment from "react-moment";
import logger from "sabio-debug";
const _logger = logger.extend("Seeker");

const SeekerCard = (props) => {
  const seeker = props.seeker;
  const userProfile = seeker.userProfile;
  const name = `${userProfile.firstName} ${userProfile.lastName}`;
  _logger(seeker);
  const edit = () => {
    const obj = {
      seeker: seeker,
      userProfile: userProfile,
      name: name,
    };
    props.edit(obj);
  };

  const isActive = props.seeker.isActive && props.seeker.isActive === 1;
  const toggleStatus = () => {
    if (isActive) {
      props.deactivate(seeker);
    } else {
      props.activate(props.seeker);
    }
  };

  const isFollowing =
    props.seeker.isFollowing && props.seeker.isFollowing === 1;
  const toggleFollow = () => {
    if (isFollowing) {
      props.unFollow(seeker);
    } else {
      props.follow(seeker);
    }
  };

  const showMore = () => props.onShowDetails(seeker);

  return (
    <div className="col-lg-6 col-xl-4 p-3">
      <div className="mb-5 maincard h-100">
        <div className="card-body d-flex flex-column">
          <h2 className="card-title font-weight-bold font-size-lg text-center">
            {name}
          </h2>
          <div className="seekerCardImage">
            <img
              alt="img"
              className="card-img-top imageCircle"
              src={userProfile.avatarUrl}
            />
          </div>
          <div className="pt-4 text-left">
            <div className="p-1">
              <strong>Expertise:</strong>{" "}
              {seeker.skills && seeker.skills[0]
                ? seeker.skills.map((skill, index) => {
                    if (index === 0) {
                      return `${skill.name}`;
                    } else {
                      return "";
                    }
                  })
                : "Not provided"}
            </div>
            <div className="p-1">
              <strong>E-mail:</strong> {seeker.email}
            </div>
            <div className="p-1">
              <strong>Member since:</strong>{" "}
              <Moment format="MMMM DD,YYYY">
                {seeker.userProfile.dateCreated}
              </Moment>
            </div>
          </div>
          <div className="row mt-auto">
            <button
              type="button"
              className="mr-auto btn btn-job button-create"
              data-toggle="tooltip"
              data-placement="bottom"
              title="More Details"
              onClick={showMore}
            >
              <FaInfoCircle />
            </button>
            {props.role === "Seeker" &&
              props.seeker.userId === props.loginUser.id && (
                <div className="float-left">
                  <button type="button" onClick={edit} className="btn btn-edit">
                    <FaEdit size="20" />
                  </button>
                </div>
              )}
            {props.loginUser.id !== props.seeker.userId &&
              props.loginUser.roles[0] !== "Admin" && (
                <div className="text-center pr-3">
                  <button
                    type="button"
                    className={`btn btn-${isFollowing ? "danger" : "success"}`}
                    onClick={toggleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              )}
            {props.role === "Admin" && (
              <div className="float-right text-right pr-3">
                <button
                  type="button"
                  className={`btn btn-${isActive ? "danger" : "primary"}`}
                  onClick={toggleStatus}
                >
                  {isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SeekerCard.propTypes = {
  onShowDetails: PropTypes.func,
  loginUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.array,
    userName: PropTypes.string,
    email: PropTypes.string,
    isLoggedIn: PropTypes.bool,
  }),
  key: PropTypes.number,
  role: PropTypes.string,
  follow: PropTypes.func,
  unFollow: PropTypes.func,
  edit: PropTypes.func,
  deactivate: PropTypes.func,
  activate: PropTypes.func,
  seeker: PropTypes.shape({
    email: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    hasActiveEmailNotification: PropTypes.bool.isRequired,
    currentSalary: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    isActive: PropTypes.number,
    isFollowing: PropTypes.number,
    userProfile: PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string.isRequired,
      dateCreated: PropTypes.string.isRequired,
      dateModified: PropTypes.string.isRequired,
    }),
    skills: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        skillLevelId: PropTypes.number.isRequired,
      })
    ),
    files: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
        fileTypeId: PropTypes.number.isRequired,
        createdBy: PropTypes.number.isRequired,
        dateCreated: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default React.memo(SeekerCard);
