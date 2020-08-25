import React from "react";
import logger from "sabio-debug";
import SeekerCard from "./SeekerCard";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import * as axSeek from "../../services/seekerServices";
import PropTypes from "prop-types";
import swal from "sweetalert";
import Search from "../utility/Search";
const _logger = logger.extend("Seeker");

class Seeker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isSearching: false,
      original: [],
      mapped: [null],
      pagination: {
        current: 1,
        pageSize: 9,
        totalCount: 0,
      },
      viewMore: null,
      isActive: 0,
      isFollowing: 0,
    };
  }

  componentDidMount() {
    this.paginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  }
  paginate = (pageIndex, pageSize) => {
    axSeek
      .paginate(pageIndex, pageSize)
      .then(this.onGrabPageSuccess)
      .catch(this.onGrabPageError);
  };

  onGrabPageSuccess = (res) => {
    const original = res.item.pagedItems;
    const mapped = original.map(this.cardMapper);
    let pagination = {
      current: res.item.pageIndex + 1,
      totalCount: res.item.totalCount,
      pageSize: 9,
    };
    this.setState((prevState) => {
      return {
        ...prevState,
        original,
        mapped,
        pagination,
      };
    });
  };

  onGrabPageError = () => {
    _logger("Error on getting Seekers");
    this.resetState();
  };
  resetState = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        original: [],
        mapped: [],
        pagination: {
          current: 1,
          totalCount: 0,
          pageSize: 9,
        },
      };
    });
  };

 cardMapper = original => (
      <SeekerCard
        onShowDetails={this.onShowDetails}
        edit={this.edit}
        role={this.props.currentUser.roles[0]}
        loginUser={this.props.currentUser}
        key={original.userId}
        deactivate={this.deactivateHandler}
        activate={this.activateHandler}
        seeker={original}
        isActive={this.state.isActive}
        isFollowing={this.state.isFollowing}
        unFollow={this.unFollowHandler}
        follow={this.followHandler}
      />
    );

  followHandler = (seeker) => {
    let id = seeker.userId;
    axSeek
      .seekerFollow(id)
      .then(this.seekerFollowSuccess)
      .catch(this.seekerFollowError);
  };

  seekerFollowSuccess = () => {
    this.paginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  };

  seekerFollowError = () => {
    _logger("Failed to follow");
  };

  unFollowHandler = (seeker) => {
    let id = seeker.userId;
    axSeek
      .seekerUnFollow(id)
      .then(this.seekerUnFollowSuccess)
      .catch(this.seekerUnFollowError);
  };

  seekerUnFollowSuccess = () => {
    this.paginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  };

  seekerUnFollowError = () => {
    _logger("Failed to unfollow");
  };

  onPageChange = (num) => {
    this.paginate(num - 1, this.state.pagination.pageSize);
  };

  createSeeker = (event) => {
    event.preventDefault();
    _logger(this.props.history.push("seeker/new"));
  };

  deactivateHandler = (seeker) => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", "Yes, deactivate"],
    }).then((willDelete) => {
      if (willDelete) {
        axSeek
          .seekerDeactivate(seeker)
          .then(this.deactivateSuccess)
          .catch(this.deactivateError);
        swal("User has been deactivated!", {
          icon: "success",
        });
      } else {
        swal("User remains active!");
      }
    });
  };

  deactivateSuccess = () => {
    this.paginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  };

  activateHandler = (seeker) => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", "Yes, activate"],
    }).then((willDelete) => {
      if (willDelete) {
        axSeek
          .seekerActivate(seeker)
          .then(this.activateSuccess)
          .catch(this.activateError);
        swal("User has been activated!", {
          icon: "success",
        });
      } else {
        swal("User remains inactive!");
      }
    });
  };

  activateSuccess = () => {
    this.paginate(
      this.state.pagination.current - 1,
      this.state.pagination.pageSize
    );
  };

  ondelSuccess = () => {
    _logger("delSuccess");
  };

  ondelError = () => {
    _logger("del Error");
  };

  edit = (seeker) => {
    this.props.history.push(
      `/seeker/${this.props.currentUser.id}/edit/`,
      seeker
    );
  };

  onShowDetails = (seeker) => {
    this.props.history.push(`/seeker/${seeker.userId}/details`, seeker);
  };

  handleSearch = (e) => {
    this.setState((prevState) => {
      return { ...prevState, search: e };
    });
    const data = e;
    const page = this.state.pagination;
    this.handleSearching(data, page.current, page.pageSize);
  };

  handleSearching = (searchStr, pageIndex, pageSize) => {
    axSeek
      .search(pageIndex - 1, pageSize, searchStr)
      .then(this.searchSuccess)
      .catch(this.searchError);
  };

  searchSuccess = (res) => {
    this.onGrabPageSuccess(res);
  };

  searchError = (res) => {
    _logger(res, "searchError");
    this.resetState();
  };

  resetSearch = () => {
    this.setState({ search: "", isSearching: false }, () =>
      this.paginate(0, this.state.pagination.pageSize)
    );
  };

  resetState = () => {
    this.setState((prevState) => {
      const newArr = { ...prevState.seekerArr };
      newArr.original = [];
      newArr.mapped = [];
      return {
        seekerArr: newArr,
        isSearching: false,
        pagination: {
          current: 1,
          totalCount: 0,
          pageSize: 6,
        },
      };
    });
  };

  render() {
    return (
      <div className="col-12 p-4">
        <div className="d-flex">
          <span className="searchBar">
            <Search
              getAllPaginated={this.paginate}
              searchBtnClick={this.handleSearch}
              updateSearchQuery={this.resetSearch}
              searchQuery={this.state.search}
              isSearching={this.state.isSearching}
            />
          </span>
        </div>
        <div className="row mt-3">
          {this.state.mapped.length > 0 ? (
            <>{this.state.mapped}</>
          ) : (
            <h1> No Records Found...</h1>
          )}
        </div>
        <div className="text-center">
          <Pagination
            style={{ display: "inline-block" }}
            onChange={this.onPageChange}
            current={this.state.pagination.current}
            pageSize={this.state.pagination.pageSize}
            total={this.state.pagination.totalCount}
          />
        </div>
        {this.state.mapped.length === 0 ? <p>No Records Found</p> : <div></div>}
      </div>
    );
  }
}
export default Seeker;
Seeker.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};
