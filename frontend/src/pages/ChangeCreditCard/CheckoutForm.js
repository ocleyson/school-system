import React, { useState } from 'react';
import { Main, H1TitleBody, Input, DivSpinner, Button } from './style';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import BlueContentContainer from '../../components/BlueContentContainer';
import api from '../../services/api';
import { CardElement, injectStripe } from 'react-stripe-elements';

function CheckoutForm(props) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [name, setName] = useState('');
    const [cardRef, setCardRef] = useState({});

    const cardStyle = {
        base: {
          color: "#32325d",
          fontFamily: 'inherit, Source Sans Pro, "Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "inherit",
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        }
    };

    async function save(e) {
        e.preventDefault();

        setUpdating(true);

        var user = loadFirebase().auth().currentUser;
        var currentEmail = loadFirebase().auth().currentUser.email;
        var credential = loadFirebase().auth.EmailAuthProvider.credential(currentEmail, password)

        try {
            await user.reauthenticateAndRetrieveDataWithCredential(credential)

            if(name === ''){
                setError('O nome do titular precisa ser digitado.');
                setUpdating(false);
                return
            };

            var tokenObject = await props.stripe.createToken({name});

            if(tokenObject.error) {
                setError(tokenObject.error.message);
                setUpdating(false);
                return
            }

            await api.post('/changecreditcard', {
                tokenObject
            }, {
                headers: {
                    authorization: props.idToken.token
                }
            })

            cardRef.clear();

            setError('');
            setName('');
        } catch (err) {
    
            var error = translateFirebaseErrorToPtBr(err.code)

            setError(error);

        }

        setUpdating(false);
        setPassword('');
    }

    return (
        <Main>

            <BlueContentContainer>

                <form onSubmit={(e) => save(e)}>

                    <H1TitleBody>Cartão de Crédito:</H1TitleBody>
                    <CardElement className="MyCardElement" style={cardStyle} onReady={(c) => setCardRef(c)} />

                    <H1TitleBody>Nome do Titular:</H1TitleBody>
                    <Input
                        type="text"
                        placeholder="Nome que consta no cartão"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <H1TitleBody>Senha:</H1TitleBody>
                    <Input
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <p className="error" >{error}</p>

                    <Button>
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
                    </Button>

                </form>

            </BlueContentContainer>

        </Main>
    )
}

export default injectStripe(CheckoutForm);