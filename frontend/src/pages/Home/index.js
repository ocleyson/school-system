import React from 'react';
import { Link } from 'react-router-dom';
import {DivNav, H1Title, HeaderNavContainer, DivButtons, Section, SectionBlue, DivConatiner, DivText, Footer} from './style';
import { FaServer, FaCogs, FaUsers, FaMoneyCheckAlt, FaNewspaper } from 'react-icons/fa';
import { GiTrophyCup } from 'react-icons/gi'

export default function Home() {
    return (
        <>
            <HeaderNavContainer>
                <DivNav className="container">
                    <H1Title>Slulp</H1Title>

                    <DivButtons>
                        <Link to="signup" style={{marginRight: 30}}>
                            <nobr>Registre-se</nobr>
                        </Link>
                        <Link to="/login">
                            Entre
                        </Link>       
                    </DivButtons>
                </DivNav>
            </HeaderNavContainer>

            <Section>
                <DivConatiner className="container">
                    <DivText>
                        <h2>
                            Com as melhores tecnologias, direto ao ponto e do jeito certo.
                        </h2>
                        <p>
                            Não precisa fazer orçamento. A Slulp é um  sistema escolar customizável onde você pode criar seu próprio esquema de notas e alterar a hora que quiser.
                        </p>
                    </DivText>
                    <GiTrophyCup size={210} />
                </DivConatiner>
            </Section>

            <SectionBlue>
                <DivConatiner className="container">
                    <FaUsers size={230}/>
                    <DivText>
                        <h2>
                            Cada aluno tem sua conta.
                        </h2>
                        <p>
                            Ao registrar o aluno em uma turma, você também cria uma conta para ele em nosso sistema. Com essa conta ele pode acessar o boletim e gráficos de suas notas.
                        </p>
                    </DivText>
                </DivConatiner>
            </SectionBlue>

            <Section>
                <DivConatiner className="container">
                    <DivText>
                        <h2>
                            O melhor preço do mercado!
                        </h2>
                        <p>
                            Tudo isso por apenas R$ 0,2 mensais por aluno. Você ainda pode testar 15 dias grátis e se não gostar pode cancelar a hora que quiser.
                        </p>
                    </DivText>
                    <FaMoneyCheckAlt size={230} />
                </DivConatiner>
            </Section>

            <SectionBlue>
                <DivConatiner className="container">
                    <FaServer size={210} />
                    <DivText>
                        <h2>
                            Migramos os seus dados.
                        </h2>
                        <p>
                            Não precisa se preocupar em transferir o seu sistema para o nosso. Nós fazemos isso pra você. Basta entrar em contato conosco pelo nosso email contatoslulp@gmail.com
                        </p>
                    </DivText>
                </DivConatiner>
            </SectionBlue>

            <Section>
                <DivConatiner className="container">
                    <DivText>
                        <h2>
                            Não achou algo que precisa nas configurações?
                        </h2>
                        <p>
                            Não tem problema! O nosso sistema deve ser customizável, se você não achou algo que precisa nas configurações, você pode nos enviar um email com sugestões e responderemos o mais rápido possível.
                        </p>
                    </DivText>
                    <FaCogs size={230} />
                </DivConatiner>
            </Section>

            <SectionBlue>
                <DivConatiner className="container">
                    <FaNewspaper size={230} />
                    <DivText>
                        <h2>
                            As novidades não param por aqui.
                        </h2>
                        <p>
                            A Slulp conta com novas funcionalidades e atualizações constantes. Para conferir todas você pode testar os seus 15 dias grátis.
                        </p>
                    </DivText>
                </DivConatiner>
            </SectionBlue>

            <Footer>
                <strong>
                    Slulp &#169; {new Date().getFullYear()} - Todos os direitos reservados
                </strong>
                <span>
                    <Link to="terms">Termos de uso</Link> - <Link to="terms">Políticas de pivacidade</Link>
                </span>
                <strong>
                    CNPJ: XXXXXXXXXXXXXXX
                </strong>
                <span>
                    Contato: contatoslulp@gmail.com
                </span>
                <strong>
                    Bandeiras aceitas: Visa e Mastercard
                </strong>
            </Footer>
        </>
    )
}