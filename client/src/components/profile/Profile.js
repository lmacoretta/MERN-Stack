import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import { getProfileById } from '../../actions/profileActions';

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);

  return (
    <Fragment>
      {
        profile === null || loading ? (<Spinner />) : (<Fragment>
          <Link to='/profiles' className="btn btn-light">
            Back to profiles
          </Link>
          {
            auth.isAuntheticated && auth.loading === false && auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className="btn btn-dark">
                Edit profile
              </Link>
            )
          }
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
          </div>
        </Fragment>)
      }
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.object.isRequired,
  profile: PropTypes.func.isRequired,
  auth: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile);
