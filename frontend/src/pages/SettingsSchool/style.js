import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const DivContainer = styled.div`
    margin-left: 300px;

    p.changepassword {
        cursor: pointer;
        font-weight: ${fonts.semi_bold};
        margin: 0;
    }

    @media (max-width: 800px) {
        margin-left: 0px;
    }
`;

export const H1Title = styled.h1`
    font-family: 'Rajdhani', sans-serif;
    font-size: 27px;
    font-weight: ${fonts.medium};
    color: #FFF;
    margin: 0;

    @media (max-width: 800px) {
        margin: 0 0 0 40px;
    }
`;

export const Main = styled.main`
    width: 100%;
    padding: 10px;
    position: relative;
`;

export const H1TitleBody = styled.h1`
    font-size: 20px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: ${fonts.medium};
    margin: 0;
`;

export const Input = styled.input`
    width: 100%;
    border: none;
    border-radius: 5px;
    padding: 3px;
    margin: 5px 0;
    height: 30px;
`;

export const DivSave = styled.div`
    float: right;
    padding: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    border-radius: 5px;
    cursor: pointer;
`;

export const DivCancel = styled(DivSave)`
    background-color: #6c757d;
    margin-right: 15px;
`;

export const DivDropdown = styled.div`
    display: block;
    font-family: 'Rajdhani', sans-serif;
    margin-left: 0px;

    div.dropdown-menu {
        background-color: white;
        top: 4px !important;
        padding: 0;
    }

    button.dropdown-item {
        font-weight: 600;
        color: ${colors.secondary} !important;
        &:hover {
            color: white !important;
            background-color: ${colors.secondary};
        }
    }

`;

export const Button = styled.button.attrs({
    className: "dropdown-toggle"
})`
    background-color: transparent;
    border: none;
    color: #FFF;
    padding: 3px;
    border-radius: 50px;
    font-size: 18px;
    font-weight: ${fonts.semi_bold};
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

        svg {
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

    p {
        display: inline;
        margin: 0 5px;
    }
`;

export const DivSpinner = styled.div`
    color: ${colors.primary};
`;

export const DivWithBorder = styled.div`
    width: 100%;
    border: 2px solid white;
    border-radius: 5px;
    padding: 5px 37px 5px 5px;
    margin-bottom: 5px;
    position: relative;
`;

export const DivAdd = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    width: 28px;
    background-color: ${colors.primary};
    border-radius: 50px;
    cursor: pointer;
`;

export const DivRemoveAbsolute = styled(DivAdd)`
    background-color: #bcbcbc;
    margin-right: 3px;
    position: absolute;
    top: 0;
    right: 0;
    margin: 5px 5px 0 0;
`;