import styled from 'styled-components';
import {colors} from '../../styles';

export const DivBackNav = styled.div`
    height: 100vh;
    flex-direction: row;
    position: fixed;
    left: 0px;
    width: inherit;
    z-index: 300;
    display: block;
    width: 100%;
    max-width: 300px;
    background-color: ${colors.primary};
    padding: 10px 0px 0px 10px;

    @media (max-width: 800px) {
        transform: ${props => props.show ? 'translateX(0%)' : 'translateX(-100%)'};
        transition: transform ${props => props.show === null ? '0ms' : '500ms'} ease-in-out;
    }
`;

export const DivMainIcons = styled.div`
    width: 28px;
    margin-top: -20px;
    float: left;

    svg {
        color: white;
        cursor: pointer;
        margin-top: 20px;

        &.arrow {
            display: none;

            @media (max-width: 800px) {
                display: block;
            }
        }
    }
`;

export const DivItem = styled.div`
    height: 39px;
    width: 69%;
    background-color: ${colors.secondary};
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 5px;
    margin: 2px auto 5px auto;
`;

export const H1Item = styled.h1`
    font-size: 19px;
    color: white;
    position: relative;
    font-family: 'Rajdhani', sans-serif;
    margin: 0;
    
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all;
`;

export const DivMenuIcon = styled.div`
    display: none;
    position: absolute;
    margin-top: 8px;
    margin-left: 10px;

    @media (max-width: 800px) {
        display: block;
    }
`;

export const DivItemContainer = styled.div`
    display: ${props => props.show ? 'block' : 'none'};
    float: right;
    width: 88%;
    height: 100%;
    overflow-x: auto;
`;

export const DivSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -33px;

    div.spinner-border {
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
        color: #FFF;
    }
`;