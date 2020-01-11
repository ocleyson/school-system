import styled from 'styled-components';
import {colors} from '../../styles';

export const DivMain = styled.div`
    width: 100%;

    div.row {
        justify-content: center;
        margin: 0;

        @media (max-width: 800px) {
            justify-content: none;
            margin: 0;
            width: 100%;
        }
    }

    div.mixed-chart {
        width: 100%;

        @media (max-width: 800px) {
            position: relative;
            top: 0;
            transform: none;
            margin-top: 10px;
            width: 100%;
        }
    }

`;

export const DivMainChart = styled.div`
    display: flex;
    height: 450px;

    @media (max-width: 800px) {
    height: ${props => props.customHeight}px;
    }

    div.divchart {
        width: 100% !important;
    }
`;

export const H1TitleChart = styled.h1`
    color: ${colors.blue};
    margin: 0;
`;

export const DivChartHeader = styled.div`
    display: flex;
    align-items: center;
    margin: 0px 0px 10px 10px;

    @media (max-width: 700px) {
        margin-left: 10px;
    }
`;

export const DivScroll = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    margin-left: 10px;

    ul {
        overflow: hidden;
        margin: 0;
        padding: 0;
        list-style: none;
        display: table;

        li {
            display: table-cell;
            vertical-align: middle;
        }
    }

`;

export const DivScrollElement = styled.div`
    border-radius: 50px;
    background-color: ${props => props.bgcolor ? colors.blue : colors.secondary};
    padding: 5px 10px;
    cursor: pointer;
    width: 120px;
    margin: 10px 5px 10px 0px;
    height: 31px;

    h1 {
        font-size: 16px;
        margin: 0;
        color: #FFF;
        display: inline;
    }
`;
