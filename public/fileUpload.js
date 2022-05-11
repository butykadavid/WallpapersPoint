const fileBtn = document.getElementById('fileButton');

const fileChosen = document.getElementById('fileChosen');

fileBtn.addEventListener('change', function(){
    if(this.files[0] == undefined) return; 
    
    fileChosen.textContent = this.files[0].name
})