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
    padding: 10px;
    position: relative;
`;

export const H1TitleBody = styled.h1`
    font-size: 20px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.medium};
    margin: 0;
`;

export const Input = styled.input`
    width: 100%;
    border: none;
    border-radius: 5px;
    padding: 3px;
    margin: 5px 0;
    height: 30px;
`;

export const DivSave = styled.div`
    float: right;
    padding: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    border-radius: 5px;
    cursor: pointer;
`;

export const DivDelete = styled(DivSave)`
    background-color: transparent;
    border: 1px solid ${colors.red};
    color: ${colors.red};
    padding: 4px;
    margin-right: 15px;

    &:hover {
        background-color: ${colors.red};
        color: #FFF;
    }
`;

export const DivError = styled.div`
    display: table;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    background-color: ${colors.red};
    margin-bottom: 5px;
    min-height: 30px;

    p {
        display: inline;
        margin: 0 5px;
    }
`;

export const DivSpinner = styled.div`
    color: ${colors.primary};
`;