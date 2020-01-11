import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const Header = styled.header`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${colors.blue};
`;

export const H1Title = styled.h1`
    font-family: 'Rajdhani', sans-serif;
    font-size: 27px;
    font-weight: ${fonts.medium};
    color: ${colors.primary};
    margin: 0;
`;

export const Main = styled.div`
    margin: 10px 0px 50px 0px;

    h1 {
        font-size: 20px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: ${fonts.medium};
        margin: 0px;
        cursor: pointer;

        &.title {
            display: inline-block;
        }

        &.service {
            color: ${props => props.select ? 'black' : 'rgb(75, 75, 75)'};
        }

        &.privacy {
            color: ${props => !props.select ? 'black' : 'rgb(75, 75, 75)'};
        }
    }

    h2 {
        color: rgb(75, 75, 75);
        font-size: 30px;
        line-height: 48px;
    }

    p {
        color: rgb(79, 79, 79);
        font-size: 18px;
        line-height: 32px;
        margin: 10px 0px 0px;
    }

    div {
        margin-top: 16px;
        width: 100%;
        max-width: 600px;

        &.service {
            display: ${props => props.select ? 'block' : 'none'};
        }

        &.privacy {
            display: ${props => !props.select ? 'block' : 'none'};
        }
    }

`;
