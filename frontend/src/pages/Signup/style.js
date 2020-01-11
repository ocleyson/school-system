import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const Header = styled.header`
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${colors.blue};
`;

export const DivForm = styled.div`
    width: 100%;
    max-width: 400px;
    margin: 20px 0px;

    p.error {
        color: ${colors.red};
        font-size: 16px;
        line-height: 28px;
    }

    .MyCardElement {
        height: 40px;
        padding: 10px 12px;
        width: 100%;
        color: #32325d;
        background-color: white;
        border-bottom: 2px solid ${colors.blue};
        border-radius: 4px;
        
        box-shadow: 0 1px 3px 0 #d2d7dd;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;

        margin-bottom: 40px;
    }

    .MyCardElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }

    .MyCardElement--invalid {
        border-color: #fa755a;
    }

    .MyCardElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
`;

export const Input = styled.input`
    border: none;
    font-size: 16px;
    margin-bottom: 40px;
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

export const DivSpinner = styled.div`
    display: contents;
    position: absolute;

    div.spinner-border {
        color: #FFF;
    }
`;

export const H1TitleBody = styled.h1`
    font-size: 20px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.medium};
    margin: 0px;

    &.price {
        margin-bottom: 40px;
        color: ${colors.green};
    }
`;

export const H1Title = styled.h1`
    font-family: 'Rajdhani', sans-serif;
    font-size: 27px;
    font-weight: ${fonts.medium};
    color: ${colors.primary};
    margin: 0;
`;

export const Span = styled.span`
    font-size: 16px;
    color: rgb(102, 102, 102);
    line-height: 28px;

    a {
        text-decoration: underline;
        color: rgb(102, 102, 102);
    }
`;
