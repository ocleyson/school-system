import styled from 'styled-components';
import {colors, fonts} from '../../styles';


export const DivContainer = styled.div`
    margin-left: 300px;

    @media (max-width: 800px) {
        margin: 0;
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

export const DivContainerSubject = styled.div`
    box-sizing: border-box;
    display: inline-block;
    width: 50%;
    padding: 3px;
    max-width: 150px;
    height: 150px;
`;

export const ButtonSubject = styled.button`
    background-color: ${colors.secondary};
    box-sizing: border-box;
    font-size: 20px;
    width: 100%;
    height: 100%;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 1px;
    border: none;

    p {
        color: white;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
    }
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