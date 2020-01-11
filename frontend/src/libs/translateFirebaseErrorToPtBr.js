module.exports = (errorCode) => {
    var message;

    switch(errorCode) {
        // createUserWithEmailAndPassword
        case 'auth/email-already-in-use':
        case 'auth/email-already-exists':
            message = 'O usuário já existe.';
            break;
        case 'auth/invalid-email':
            message = 'E-mail inválido.';
            break;
        case 'auth/operation-not-allowed':
            message = 'Essa operação não é permitida.'
            break;
        case 'auth/weak-password':
        case 'auth/invalid-password':
            message = 'A senha deve conter 6 caracteres ou mais.';
            break;
        // signInWithEmailAndPassword
        case 'auth/user-disabled':
            message = 'Esse usuário foi desabilitado.';
            break;
        case 'auth/user-not-found':
            message = 'O usuário não existe ou foi deletado.';
            break;
        case 'auth/wrong-password':
            message = 'Senha inválida ou o usuário não existe.'
            break;
        default:
            message = 'Houve um erro ao concluir essa operação, tente novamente mais tarde.';
    }

    return message;
}