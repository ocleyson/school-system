import styled from 'styled-components';
import {colors} from '../../styles';

export const DivStudent = styled.div`
    height: 39px;
    width: 69%;
    background-color: ${colors.secondary};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 5px;
    margin: 5px auto;
`;

export const H1Student = styled.h1`
    font-size: 19px;
    color: white;
    position: relative;
    font-family: 'Rajdhani', sans-serif;
    margin: 0;
`;

export const DivSearch = styled.div`
    height: 34px;
    border-radius: 50px;
    background-color: #FFF;
    display: flex;
    align-items: center;
    border: 1px solid ${colors.secondary};
`;

export const Input = styled.input`
    border: none;
    border-radius: 50px 0px 0px 50px;
    padding: 5px;
    display: flex;
    flex-grow: 1;
    width: 181px;
    font-family: Arial, Helvetica, sans-serif;

    @media (max-width: 630px) {
        width: 1px;
    }
`;

export const DivIcon = styled.div`
    background-color: #FFF;
    border-radius: 0px 50px 50px 0px;
    display: inline;
    padding: 0px 10px;
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

export const DivModal = styled.div`
    display: ${props => props.show ? 'flex' : 'none'};
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(1, 1, 1, 0.6);
    z-index: 100000;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    overflow: hidden;
    font-family: 'Rajdhani', sans-serif;

    div.main {
        display: block;
        width: 100%;
        background-color: white;
        border-radius: 5px;
        max-width: 450px;
        max-height: 500px;
        overflow-y: auto;
        word-break: break-word;
        margin: 10px;

        svg.exit {
            float: right;
            cursor: pointer;
            margin: 5px 5px 0px 0px;
        }
    }

    div.title {
        border-bottom: 1px solid rgba(107, 170, 222, 0.6);
        padding: 10px;
    }

    div.body {
        padding: 10px;
        width: 100%;
        min-height: 100px;
    }
`;

export const DivSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;

    div.spinner-border {
        color: ${colors.primary};
    }
`;