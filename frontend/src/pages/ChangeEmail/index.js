import React, { useState } from 'react';
import { DivContainer, H1Title, Main, H1TitleBody, Input, DivSave, DivSpinner } from './style';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import SubNavBar from '../../components/SubNavBar';
import BlueContentContainer from '../../components/BlueContentContainer';
import api from '../../services/api';

export default function ChangeEmail(props) {
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    async function save() {
        setUpdating(true);

        var user = loadFirebase().auth().currentUser;
        var currentEmail = loadFirebase().auth().currentUser.email;
        var credential = loadFirebase().auth.EmailAuthProvider.credential(currentEmail, password)

        try {
            await user.reauthenticateAndRetrieveDataWithCredential(credential)

            await user.updateEmail(newEmail)

            var collection = props.idToken.claims.isAdmin ? 'schools' : 'schoolStudents';

            await loadFirebase().firestore().collection(`${collection}`)
            .doc(`${loadFirebase().auth().currentUser.uid}`)
            .set({
                email: newEmail
            }, { merge: true })

            if(props.idToken.claims.isAdmin) {
                await api.post('/changecustomeremail', {
                    email: newEmail
                }, {
                    headers: {
                        authorization: props.idToken.token
                    }
                })
            }

            setError('');
        } catch (err) {

            var error = translateFirebaseErrorToPtBr(err.code)

            setError(error);

        }

        setUpdating(false);
        setPassword('');
        setNewEmail('');
    }

    return (
        <DivContainer>

            <SubNavBar>
                <H1Title>Alterar E-mail</H1Title>
            </SubNavBar>

            <Main>

                <BlueContentContainer>

                    <H1TitleBody>Novo E-mail:</H1TitleBody>
                    <Input
                        type="email"
                        placeholder="Digite seu novo email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />

                    <H1TitleBody>Senha:</H1TitleBody>
                    <Input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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