import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const Container = styled.div`
    height: 100%;
    background-color: ${colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;

    a {
        color: white;
        text-decoration: underline;
    }
`;

export const H1TitleBody = styled.h1`
    color: #FFF;
    font-size: 37px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.semi_bold};
    border-radius: 50px;
    
`;