import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const DivContainer = styled.div`
    margin-left: 300px;
    @media (max-width: 800px) {
        margin-left: 0px;
    }
`;

export const H1Title = styled.h1`
    font-family: 'Rajdhani', sans-serif;
    font-size: 27px;
    font-weight: ${fonts.medium};
    color: #FFF;
    margin: 0;

    @media (max-width: 800px) {
        margin: 0 0 0 40px;
    }
`;

export const Main = styled.main`
    width: 100%;
    padding: 5px 10px;
    position: relative;

    p.error {
        color: ${colors.red};
    }
`;

export const H1TitleBody = styled.h1`
    font-size: 20px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.medium};
    margin: 0;
`;

export const Input = styled.input`
    width: 100%;
    max-width: 380px;
    border-radius: 5px;
    padding: 5px;
    margin-bottom: 10px;
    border: 2px solid ${colors.secondary};

    &:focus {
        border-color: #c9c9c9;
    }
`;

export const DivSave = styled.div`
    float: left;
    padding: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    border-radius: 5px;
    width: 60px;
    height: 34px;
    cursor: pointer;
`;

export const DivSpinner = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    div.spinner-border {
        width: 1.8rem;
        height: 1.8rem;
        color: ${colors.secondary};
    }
`;