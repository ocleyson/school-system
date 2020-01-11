import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }
     body {
         font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
         font-size: 14px;
         text-rendering: optimizeLegibility !important;
         -webkit-font-smoothing: antialiased;
     }

     html, body, #root {
         height: 100%;
     }

     h1 {
         font-size: 20px;
     }
`;