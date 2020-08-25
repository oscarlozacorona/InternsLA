import React from "react";
import logger from "sabio-debug";
import * as emailService from "../../services/emailService";
import PropTypes from "prop-types";
import "../public/Landing.css";

const _logger = logger.extend("ConfirmationEmail");

class ConfirmationEmail extends React.Component {
  state = {};
  componentDidMount() {
    const payload = this.props.match.params;
    payload.id = parseInt(payload.id);
    if (payload) {
      this.emailService(payload);
    }
  }
  emailService = (token) => {
    emailService
      .update(token)
      .then(this.onEmailSuccess)
      .catch(this.onEmailError);
  };
  onEmailSuccess = () => {
    _logger("Email Good");
  };
  onEmailError = () => {
    _logger("Email Bad");
  };
  render() {
    return (
      <>
        <div className="confirm_email-page">
          <div className="watermark">
            <img
              className="path path2"
              alt="..."
              src="https://demos.creative-tim.com/blk-design-system-pro-react/static/media/path5.b9149b5f.png"
            />
            <img
              alt="..."
              className="path path1 "
              src="https://demos.creative-tim.com/blk-design-system-pro-react/static/media/path1.cca147bd.png"
            />
            <div className="container emailpage-heading">
              <div className="card text-center confirm_email_card">
                <h2 className="card-header">iNTERNS.la</h2>
                <div className="card-body">
                  <h3 className="card-title mid_txt">
                    Thank You For Confirming Your Email
                  </h3>
                  <p className="card-text bottom_text">
                    Please Click Here To Login
                  </p>
                  <a href="https://interns.la/" className="btn purple_btn">
                    LOGIN
                  </a>
                </div>
                <div className="card-footer text-muted">© 2020 iNTERNS.la</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default ConfirmationEmail;
ConfirmationEmail.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      token: PropTypes.string,
    }),
  }),
};
