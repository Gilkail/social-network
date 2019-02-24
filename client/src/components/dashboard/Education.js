import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';


class Education extends Component {
    onDeleteClick = (id) => {
        this.props.deleteEducation(id);
    }
    render() {
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td><Moment format="DD/MM/YYYY">{edu.from}</Moment> - <Moment format="DD/MM/YYYY">{edu.to ? edu.to : moment()}</Moment></td>
                <td><button className="btn btn-danger" type="button" onClick={() => this.onDeleteClick(edu._id)}>Delete</button></td>
            </tr>
        ))
        return (
            <div>
                <h4 className="mb-4">Education Credentials</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {education}
                    </tbody>
                </table>
            </div>
        )
    }
}

Education.propTypes = {
    deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(withRouter(Education));