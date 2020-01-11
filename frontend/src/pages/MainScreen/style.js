import styled from 'styled-components';
import {colors, fonts} from '../../styles';


export const DivContainer = styled.div`
    margin-left: 300px;
    height: 100%;
    background-color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    @media (max-width: 800px) {
        margin-left: 0px;
    }
`;

export const H1TitleBody = styled.h1`
    color: #FFF;
    font-size: 20px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.medium};
    margin: 0;
    padding: 5px 10px;
    background-color: ${colors.primary};
    border-radius: 50px;
`;