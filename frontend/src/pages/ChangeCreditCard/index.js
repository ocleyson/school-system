import React from 'react';
import { DivContainer, H1Title } from './style';
import SubNavBar from '../../components/SubNavBar';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

export default function ChangeCreditCard(props) {

    return (
        <DivContainer>

            <SubNavBar>
                <H1Title>Cartão de Crédito</H1Title>
            </SubNavBar>

            <StripeProvider apiKey="">
                <Elements>
                    <CheckoutForm idToken={props.idToken}/>
                </Elements>
            </StripeProvider>
            
        </DivContainer>
    )
}