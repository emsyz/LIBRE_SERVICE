function checkPassword(){
    if(document.inscription.password.value != document.inscription.passwordCheck.value){
        document.inscription.passwordCheck.setCustomValidity("Veuillez introduire le même mot de passe");
    } else {
        document.inscription.passwordCheck.setCustomValidity("");	
    }    
}


function checkNewPassword(){
    if(document.editPassword.newPassword.value != document.editPassword.passwordCheck.value){
        document.editPassword.passwordCheck.setCustomValidity("Veuillez introduire le même mot de passe");
    } else {
        document.editPassword.passwordCheck.setCustomValidity("");	
    }    
}
