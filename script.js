$(document).ready(function(){

    const urlBase = "https://api.github.com"
    let state = "open"

    async function buscarRepositorios(){
        const url = urlBase + '/search/repositories?q=stars:150000..300000'

        const response = await fetch(url)
        const data = await response.json()
        let array = data.items
        let statusHTML = ""
        array.forEach(i => {
            statusHTML += '<li class="nav-item border rounded mb-1">'
            statusHTML += '<a class="nav-link repo-link" data-repo-name="'+ i.full_name +'">'+ i.name +'</a>'
            statusHTML += '</li>'
        })
        $('.repo-list').html(statusHTML)
    }

    buscarRepositorios()

    $(".repo-list").on("click", "a.repo-link", function(e) {
        let repo = $(this).attr("data-repo-name")
        buscarContribuidores(repo)
        buscarIssues(repo)
        $(".hide").fadeIn("slow");
        $(this).toggleClass('active')
    })

    $(".issues-list").on("click", "a.issue-link", function(e) {
        $(".issue-hide").fadeIn("slow");
    })

    $("body").on("click", ".open", function(e) {
        state = "open"
    })

    $("body").on("click", ".open", function(e) {
        state = "closed"
    })

    async function buscarIssues(repo){
        const headers = {
            "Authorization": `Token GITHUB_TOKEN_HERE`
        }
        const url = urlBase + "/search/issues?q=state:"+ state + "+repo:" + repo + "+type:issue"
        const response = await fetch(url , {
            "method": "GET",
            "headers": headers
        })
        const data = await response.json()
        let array = data.items
        let statusHTML = ""
        array.forEach(i => {
            statusHTML += '<li class="nav-item border rounded mb-1">'
            statusHTML += '<a class="nav-link issue-link" data-issue-number="'+ i.number +'">'+ i.title +'</a>'
            statusHTML += '<div class="nav-link">'+ i.body +'</div>'
            statusHTML += '</li>'
        })
        $('.issues-list').html(statusHTML)

        $("body").on("click", ".issue-link", function(e) {
            let issueNumber = $(this).attr("data-issue-number")
            buscarComentarios(repo, issueNumber)
            $(this).toggleClass('active')
        })
    }  

    async function buscarContribuidores(repo){
        const headers = {
            "Authorization": `Token GITHUB_TOKEN_HERE`,
            "Accept": "application/vnd.github.cloak-preview"
        }
        const url = urlBase + "/repos/" + repo + "/contributors?q=contributions&order=desc"
        const response = await fetch(url , {
            "method": "GET",
            "headers": headers
        })
        const data = await response.json()
        let statusHTML = ""
        data.forEach(i => {
            statusHTML += '<li class="nav-item border rounded mb-1">'
            statusHTML += '<a class="nav-link">'+ i.login +'</a>'
            statusHTML += '</li>'
        })
        $('.constributors-list').html(statusHTML)
    }  

    async function buscarComentarios(repo){
        const headers = {
            "Authorization": `Token GITHUB_TOKEN_HERE`,
            "Accept": "application/vnd.github.cloak-preview" 
        }
        const url = urlBase + "/repos/" + repo + "/issues/"+ "19046" +"/comments"
        const response = await fetch(url , {
            "method": "GET",
            "headers": headers
        })
        const data = await response.json()
        let statusHTML = ""

        data.forEach(i => {
            statusHTML += '<div class="nav-item nav-link border rounded mb-1">'
            statusHTML += i.body
            statusHTML += '</div>'
        })
        $('.comments-list').html(statusHTML)
    }
});