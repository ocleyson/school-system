import React, { useState } from 'react';
import { DivContainer, H1Title, Main, H1TitleBody, Input, DivSave, DivSpinner } from './style';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    async function save() {
        setUpdating(true);

        var user = loadFirebase().auth().currentUser;
        var currentEmail = loadFirebase().auth().currentUser.email;
        var credential = loadFirebase().auth.EmailAuthProvider.credential(currentEmail, currentPassword);

        try {
            await user.reauthenticateAndRetrieveDataWithCredential(credential);

            await user.updatePassword(newPassword);

            setError('');
        } catch (err) {

            var error = translateFirebaseErrorToPtBr(err.code);

            setError(error);
        }

        setUpdating(false);
        setCurrentPassword('');
        setNewPassword('');
    }

    return (
        <DivContainer>

            <SubNavBar>
                <H1Title>Alterar Senha</H1Title>
            </SubNavBar>

            <Main>

                <BlueContentContainer>

                    <H1TitleBody>Senha Atual:</H1TitleBody>
                    <Input
                        type="password"
                        placeholder="Digite sua senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <H1TitleBody>Nova Senha:</H1TitleBody>
                    <Input
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <p className="error" >{error}</p>

                    <DivSave onClick={() => save()}>
                        {updating 
                            ?
                                <DivSpinner>
                                    <div className="spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </DivSpinner>
                            :
                                <H1TitleBody>Salvar</H1TitleBody>
                        }
                    </DivSave>

                </BlueContentContainer>

            </Main>
        </DivContainer>
    )
}