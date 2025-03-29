import { MainContainer } from "../screens/ParticipantListStyles"
import ParticipantTable from '../components/ParticipantTable';
import Modal from 'react-bootstrap/Modal';



function ModalPartipantList(props) {
    const viewText = props.view === 'audience' ? 'Audience View' : 'Host View';
    return (
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <MainContainer className="MainContainer">
                    <h2>Participant List</h2>
                    <h4>({viewText})</h4>
                    <ParticipantTable view={props.view} ></ParticipantTable>
                </MainContainer>
            </Modal.Body>
        </Modal>
    );
}

export default ModalPartipantList;