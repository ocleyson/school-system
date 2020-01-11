import styled from 'styled-components';
import {colors, fonts} from '../../styles';


export const DivContainer = styled.div`
    margin-left: 300px;
    @media (max-width: 800px) {
        margin-left: 0px;
    }
`;

export const H1TitleClass = styled.h1`
    font-family: 'Rajdhani', sans-serif;
    font-size: 30px;
    font-weight: ${fonts.medium};
    color: #FFF;
    margin: 0;

    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;

    @media (max-width: 800px) {
        margin: 0 0 0 45px;
    }
`;

export const DivTitleClass = styled.div`
    max-width: 200px;
`;

export const DivNavButton = styled.div`
    background-color: ${colors.primary};
    height: 34px;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    margin: 0 0 0 25px;

    position: relative;
    display: flex;
    align-items: center;

    svg {
        color: ${colors.secondary};
    }

    @media (max-width: 630px) {
        border-radius: 50px;
        padding: 0;
        width: 34px;
        display: flex;
        justify-content: center;
    }
`;

export const H1NavButton = styled.h1`
    font-size: inherit;
    color: rgb(255, 255, 255);
    margin: 0 5px 0 0;

    @media (max-width: 630px) {
        display: none;
    }
`;

export const H1TitleBody = styled(H1TitleClass)`
    color: #000;
    font-size: 27px;
    margin: 0 !important;
`;

export const DivTitleBody = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0px;
    justify-content: center;
`;

export const Main = styled.main`
    width: 100%;
    padding: 0 10px;
`;

export const TableGrades = styled.table`
    width: 100%;
    background-color: ${colors.secondary};
    border-radius: 5px;
    color: white;

    th {
        text-transform: capitalize;
    }

    td, th {
        padding: 10px 5px;
        border-right: 1px solid white;
        &:last-child {
            border: none;
        }
    }

    input {
        width: 100%;
        border: none;
        border-radius: 5px;
        padding: 3px;
    }
`;

export const Tr = styled.tr`
    background-color: ${props => props.bgcolor ? colors.primary : colors.secondary};
`;

export const DivSave = styled.div`
    float: right;
    padding: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    border-radius: 5px;
    cursor: pointer;

    h1 {
        font-size: 20px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: ${fonts.medium};
        margin: 0;
        color: #FFF;
    }
`;

export const DivCancel = styled(DivSave)`
    background-color: #6c757d;
    margin-right: 15px;
`;

export const DivStudentModal = styled.div`
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

        input.inputGrades {
            margin-bottom: 10px;
            width: 100%;
            border-radius: 5px;
            padding: 5px;
            margin-bottom: 10px;
            border: 2px solid #c9c9c9;
            font-family: Arial, Helvetica, sans-serif;

            &:focus {
                border-color: ${colors.secondary};
            }
        }

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

    div.bottom {
        border-top: 1px solid rgba(107, 170, 222, 0.6);
        padding: 10px;
        display: table;
        width: 100%;
    }
`;

export const DivError = styled.div`
    display: ${props => props.show ? 'table' : 'none'};
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    background-color: ${colors.red};
    margin-bottom: 5px;
    min-height: 30px;
    color: #FFF;

    p {
        display: inline;
        margin: 0 5px;
    }
`;

export const DivSpinner = styled.div`
    color: ${colors.primary};
`;