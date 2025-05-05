import React from 'react'
import { MainContainer } from './ParticipantListStyles';
import ParticipantTable from '../../components/ParticipantTable/ParticipantTable';
//import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';



export default function ParticipantList({ view }) {
    const viewText = view === 'audience' ? 'Audience View' : 'Host View';
    //const location = useLocation();
    const navigate = useNavigate();

    const getBackPath = () => {
        return view === 'audience' ? '/student' : '/host';
    };

    const handleBackClick = () => {
        navigate(getBackPath());
    };



    return (
        <> <Navbar expand="lg" className="bg-body-tertiary container-fluid">
            <div className="d-flex justify-content-start align-items-center">
                <Nav.Link onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {' Back'}
                </Nav.Link>
            </div>

        </Navbar>
            <MainContainer className="MainContainer">
                <h2>Participant List</h2>
                <h4>({viewText})</h4>
                <ParticipantTable view={view}></ParticipantTable>
            </MainContainer>
        </>
    )
}