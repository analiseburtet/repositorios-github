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
        buscarIssues()
        $(".hide").fadeIn("slow");
    })

    $(".issues-list").on("click", "a.repo-link", function(e) {
        $(".issue-hide").fadeIn("slow");
    })

    async function buscarIssues(){
        const headers = {
            "Authorization": `Token GITHUB_TOKEN_HERE`
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