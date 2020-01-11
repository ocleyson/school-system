import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import GlobalStyle from '../../styles/global';
import { DivContainer, DivFront, Input, Button, H1TitleBody, DivFrontContainer, DivSpinner } from './style';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();

    setLoading(true);

    var db = loadFirebase();

    try {

      await db.auth().signInWithEmailAndPassword(email, password)
      .then(res => {

        res.user.getIdTokenResult()
        .then(idTokenResult => {

          if(idTokenResult.claims.isStudent) {
            props.history.push('/authenticated/studentarea')
          } else {
            props.history.push('/authenticated/mainscreen')
          }

        });
        
      });

    } catch (err) {

      var error = translateFirebaseErrorToPtBr(err.code);

      setError(error);
      setLoading(false);

    }

  }

  return (
    <DivContainer>
      <GlobalStyle />
      
      <DivFrontContainer>
        
        <H1TitleBody>ESCOLA DIGITAL</H1TitleBody>

        <DivFront>
          <form onSubmit={(e) => login(e)} autoCapitalize="none">

            <Input
              autoComplete="off"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              autoComplete="off"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Link to="/forgotpassword"> 
              Esqueceu a senha?
            </Link>

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
                  <p>Entrar</p>
              }
            </Button>

          </form>
        </DivFront>

      </DivFrontContainer>

    </DivContainer>
  );
}

export default Login;