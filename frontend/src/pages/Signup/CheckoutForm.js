import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { DivForm, Input, Button, H1TitleBody, Span, DivSpinner } from './style';
import api from '../../services/api';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import { CardElement, injectStripe } from 'react-stripe-elements';
import { loadFirebase } from '../../services/db';

function CheckoutForm(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const cardStyle = {
        base: {
          color: "#32325d",
          fontFamily: 'Source Sans Pro, "Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        }
    };

    async function signup(e) {
        e.preventDefault();

        setLoading(true);

        if(name === '' || password === '' || email === '') {
            setError('Nenhum campo pode ficar em branco!');
            setLoading(false);
            return
        }

        var tokenObject = await props.stripe.createToken({name});

        if(tokenObject.error) {
            setError(tokenObject.error.message);
            setLoading(false);
            return
        }

        var db = loadFirebase();

        await api.post('/createaccount', {
            email,
            password,
            name,
            tokenObject
        }).then(() => {
            db.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                props.history.push('/authenticated/mainscreen')
            });
        }).catch(err => {
            
            var messageError = translateFirebaseErrorToPtBr(err.response.data.error);

            setError(messageError);
        })

        setLoading(false);

    }

    return (
        <div className="container">
            <DivForm>
                <form onSubmit={(e) => signup(e)}>

                    <H1TitleBody>E-mail:</H1TitleBody>
                    <Input
                        autoComplete="off"
                        autoCapitalize="none"
                        placeholder="Digite seu E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <H1TitleBody>Senha:</H1TitleBody>
                    <Input
                        autoComplete="off"
                        autoCapitalize="none"
                        placeholder="A senha deve conter no mínimo 6 caracteres"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <H1TitleBody>Cartão de Crédito:</H1TitleBody>
                    <CardElement className="MyCardElement" style={cardStyle} />

                    <H1TitleBody>Nome do Titular:</H1TitleBody>
                    <Input
                        autoComplete="off"
                        autoCapitalize="none"
                        placeholder="Nome que consta no cartão de crédito"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <H1TitleBody className="price">PREÇO: APENAS R$ 0.2 MENSAIS POR ALUNO</H1TitleBody>

                    <Span>
                        Ao criar a conta você concorda com os <Link to="/terms">Termos de uso</Link> e <Link to="terms">Políticas de pivacidade</Link>
                    </Span>

                    <p className="error">{error}</p>

                    <Button type="submit">
                    {loading 
                    ?
                        <DivSpinner>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </DivSpinner>
                    :
                        <p>Criar Conta</p>
                    }
                    </Button>

                </form>
            </DivForm>

        </div>
    )
}

export default withRouter(injectStripe(CheckoutForm));