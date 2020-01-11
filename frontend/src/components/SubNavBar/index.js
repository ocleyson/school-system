import React from 'react';
import { Container } from './style';

export default function SubNavBar(props) {
    return (
        <Container>
            {props.children}
        </Container>
    )
}