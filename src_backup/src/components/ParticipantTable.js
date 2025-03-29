import React from 'react';
import { Table } from 'react-bootstrap';
import { TableContainer, TableCell, TableRow } from "./ParticipantTableStyles";
import styled from 'styled-components';
import mqtt from "mqtt";
import {getMqttClient} from "../mqttconfig";

const getColorForParticipant = (response) => {
    // Add logic here to determine color based on the participant's response
    // For example:
    switch (response) {
        case 'R':

            return '#DF1616'; // Red color
        case 'Y':

            return '#F0DB1C'; // Yellow color
        case 'G':

            return '#35DE83'; // Green color
        default:
            return '#484846'; // Default color
    }
};

export const ParticipantRectangle = styled.div`
    width: 35.873px;
    height: 23.743px;
    flex-shrink: 0;
    background: ${(props) => getColorForParticipant(props.response)};
`;

export default function ParticipantTable({ view }) {

    const isHostView = view === 'host';
    const [hashMap, setHashMap] = React.useState({});

    React.useEffect(() => {
        // MQTT connection

        // const brokerUrl = 'ws://receptivity.cs.vt.edu:9001';
        // const brokerOptions = {
        //     protocolId: 'MQTT',
        //     host: 'receptivity.cs.vt.edu',
        //     port: 9001,
        //     username: 'rec',
        //     password: 'eptivity',
        // };


        //const client = mqtt.connect(brokerUrl, brokerOptions);
        const client = getMqttClient(); // Get the singleton client

        const topic = '001/participants';

        // Handle MQTT connection event
        client.on('connect', () => {
            client.subscribe(topic, (err) => {
                if (!err) {
                    //console.log(`Subscribed to MQTT topic: ${topic}`);
                }
            });
        });

        // Handle incoming MQTT messages
        client.on('message', (topic, message) => {
            // Assuming the message received is a JSON object representing the new hashMap

            const newHashMap = JSON.parse(message.toString());
            setHashMap(newHashMap); // Update the state with the new hashMap
        });

        // Clean up the MQTT connection when the component unmounts
        return () => {
            client.end();
        };
    }, []);


    return (
        <>
            <TableContainer>
                <Table>
                    <tbody>
                        {hashMap && Object.entries(hashMap)?.map(([participantId, response]) => (
                            <TableRow key={participantId}>
                                <TableCell>{participantId}</TableCell>
                                {isHostView && (
                                    <TableCell className="d-flex justify-content-end">
                                        <ParticipantRectangle response={response} />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </TableContainer>
        </>
    )
}
