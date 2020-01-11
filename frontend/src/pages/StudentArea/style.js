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

export const DivNav = styled.div`
    width: 100%;
    background-color: ${colors.secondary};
    padding: 5px 10px 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const DivOthers = styled.div`
    background-color: ${props => props.bgcolor ? 'white' : colors.primary};
    height: 34px;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    margin: 0 0 0 25px;

    position: relative;
    display: flex;
    align-items: center;

    h1 {
        font-size: inherit;
        color: ${props => props.bgcolor ? colors.primary : 'white'};
        margin: 0 5px 0 0;
    }

    @media (max-width: 630px) {
        border-radius: 50px;
        padding: 0;
        width: 34px;
        display: flex;
        justify-content: center;

        h1 {
            display: none;
        }
    }
`;

export const TableReport = styled.table`
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
    text-transform: capitalize;
`;

export const TableReportHeader = styled(TableReport)`
    border: 1px solid black;
    margin-bottom: 10px;
`;

export const H1TitleBody = styled(H1TitleClass)`
    color: #000;
    font-size: 27px;
    margin: 0 !important;
`;

export const DivTitleBody = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0px 0px 0px;
    justify-content: center;
`;

export const DivTableReport = styled.div`
    padding: 10px;
    width: 100%;
    display: ${props => props.show ? 'block' : 'none'};

    td, th {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 5px;
        text-align: left;
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