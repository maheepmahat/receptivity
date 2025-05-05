import React from "react";
import "./FeedbackOptionStyles.js";
import { Button, Container, Image } from "./FeedbackOptionStyles.js";

function FeedbackOption(props) {
    const { btnProperty, func } = props;

    // Removed any role-based control as all users should now be able to interact equally
    return (
        <Container className="Container">
            <Button onClick={() => func(btnProperty._id)}>
                <Image
                    src={btnProperty.icon}
                    style={{ backgroundColor: btnProperty.color }}
                />
            </Button>
            <h4>{btnProperty.label}</h4>
        </Container>
    );
}

export default FeedbackOption;
