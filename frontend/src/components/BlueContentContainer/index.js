import React from 'react';
import { Container } from './style';

export default function BlueContentContainer(props) {
    return (
        <Container>
            {props.children}
        </Container>
    )
}