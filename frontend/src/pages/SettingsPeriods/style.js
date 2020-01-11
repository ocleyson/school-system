import styled from 'styled-components';
import {colors, fonts} from '../../styles';

export const DivContainer = styled.div`
    margin-left: 300px;
    color: white;
    
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

export const InputFromSchema = styled(Input)`
    display: flex;
    width: 100px;
    flex-grow: 1;
`;

export const DivSave = styled.div`
    float: right;
    padding: 5px;
    background-color: ${colors.primary};
    color: #FFF;
    border-radius: 5px;
    cursor: pointer;
`;

export const DivDelete = styled(DivSave)`
    background-color: transparent;
    border: 1px solid ${colors.red};
    color: ${colors.red};
    padding: 4px;
    margin-right: 15px;

    &:hover {
        background-color: ${colors.red};
        color: #FFF;
    }
`;

export const Label = styled.label`
    display: flex;
    align-items: center;
    color: white;
    font-size: 15px;
    margin: 0 0 5px 45px;

    input {
        margin-right: 5px;
    }
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

export const DivRemove = styled(DivAdd)`
    background-color: #bcbcbc;
    margin-right: 3px;
`;

export const DivInputFields = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    height: 30px;
`;

export const DivContainerField = styled.div`
    margin-bottom: 10px;
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

export const DivScroll = styled.div`
    overflow-x: auto;
    overflow-y: hidden;

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

export const DivInterference = styled.div`
    width: 100%;
    background-color: ${colors.secondary};
    padding: 5px 10px 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    max-width: 400px;
    margin-bottom: 10px;
    border-radius: 50px;

    a {
        display: contents;
        &:hover {
            text-decoration: none;
        }
    }
`;

export const DivTitleSubNav = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    color: white;
    cursor: pointer;
`;

export const DivSpinner = styled.div`
    color: ${colors.primary};
`;