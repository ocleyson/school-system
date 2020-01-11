import React from 'react';
import { Link } from 'react-router-dom';
import GlobalStyle from '../../styles/global';
import { Header, H1Title } from './style';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

export default function Signup() {

    return (
        <div className="container">
            <GlobalStyle />

            <Header>
                <Link to="/">
                    <H1Title>Slulp</H1Title>
                </Link>
            </Header>

            <StripeProvider apiKey="">
                <Elements>
                    <CheckoutForm />
                </Elements>
            </StripeProvider>

        </div>
    )
}