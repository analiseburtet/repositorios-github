$(document).ready(function(){

    function buscarRepositorios(){
        $.get('https://api.github.com/search/repositories?q=stars:150000..300000', function(data){
            let statusHTML = ""
            $.each(data, function(i, status){
                statusHTML += '<li class="nav-item border rounded mb-1">'
                statusHTML += '<a class="nav-link repo-link">'+ status.name +'</a>'
                statusHTML += '</li>'
            })
            $('.repo-list').html(statusHTML)
        });
    }

    buscarRepositorios()

    $(".repo-list").on("click", "a.repo-link", function(e) {
        let repo = $( this ).text()
        buscarIssues()
        $(".hide").fadeIn("slow");
    })


    async function buscarIssues(){
        const headers = {
            "Authorization": `Token d34b0d359f9cbafaf361358ba2e0e4084ec9ecfe`
        }

        const url = "https://api.github.com/search/issues?q=state:open repo:freecodecamp/freecodecamp type:issue"
        const response = await fetch(url , {
            "method": "GET",
            "headers": headers
        })
        const data = await response.json()
        let statusHTML = ""
        $.each(data, function(i, status){
            statusHTML += '<li class="nav-item border rounded mb-1">'
            statusHTML += '<a class="nav-link repo-link">'+ 'titulo da issue' +'</a>'
            statusHTML += '</li>'
        })
        
        $('.issues-list').html(statusHTML)
    }  
});