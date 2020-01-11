import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const DivContainer = styled.div`
    height: 100%;
    background-color: ${colors.primary};
    padding: 0px 10px;
`;

export const DivFront = styled.div`
    width: 100%;
    border-radius: 5px;
    background-color: #FFF;
    position: relative;
    padding: 10px;

    a.login {
        float: right;
        margin-top: -40px;
        font-size: 16px;
        line-height: 28px;
    }

    p.error {
        color: ${colors.red};
        font-size: 16px;
        line-height: 28px;
    }
`;

export const DivFrontContainer = styled.div`
    width: 100%;
    max-width: 350px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
`;

export const Input = styled.input`
    border: none;
    font-size: 16px;
    margin-bottom: 45px;
    height: 40px;
    padding: 10px 12px;
    width: 100%;
    color: #32325d;
    background-color: white;
    border-bottom: 2px solid ${colors.blue};
    border-radius: 4px;

    box-shadow: 0px 1px 3px 0px #d2d7dd;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
    
`;

export const Button = styled.button`
    width: 100%;
    border: none;
    border-radius: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    font-size: 16px;
    font-weight: ${fonts.semi_bold};
    height: 40px;

    p {
        margin: 0;
    }
`;

export const TagA = styled.p`
    float: right;
    margin-top: -40px;
`;

export const H1TitleBody = styled.h1`
    color: #FFF;
    font-size: 37px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.semi_bold};
    background-color: ${colors.primary};
    border-radius: 50px;
    display: flex;
    justify-content: center;
`;

export const DivSpinner = styled.div`
    display: contents;
    position: absolute;

    div.spinner-border {
        color: #FFF;
    }
`;
