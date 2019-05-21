import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfile } from '../../actions/profileActions';

import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from '../profile-forms/Experience';
import Education from '../profile-forms/Education';

const Dashboard = ({ getProfile, auth: { user }, profile: { profile, loading } }) => {
  useEffect(() => {
    getProfile();
  }, []);

  return loading && profile === null ? <Spinner /> : <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user"></i>Welcome {user && user.name}</p>

    {
      profile ?
        <Fragment>
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />
        </Fragment>

        : <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className="btn btn-primary my-1">
            Create profile
       </Link>
        </Fragment>
    }
  </Fragment>
};

Dashboard.propTypes = {
  getProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getProfile })(Dashboard);
