import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const HeaderNavContainer = styled.header`
    background-color: ${colors.primary};
    height: 60px;
`;

export const DivNav = styled.div`
    width: 100%;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
`;

export const H1Title = styled.h1`
    font-size: 37px;
    font-family: 'Rajdhani',sans-serif;
    font-weight: ${fonts.semi_bold};
    color: #FFF;
    display: inline;
    margin: 0;
`;

export const DivButtons = styled.div`
    display: flex;
    align-items:  center;
    margin-left: 10px;

    a {
        padding: 0px 20px;
        line-height: 38px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        color: ${colors.primary};
        background-color: rgb(255, 255, 255);
        border-radius: 5px;
    }
`;

export const Section = styled.section`
    padding: 60px 0px;

    h2 {
        color: rgb(75, 75, 75);
        font-size: 36px;
        line-height: 48px;
    }

    p {
        color: rgb(79, 79, 79);
        font-size: 18px;
        line-height: 32px;
        margin: 10px 0px 0px;
    }

    svg {
        color: ${colors.primary};

        @media(max-width: 800px) {
            display: none;
        }
    }
`;

export const SectionBlue = styled(Section)`
    background-color: ${colors.primary};

    h2 {
        color: rgb(255, 255, 255);
    }

    p {
        color: rgb(221, 213, 248);
    }

    svg {
        color: white;
    }
`;

export const DivConatiner = styled.div`
    display: flex;
    flex-direction: row;
    -moz-box-align: center;
    align-items: center;
    -moz-box-pack: justify;
    justify-content: space-between;
`;

export const DivText = styled.div`
    width: calc(50% - 20px);

    @media(max-width: 800px) {
        width: 100%;
        text-align: center;
    }
`;

export const Footer = styled.p`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0px auto;
    padding: 25px 10px;
    line-height: 1;
    font-size: 16px;
    color: rgb(102, 102, 102);
    justify-content: center;
    flex-direction: column;

    span {
        line-height: 28px;
    }

    a {
        text-decoration: none;
        color: rgb(102, 102, 102);

        &:hover {
            text-decoration: underline;
        }
    }
    
`;