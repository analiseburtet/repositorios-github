$(document).ready(function(){

    function buscarRepositorios(){
        $.get('https://api.github.com/users/torvalds/repos?page=1&per_page=20', function(data){
            let statusHTML = ""
            $.each(data, function(i, status){
                statusHTML += '<li class="nav-item">'
                statusHTML += '<a class="nav-link repo-link">'+ status.name +'</a>'
                statusHTML += '</li>'
            })
            $('.repo-list').html(statusHTML)
        });
    }

    buscarRepositorios()

    $(".repo-list").on("click", "a.repo-link", function(e) {
        let repo = $( this ).text()
        buscarContribuidores(repo)
    })


    function buscarContribuidores(repo){
        const urlBase = 'https://api.github.com/repos/torvalds/'
        const urlRepo = urlBase + repo + '/collaborators'
        $.get(urlRepo, {  }).done(function(data){
            let statusHTML = ""
            $.each(data, function(i, status){
                console.log(status)
                statusHTML += '<li class="nav-item">'
                statusHTML +=  status
                statusHTML += '</li>'
            })
            $('.repo-list').html(statusHTML)
        });
    }  
});