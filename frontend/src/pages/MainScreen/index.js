import React, { Component } from 'react';
import {DivContainer, H1TitleBody} from './style';

class MainScreen extends Component {
    render() {
        return (
            <div style={{height: '100%'}}>

                <DivContainer>
                    <H1TitleBody>
                        Selecione uma Turma.
                    </H1TitleBody>
                </DivContainer>
            </div>
        )
    }
}

export default MainScreen;