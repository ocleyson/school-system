import React from 'react';
import { Container, H1TitleBody } from './style';
import { Link } from 'react-router-dom';
import GlobalStyle from '../../styles/global';

export default function NotFoundPage() {

    return (
        <Container>
            <GlobalStyle />

            <H1TitleBody>
                Página não encontrada. Ir à&nbsp;<Link to="/">Home</Link>
            </H1TitleBody>
        </Container>
    )
}