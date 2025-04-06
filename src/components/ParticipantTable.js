import React from 'react';
import { Table } from 'react-bootstrap';
import { TableContainer, TableCell, TableRow } from "./ParticipantTableStyles";
import styled from 'styled-components';
import { getMqttClient } from "../mqttconfig";

// Utility to determine box color
const getColorForParticipant = (response) => {
    switch (response) {
        case 'R': return '#DF1616'; // Red
        case 'Y': return '#F0DB1C'; // Yellow
        case 'G': return '#35DE83'; // Green
        default: return '#484846'; // Default gray
    }
};

// Styled rectangle component
export const ParticipantRectangle = styled.div`
    width: 35.873px;
    height: 23.743px;
    flex-shrink: 0;
    background: ${(props) => getColorForParticipant(props.response)};
`;

// Main component
export default function ParticipantTable({ view }) {
    const isHostView = view === 'host';
    const [hashMap, setHashMap] = React.useState({});
    const topic = '001/participants';

    React.useEffect(() => {
        const client = getMqttClient();

        const handleMessage = (topic, message) => {
            try {
                const newHashMap = JSON.parse(message.toString());
                setHashMap(newHashMap);
            } catch (err) {
                console.error("Invalid JSON from MQTT message:", err);
            }
        };

        const handleConnect = () => {
            client.subscribe(topic, (err) => {
                if (err) console.error("Subscription error:", err);
            });
        };

        client.on('connect', handleConnect);
        client.on('message', handleMessage);

        return () => {
            client.off('connect', handleConnect);
            client.off('message', handleMessage);
            // No client.end() since we're assuming shared client
        };
    }, []);

    return (
        <TableContainer>
            <Table>
                <tbody>
                    {Object.keys(hashMap).length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2}>No participants yet.</TableCell>
                        </TableRow>
                    ) : (
                        Object.entries(hashMap).map(([participantId, response]) => (
                            <TableRow key={participantId}>
                                <TableCell>{participantId}</TableCell>
                                {isHostView && (
                                    <TableCell className="d-flex justify-content-end">
                                        <ParticipantRectangle response={response} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </tbody>
            </Table>
        </TableContainer>
    );
}
