import React from 'react';
import { Container, H1TitleBody } from './style';
import { Link } from 'react-router-dom';
import GlobalStyle from '../../styles/global';

export default function CustomerBlockPage(props) {

    return (
        <Container>
            <GlobalStyle />

            {!props.idToken.claims.isAdmin &&
                <div>
                    <H1TitleBody>
                        O sistema está temporariamente indisponivel. Tente novamente mais tarde.
                    </H1TitleBody>

                    <H1TitleBody>
                        Se o erro persistir, atualize a página e tente navegar novamente.
                    </H1TitleBody>
                </div>           
            }

            {props.idToken.claims.isAdmin &&
                <div>
                    <H1TitleBody>
                        Não foi possivel realizar um pagamento usando seu cartão de crédito atual.&nbsp;<Link to="/authenticated/settings/changecreditcard">Alterar cartão de crédito.</Link>
                    </H1TitleBody>

                    <H1TitleBody>
                        Se você já alterou, atualize a página e tente navegar novamente.
                    </H1TitleBody>
                </div>  
            }

        </Container>
    )
}