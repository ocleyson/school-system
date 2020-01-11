import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import GlobalStyle from '../../styles/global';
import {Header, H1Title, Main} from './style';

export default function Terms() {
  const [selectTitle, setSelectTitle] = useState(true);

  return (
    <div className="container">
      <GlobalStyle />

      <Header>
        <Link to="/">
          <H1Title>Slulp</H1Title>
        </Link>
      </Header>

      <Main select={selectTitle}>

        <h1 className="title service" onClick={() => setSelectTitle(true)}>Termos de Uso</h1>
        &nbsp;
        <h1 className="title">-</h1>
        &nbsp;
        <h1 className="title privacy" onClick={() => setSelectTitle(false)}>Políticas de Privacidade</h1>

        <p>Última modificação: 01 de setembro de 2019</p>

        <div className="service">
          <h2>
            Bem-vindo à Slulp!
          </h2>

          <p>Obrigado por usar nossos serviços. Ao usar nossos serviços, você concorda com estes termos. Por favor, leia-os atentamente.</p>

          <h2>Usando nossos serviços</h2>

          <p>Você deve seguir quaisquer políticas disponibilizadas a você em nossos Serviços.</p>

          <p>Não abuse dos nossos serviços. Por exemplo, não interfira em nossos Serviços ou tente acessá-los usando um método diferente da interface e das instruções que fornecemos. Você pode usar nossos Serviços apenas conforme permitido por lei. Podemos suspender ou interromper o fornecimento de nossos Serviços se você não cumprir com nossos termos ou políticas ou se estivermos investigando uma suspeita de má conduta.</p>

          <p>Os nossos Serviços podem apresentar alguns conteúdos que não pertencem à Slulp. Estes conteúdos é de exclusiva responsabilidade da entidade que o disponibiliza. Poderemos avaliar o conteúdo para determinar se é ilegal ou se viola as nossas políticas e poderemos remover ou recusar apresentar conteúdo que, de uma forma razoável, considerarmos que viola as nossas políticas ou a lei. Mas isso não significa necessariamente que analisamos o conteúdo. Portanto, não assuma que o fazemos.</p>

          <p>Poderemos enviar mensagens administrativas e outras informações.</p>

          <h2>A sua Conta Slulp</h2>

          <p>Você precisa de uma Conta da Slulp para usar nossos Serviços. Você pode criar sua própria Conta ou sua Conta pode ser atribuída a você por um administrador. Se você estiver usando uma Conta atribuída a você por um administrador, o mesmo poderá acessar ou desativar sua conta.</p>

          <p>Você é responsável pela atividade que acontece na ou através da sua Conta da Slulp. Tente não reutilizar sua senha em aplicativos de terceiros.</p>

          <h2>O seu Conteúdo em nossos Serviços</h2>

          <p>Nossos serviços permitem ao utilizador carregar, submeter, armazenar, enviar ou receber conteúdo. O utilizador mantém a propriedade de todos os direitos de propriedade intelectual que detenha sobre o referido conteúdo. Em suma, o que lhe pertence continuará a pertencer-lhe.</p>

          <p>Ao carregar, submeter, armazenar, enviar ou receber conteúdo para ou através dos nossos Serviços, você concede à Slulp (e somente a nós) uma licença internacional para utilizar, alojar, armazenar, reproduzir, modificar, criar trabalhos derivados (como os decorrentes de traduções, adaptações ou outras alterações que efetuarmos para que o conteúdo funcione melhor com os nossos Serviços), comunicar, publicar, executar e apresentar publicamente, bem como distribuir o referido conteúdo. Os direitos que o utilizador concede ao abrigo desta licença serão utilizados apenas para operar, promover e aperfeiçoar os nossos Serviços, assim como desenvolver novos serviços. Esta licença permanece em vigor mesmo que o utilizador deixe de utilizar os nossos Serviços</p>

          <h2>Acerca do Software em nossos Serviços</h2>

          <p>O utilizador não pode copiar, modificar, distribuir, vender ou alugar qualquer parte dos nossos Serviços ou do software neles incluído, nem utilizar engenharia reversa ou tentar extrair o código fonte do software, salvo se o utilizador tiver o nosso consentimento por escrito.</p>

          <p>O software de código aberto é importante para nós. Alguns softwares usados ​​em nossos Serviços podem ser oferecidos sob uma licença de código aberto que disponibilizaremos para você. Pode haver disposições na licença de código aberto que substituam expressamente alguns desses termos.</p>

          <h2>Modificação e Rescisão dos Serviços</h2>

          <p>Estamos constantemente a alterar e a melhorar os nossos Serviços. Podemos adicionar ou remover funcionalidades ou características, bem como suspender ou parar totalmente um Serviço. A Slulp pode ainda deixar de fornecer os Serviços ao utilizador ou adicionar ou criar novos limites aos Serviços em qualquer momento.</p>

          <p>Caso descontinuemos um Serviço, sempre que possível, avisaremos os utilizadores com uma antecedência razoável e dar-lhes-emos a possibilidade de obterem informações fora desse Serviço.</p>

          <h2>Responsabilidade pelos nossos Serviços</h2>

          <p>Nos casos em que tal seja permitido por lei, a Slulp, os fornecedores e distribuidores da Slulp não se responsabilizam pela perda de lucros, receitas ou dados, perdas financeiras ou danos indiretos, especiais, derivados, exemplares ou punitivos.</p>

          <p>Na medida em que tal seja permitido por lei, a responsabilidade total da Slulp e dos seus fornecedores e distribuidores por quaisquer queixas ao abrigo dos presentes termos de utilização, incluindo quaisquer garantias implícitas, está limitada ao valor que o utilizador pagou para utilizar os Serviços (ou, se optarmos por tal, ao fornecimento dos Serviços novamente).</p>

          <p>Em todos os casos, a Slulp, os seus fornecedores e distribuidores não serão responsáveis por qualquer perda ou dano que não seja razoavelmente previsível</p>

          <h2>Utilização dos nossos Serviços por empresas</h2>

          <p>Se você estiver usando nossos Serviços em nome de uma empresa, tal empresa aceita estes termos. Ela isentará de responsabilidade e indenizará a Slulp, executivos, agentes e trabalhadores de qualquer reivindicação, processo ou ação judicial proveniente de ou relacionado ao uso dos Serviços ou à violação destes termos, incluindo qualquer responsabilidade ou despesa resultante de reivindicações, perdas, danos, processos, julgamentos, custos de litígio e honorários advocatícios.</p>

          <h2>Acerca dos presentes Termos de Utilização</h2>

          <p>Poderemos modificar estes termos de utilização ou quaisquer termos de utilização adicionais que se apliquem a um Serviço para, por exemplo, refletir alterações à lei ou aos nossos Serviços. O utilizador deverá consultar os termos de utilização regularmente. Os avisos de modificação dos presentes termos de utilização serão publicados nesta página. As alterações não serão de aplicação retroativa e não entrarão em vigor num período inferior a trinta dias após a sua publicação. Contudo, as alterações relativas a novas funcionalidades de um Serviço ou as alterações efetuadas por motivos legais entrarão imediatamente em vigor. Caso o utilizador não aceite os termos de utilização modificados de um Serviço, deverá deixar de o utilizar.</p>

          <p>Em caso de conflito entre os presentes termos de utilização e os termos de utilização adicionais, estes últimos prevalecem sobre os primeiros.</p>

          <p>Os presentes termos de utilização controlam o relacionamento entre a Slulp e o utilizador, não criando quaisquer direitos a terceiros.</p>

          <p>Se o utilizador não respeitar os presentes termos de utilização e a Slulp não tomar medidas de imediato, tal não implica qualquer desistência por parte da Slulp de quaisquer direitos que lhe assistam (como, por exemplo, o de tomar medidas no futuro).</p>

          <p>Caso se venha a concluir que um determinado termo de utilização não é exequível, tal não afetará os restantes termos.</p>

        </div>

        <div className="privacy">
          <h2>Tipos de informações que coletamos quando usa nossos serviços</h2>

          <p>Coletamos informações para fornecer serviços melhores a todos os nossos usuários, o que inclui descobrir coisas básicas, como o idioma que você fala, até coisas mais complexas, como a versão do seu navegador ou sistema operacional, além das informações que você carrega, submete, armazena, envia ou recebe em nossos Serviços.</p>

          <h2>Itens que você cria ou nos fornece</h2>

          <p>Ao criar uma Conta da Slulp, você nos fornece informações pessoais que incluem seu nome, e-mail, informações de pagamento, endereço e uma senha.</p>

          <h2>Seus apps, navegadores e dispositivos</h2>

          <p>Coletamos informações sobre os apps, navegadores e dispositivos que você usa para acessar os serviços da Slulp, o que nos ajuda a fornecer recursos como atualizações automáticas.</p>

          <p>As informações que coletamos incluem identificadores exclusivos, tipo e configurações de navegador, tipo e configurações de dispositivo, sistema operacional, informações de rede móvel, incluindo nome e número de telefone da operadora e número da versão do aplicativo. Também coletamos informações sobre a interação de apps, navegadores e dispositivos com nossos serviços, incluindo endereço IP, relatórios de erros, atividade do sistema, além de data, hora e URL referenciador da sua solicitação.</p>
          
          <p>Coletamos essas informações quando um serviço da Slulp no seu dispositivo entra em contato com nossos servidores, por exemplo, quando você instala nosso App ou quando nosso Serviço verifica se há atualizações automáticas.</p>

          <h2>Usamos os dados para criar serviços melhores</h2>

          <p>Usamos as informações para fornecer nossos serviços, como criar exames escolares automaticamente, melhorar e manter nosso Serviço atualizado.</p>

          <h2>Alterações nesta política</h2>

          <p>Alteramos esta Política de Privacidade periodicamente. Nós não reduziremos seus direitos nesta Política de Privacidade sem seu consentimento explícito. Indicamos sempre a data em que as últimas alterações foram publicadas. Se as alterações forem significativas, forneceremos um aviso com mais destaque, o que inclui, notificação por e-mail das alterações da Política de Privacidade.</p>

        </div>

      </Main>


    </div>
  )
}