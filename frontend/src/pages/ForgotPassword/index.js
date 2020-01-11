import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { loadFirebase } from '../../services/db';
import translateFirebaseErrorToPtBr from '../../libs/translateFirebaseErrorToPtBr';
import GlobalStyle from '../../styles/global';
import {DivContainer, DivFront, Input, Button, H1TitleBody, DivFrontContainer, DivSpinner} from './style';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendEmail(e) {
    e.preventDefault();

    setLoading(true);

    var db = loadFirebase();

    try {

      await db.auth().sendPasswordResetEmail(email)
      .then(() => {
        setEmailSent(true);
        setError('');
      })

    } catch (err) {

      var error = translateFirebaseErrorToPtBr(err.code);

      setError(error)
      setEmailSent(false);

    }

    setLoading(false);

  }

  return (
      <DivContainer>
        <GlobalStyle />
        
        <DivFrontContainer>
          
          <H1TitleBody>REDEFINIR SENHA</H1TitleBody>

          <DivFront>
            <form onSubmit={(e) => sendEmail(e)} autoCapitalize="none">

              <Input
                autoComplete="off"
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Link className="login" to="/login"> 
                Lembrou da senha? Entre!
              </Link>

              <p style={{display: emailSent ? 'block' : 'none', fontSize: 16, lineHeight: '28px'}}>Email enviado. <Link to="/login">Entrar!</Link></p>

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
                  <p>Enviar</p>
              }
            </Button>

            </form>
          </DivFront>
        </DivFrontContainer>
      </DivContainer>
  );
}

export default ForgotPassword;